"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  initial?: [number, number] | null; // [lon, lat] - when passed, MapPicker will set marker & flyTo but WILL NOT reverse geocode
  onSelect?: (coords: [number, number], address?: string | null) => void; // called after a user picks a point on the map (with reverse-geocoded address)
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

  // helper: reverse geocode lon,lat using MapTiler
  const reverseGeocode = async (lon: number, lat: number) => {
    const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
    if (!key) return null;
    try {
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(`${lon},${lat}`)}.json?key=${key}&language=en&limit=1`;
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

  // When `initial` prop changes:
  //  - if initial === null -> remove marker
  //  - if initial is coords -> set marker and fly to it (wait for map load if necessary)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const addOrUpdateMarker = (lngLat: [number, number]) => {
      if (!markerRef.current) {
        markerRef.current = new maplibregl.Marker({ color: markerColor }).setLngLat(lngLat).addTo(map);
      } else {
        markerRef.current.setLngLat(lngLat);
      }
      // quick, snappy movement
      map.easeTo({ center: lngLat, zoom: 14, duration: 350, essential: true });
    };

    const removeMarker = () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };

    if (initial) {
      // If the map style is already loaded we can add the marker immediately,
      // otherwise wait until 'load' so addTo(map) reliably attaches the DOM element.
      if ((map as any).isStyleLoaded && (map as any).isStyleLoaded()) {
        addOrUpdateMarker(initial);
      } else {
        // ensure we only add after the style has loaded
        const onLoad = () => {
          addOrUpdateMarker(initial);
          map.off("load", onLoad);
        };
        map.on("load", onLoad);
      }
    } else {
      // initial is null -> clear marker
      removeMarker();
    }
  }, [initial, markerColor]);

  // click -> set marker + reverse geocode -> call onSelect once with address
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let mounted = true;

    const onClick = async (e: maplibregl.MapMouseEvent) => {
      const lon = Number(e.lngLat.lng);
      const lat = Number(e.lngLat.lat);

      // If the style hasn't loaded and a marker exists, ensure we wait — but for clicks the style will normally be loaded.
      if (!markerRef.current) {
        markerRef.current = new maplibregl.Marker({ color: markerColor }).setLngLat([lon, lat]).addTo(map);
      } else {
        markerRef.current.setLngLat([lon, lat]);
      }

      // center quickly
      map.easeTo({ center: [lon, lat], zoom: 14, duration: 350, essential: true });

      // reverse geocode then notify parent once (address may be null)
      try {
        const addr = await reverseGeocode(lon, lat);
        if (!mounted) return;
        if (onSelect) onSelect([lon, lat], addr);
      } catch (err) {
        console.error("MapPicker reverseGeocode error", err);
        if (onSelect) onSelect([lon, lat], null);
      }
    };

    map.on("click", onClick);
    return () => {
      mounted = false;
      map.off("click", onClick);
    };
  }, [onSelect, markerColor]);

  return <div ref={containerRef} className={className ?? "w-full h-96 rounded-md overflow-hidden"} />;
}
