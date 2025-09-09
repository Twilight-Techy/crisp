"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  initial?: [number, number] | null; // [lon, lat]
  // now passes optional address string as second arg
  onSelect?: (coords: [number, number], address?: string | null) => void;
  markerColor?: string;
  className?: string;
};

export default function MapPicker({
  initial = null,
  onSelect,
  markerColor = "#2b9af3",
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // helper: reverse geocode lon,lat
  const reverseGeocode = async (lon: number, lat: number) => {
    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    if (!key) return null;
    try {
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(`${lon},${lat}`)}.json?key=${key}&language=en`;
      const r = await fetch(url);
      const data = await r.json();
      const feat = data?.features?.[0];
      const address = feat?.properties?.label || feat?.place_name || feat?.text || feat?.properties?.name || null;
      return address;
    } catch (err) {
      console.error("MapPicker reverseGeocode error", err);
      return null;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // init map once
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
        center: initial ?? [-74.0, 40.7],
        zoom: initial ? 14 : 12,
      });

      mapRef.current.addControl(new maplibregl.NavigationControl());
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {
          // ignore
        }
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set initial marker if provided or update when map created
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const setMarkerAndMaybeNotify = async (lngLat: [number, number], shouldNotify = true) => {
      if (!markerRef.current) {
        markerRef.current = new maplibregl.Marker({ color: markerColor }).setLngLat(lngLat).addTo(map);
      } else {
        markerRef.current.setLngLat(lngLat);
      }

      // Use a short easeTo animation for snappier UX. For instant, use map.jumpTo({ center: lngLat, zoom: 14 })
      map.easeTo({ center: lngLat, zoom: 14, duration: 350, essential: true });

      if (shouldNotify && onSelect) {
        // call onSelect immediately with coords so caller can react quickly
        onSelect(lngLat, null);

        // perform reverse geocode in background and notify when we have an address
        reverseGeocode(lngLat[0], lngLat[1])
          .then((addr) => {
            if (addr && onSelect) onSelect(lngLat, addr);
          })
          .catch((err) => {
            console.error("reverseGeocode background error", err);
          });
      }
    };

    if (initial) {
      setMarkerAndMaybeNotify(initial, true);
    }
  }, [initial, markerColor, onSelect]);

  // click -> set marker + reverse geocode + call onSelect
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onClick = async (e: maplibregl.MapMouseEvent) => {
      const lon = Number(e.lngLat.lng);
      const lat = Number(e.lngLat.lat);

      if (!markerRef.current) {
        markerRef.current = new maplibregl.Marker({ color: markerColor }).setLngLat([lon, lat]).addTo(map);
      } else {
        markerRef.current.setLngLat([lon, lat]);
      }

      // snap/ease quickly
      map.easeTo({ center: [lon, lat], zoom: 14, duration: 350, essential: true });

      if (onSelect) {
        onSelect([lon, lat], null);
        // resolve address async and notify again when available
        reverseGeocode(lon, lat)
          .then((addr) => {
            if (addr) onSelect([lon, lat], addr);
          })
          .catch((err) => console.error("MapPicker reverseGeocode error", err));
      }
    };

    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [onSelect, markerColor]);

  return <div ref={containerRef} className={className ?? "w-full h-96 rounded-md overflow-hidden"} />;
}
