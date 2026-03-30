"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">
      Chargement de la carte...
    </div>
  ),
});

export function MapWrapper() {
  return <MapView />;
}