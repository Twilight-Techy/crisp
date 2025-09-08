// app/utils/seed-crimes/page.tsx
"use client";

import React, { useEffect, useState } from "react";

const API_ENDPOINT = "/api/report"; // <- change to the actual route where your POST handler lives
const CENTER = { lat: 6.643802, lon: 3.389528 };
const NUM_REPORTS = 20;
const MAX_RADIUS_METERS = 1000; // how far from center (meters). Adjust as needed.

const incidentTypes = [
  "Theft",
  "Vandalism",
  "Assault",
  "Drug",
  "Suspicious",
  "Noise",
  "Traffic",
  "Other",
];

function metersToLatitudeDegrees(meters: number) {
  // ~111,320 meters per degree latitude (approx)
  return meters / 111320;
}
function metersToLongitudeDegrees(meters: number, atLatitude: number) {
  // longitude degrees scale with cos(latitude)
  return meters / (111320 * Math.cos((atLatitude * Math.PI) / 180));
}

/**
 * Return a uniformly distributed random point within a circle (in meters)
 * centered at centerLat, centerLon.
 */
function randomLatLonAround(centerLat: number, centerLon: number, maxMeters: number) {
  // Use sqrt(random) to ensure uniform distribution by area
  const r = Math.sqrt(Math.random()) * maxMeters;
  const theta = Math.random() * 2 * Math.PI;

  const dx = r * Math.cos(theta);
  const dy = r * Math.sin(theta);

  const deltaLat = metersToLatitudeDegrees(dy);
  const deltaLon = metersToLongitudeDegrees(dx, centerLat);

  return {
    lat: centerLat + deltaLat,
    lon: centerLon + deltaLon,
  };
}

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function SeedCrimesPage() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<
    { index: number; success: boolean; trackingCode?: string; error?: string }[]
  >([]);

  useEffect(() => {
    // run on load
    startSeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startSeed() {
    setRunning(true);
    setProgress(0);
    setResults([]);
    const localResults: { index: number; success: boolean; trackingCode?: string; error?: string }[] = [];

    // sample descriptions to vary reports
    const sampleDescriptions = [
      "Witnessed suspicious activity near building.",
      "Reported loud noises and disturbance.",
      "Person tried to break into a parked car.",
      "Graffiti observed on the wall.",
      "Physical altercation observed between two people.",
      "Illicit drug transaction suspected in the area.",
      "Vehicle speeding and dangerous driving.",
      "Other: concerned about safety in the area.",
    ];

    // Create a tiny dummy file for evidence so server's file upload is exercised.
    const dummyBlob = new Blob(["dummy evidence"], { type: "text/plain" });
    // Using File constructor so formData.append('evidence', file) behaves like a real file input.
    const dummyFile = new File([dummyBlob], "evidence.txt", { type: "text/plain" });

    // We'll do sequential requests to avoid hammering DB; you can parallelize later if desired.
    for (let i = 0; i < NUM_REPORTS; i++) {
      const randType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
      const description = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
      const { lat, lon } = randomLatLonAround(CENTER.lat, CENTER.lon, MAX_RADIUS_METERS);

      const formData = new FormData();
      formData.append("incidentType", randType);
      formData.append("location", `approx area ${i + 1}`);
      formData.append("description", `${description} (auto-seed #${i + 1})`);
      formData.append("anonymous", "false"); // set to true if you want anonymous reports
      formData.append("contactMethod", "name");
      formData.append("contactInfo", "Auto Seeder");
      formData.append("address", `Around center (${CENTER.lat.toFixed(6)}, ${CENTER.lon.toFixed(6)})`);
      formData.append("dateTime", new Date().toISOString());
      formData.append("latitude", String(lat));
      formData.append("longitude", String(lon));
      // append one dummy evidence file (server code expects getAll("evidence"))
      formData.append("evidence", dummyFile);

      try {
        const res = await fetch(API_ENDPOINT, {
          method: "POST",
          body: formData,
          // don't set Content-Type for formData; browser will set multipart boundary
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          localResults.push({ index: i + 1, success: false, error: data?.error || `HTTP ${res.status}` });
        } else {
          localResults.push({ index: i + 1, success: true, trackingCode: data?.trackingCode });
        }
      } catch (err: any) {
        localResults.push({ index: i + 1, success: false, error: String(err?.message || err) });
      }

      setProgress(Math.round(((i + 1) / NUM_REPORTS) * 100));
      setResults([...localResults]); // update UI
      // tiny delay so DB / external uploads (vercel blob) don't get rate limited. Adjust/remove as needed.
      await sleep(120);
    }

    setRunning(false);
  }

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h2>Auto Seed Reports (Demo)</h2>
      <p>
        This page will create <strong>{NUM_REPORTS}</strong> reports around{" "}
        <code>{CENTER.lat.toFixed(6)}, {CENTER.lon.toFixed(6)}</code>.
      </p>

      <div style={{ marginTop: 12 }}>
        <div style={{ width: 400, background: "#eee", borderRadius: 6 }}>
          <div
            style={{
              width: `${progress}%`,
              padding: "6px 10px",
              background: "#4caf50",
              color: "white",
              borderRadius: 6,
              transition: "width 200ms",
            }}
          >
            {progress}% complete
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => startSeed()}
          disabled={running}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            background: running ? "#999" : "#0070f3",
            color: "white",
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "Seeding..." : "Seed Now"}
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        <h4>Results</h4>
        <ul>
          {results.map((r) => (
            <li key={r.index}>
              #{r.index}: {r.success ? `OK (${r.trackingCode ?? "no code"})` : `ERR — ${r.error}`}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
        <div>Notes:</div>
        <ul>
          <li>Change <code>API_ENDPOINT</code> to your route if it's not <code>/api/report</code>.</li>
          <li>Adjust <code>MAX_RADIUS_METERS</code> to control spread of points.</li>
          <li>If your server expects different field names, update the FormData keys accordingly.</li>
        </ul>
      </div>
    </div>
  );
}
