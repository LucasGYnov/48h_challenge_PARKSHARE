"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { mockZones } from "@/data/mockData";
import { useFilters } from "@/context/FilterContext";
import { Layers, MapPin } from "lucide-react";

const createCustomIcon = () => {
  return L.divIcon({
    className: "bg-transparent border-none",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e8bf0d" stroke="#0a0a0a" stroke-width="1.5" style="width: 36px; height: 36px; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.2));"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#ffffff"></circle></svg>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const getZoneColor = (score: number) => {
  if (score === 0) return 'transparent';
  return score > 90 ? '#c4a10a' : score > 70 ? '#e8bf0d' : score > 50 ? '#f2d663' : score > 30 ? '#f9ebae' : '#fefce8';
};

export default function MapView() {
  const { minScore, maxPrice, searchQuery, selectedDept } = useFilters();
  const [viewMode, setViewMode] = useState<"points" | "zones">("points");
  const [geoData, setGeoData] = useState<any>(null);
  const parkshareIcon = createCustomIcon();

  useEffect(() => {
    fetch("/data/communes-ile-de-france.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredZones = mockZones.filter(zone => {
  const deptMatch = selectedDept === "all" || zone.zipCode.startsWith(selectedDept);
  return zone.potentialScore >= minScore && 
         zone.avgParkingPrice <= maxPrice &&
         zone.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
         deptMatch;
});

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative z-0 min-h-[550px] border border-slate-200 shadow-xl bg-white">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] flex bg-white p-1 rounded-2xl shadow-2xl border border-slate-200">
        <button 
          onClick={() => setViewMode("points")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === "points" ? "bg-[#0a0a0a] text-[#f8fafc]" : "text-slate-400"}`}
        >
          <MapPin className={`w-4 h-4 ${viewMode === "points" ? "text-brand" : ""}`} /> POINTS
        </button>
        <button 
          onClick={() => setViewMode("zones")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === "zones" ? "bg-[#0a0a0a] text-[#f8fafc]" : "text-slate-400"}`}
        >
          <Layers className={`w-4 h-4 ${viewMode === "zones" ? "text-brand" : ""}`} /> SECTEURS
        </button>
      </div>

      <MapContainer center={[48.8566, 2.3522]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {viewMode === "points" ? (
          filteredZones.map((zone) => (
            <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={parkshareIcon}>
              <Popup>
                <div className="p-1 font-bold">
                  <p className="text-slate-900 uppercase text-[10px] tracking-widest">{zone.city}</p>
                  <p className="text-lg text-brand-dark">{zone.potentialScore}%</p>
                </div>
              </Popup>
            </Marker>
          ))
        ) : (
          geoData && <GeoJSON data={geoData} style={(f) => ({
            fillColor: getZoneColor(mockZones.find(z => z.city === f.properties.nom)?.potentialScore || 0),
            weight: 1, color: 'white', fillOpacity: 0.7
          })} />
        )}
      </MapContainer>
    </div>
  );
}