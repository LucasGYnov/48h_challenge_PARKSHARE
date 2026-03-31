"use client";
import dynamic from "next/dynamic";
import { ZoneData } from "@/types";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">
      Chargement de la carte...
    </div>
  ),
});

export function MapWrapper({ initialZones }: { initialZones: ZoneData[] }) {
  // Pass the data down as a prop
  return <MapView zones={initialZones} />;
}