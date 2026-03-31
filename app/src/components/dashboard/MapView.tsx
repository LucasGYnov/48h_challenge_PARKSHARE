"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useFilters } from "@/context/FilterContext";
import { Layers, MapPin } from "lucide-react";
import { ZoneData } from "@/types";

// 1. Définition du marqueur personnalisé (Pins Jaunes)
const createCustomIcon = () => {
  return L.divIcon({
    className: "bg-transparent border-none",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e8bf0d" stroke="#0a0a0a" stroke-width="1.5" style="width: 36px; height: 36px; filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25));"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#ffffff"></circle></svg>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// 2. Échelle de couleurs dynamique selon la métrique choisie
const getZoneColor = (value: number, metric: "score" | "motorization") => {
  if (value === 0) return 'transparent';
  if (metric === "score") {
    return value > 80 ? '#c4a10a' : value > 60 ? '#e8bf0d' : value > 40 ? '#f2d663' : value > 20 ? '#f9ebae' : '#fefce8';
  } else {
    return value > 75 ? '#c4a10a' : value > 60 ? '#e8bf0d' : value > 45 ? '#f2d663' : value > 30 ? '#f9ebae' : '#fefce8';
  }
};

interface MapViewProps {
  zones: ZoneData[];
}

export default function MapView({ zones }: MapViewProps) {
  const { 
    minScore, maxTension, minMotorization, 
    searchQuery, selectedDept, 
    showCriticalOnly, mapMetric 
  } = useFilters();
  
  const [viewMode, setViewMode] = useState<"points" | "zones">("points");
  const [combinedGeoData, setCombinedGeoData] = useState<any>(null);

  const parkshareIcon = createCustomIcon();

  // Chargement et fusion des fichiers IDF + Paris
  useEffect(() => {
    Promise.all([
      fetch("/data/communes-ile-de-france.geojson").then(res => res.json()),
      fetch("/data/communes-75-paris.geojson").then(res => res.json())
    ])
    .then(([idfData, parisData]) => {
      const filteredIdfFeatures = idfData.features.filter(
        (f: any) => f.properties.nom !== "Paris" && f.properties.code !== "75056"
      );
      setCombinedGeoData({
        type: "FeatureCollection",
        features: [...filteredIdfFeatures, ...parisData.features]
      });
    })
    .catch((err) => console.error("Erreur chargement GeoJSON:", err));
  }, []);

  // --- LOGIQUE DE FILTRAGE (COMMUNE AUX POINTS ET AUX SECTEURS) ---
  const filteredZones = zones.filter(zone => {
    const deptMatch = selectedDept === "all" || (zone.zipCode && String(zone.zipCode).startsWith(selectedDept));
    const tensionMatch = zone.avgTension <= maxTension;
    const motorizationMatch = zone.motorizationRate >= minMotorization;
    const searchMatch = zone.city 
      ? String(zone.city).toLowerCase().includes(searchQuery.toLowerCase()) 
      : searchQuery === ""; 
    
    const criticalMatch = showCriticalOnly ? (zone.potentialScore >= 80 && zone.avgTension <= 0.5) : true;

    return zone.potentialScore >= minScore && tensionMatch && motorizationMatch && searchMatch && deptMatch && criticalMatch;
  });

  // Fonction de liaison entre le GeoJSON et les zones FILTRÉES
  const findFilteredZoneByFeature = (properties: any) => {
    if (!properties || !properties.nom) return null;
    const nomGeo = properties.nom.toLowerCase().trim();
    const normalizedParis = nomGeo.replace(" arrondissement", "").trim();
    
    // On cherche UNIQUEMENT dans filteredZones
    return filteredZones.find(z => {
      const cityStr = String(z.city).toLowerCase().trim();
      return cityStr === nomGeo || cityStr === normalizedParis;
    });
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative z-0 min-h-[550px] border border-slate-200 shadow-xl bg-white">
      
      {/* Toggle Points/Secteurs */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] flex bg-white p-1 rounded-2xl shadow-2xl border border-slate-200">
        <button 
          onClick={() => setViewMode("points")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === "points" ? "bg-[#0a0a0a] text-[#f8fafc]" : "text-slate-400 hover:bg-slate-50"}`}
        >
          <MapPin className={`w-4 h-4 ${viewMode === "points" ? "text-brand" : ""}`} /> POINTS
        </button>
        <button 
          onClick={() => setViewMode("zones")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${viewMode === "zones" ? "bg-[#0a0a0a] text-[#f8fafc]" : "text-slate-400 hover:bg-slate-50"}`}
        >
          <Layers className={`w-4 h-4 ${viewMode === "zones" ? "text-brand" : ""}`} /> SECTEURS
        </button>
      </div>

      <MapContainer center={[48.8566, 2.3522]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        
        {viewMode === "points" ? (
          // Affichage des Marqueurs filtrés
          filteredZones.map((zone) => (
            <Marker key={zone.id || zone.zipCode} position={[zone.lat, zone.lng]} icon={parkshareIcon}>
              <Popup>
                <div className="p-2 font-bold text-center">
                  <p className="text-slate-900 uppercase text-[10px] tracking-widest">{zone.city}</p>
                  <p className="text-xl text-brand-dark mb-1">{zone.potentialScore}%</p>
                  <div className="text-xs text-slate-500 font-normal border-t pt-2 mt-2 space-y-1">
                    <p>Tension: {zone.avgTension}</p>
                    <p>Motorisation: {zone.motorizationRate}%</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        ) : (
          // Affichage des Secteurs filtrés
          combinedGeoData && <GeoJSON 
            key={`geojson-${mapMetric}-${filteredZones.length}`} // Key dynamique pour forcer le refresh au filtrage
            data={combinedGeoData} 
            style={(f) => {
              const zone = findFilteredZoneByFeature(f.properties);
              
              // SI LA ZONE N'EST PAS DANS filteredZones, ON LA REND INVISIBLE
              if (!zone) {
                return { fillOpacity: 0, weight: 0, color: 'transparent' };
              }

              const valueToMap = mapMetric === "score" ? zone.potentialScore : zone.motorizationRate;
              return {
                fillColor: getZoneColor(valueToMap, mapMetric),
                weight: 1, 
                color: 'white', 
                fillOpacity: 0.7
              };
            }} 
            onEachFeature={(feature, layer) => {
              const zone = findFilteredZoneByFeature(feature.properties);
              if (zone) {
                layer.bindPopup(`
                  <div style="font-family: sans-serif; text-align:center;">
                    <strong style="text-transform:uppercase; font-size:11px; color:#666;">${zone.city}</strong>
                    <div style="color:#e8bf0d; font-size:22px; font-weight:900; margin:5px 0;">
                      ${mapMetric === "score" ? `${zone.potentialScore}%` : `${zone.motorizationRate}%`}
                    </div>
                    <div style="font-size:10px; background:#f8fafc; padding:4px; border-radius:4px;">
                      ${mapMetric === "score" ? 'Score de Potentiel' : 'Taux de Motorisation'}
                    </div>
                  </div>
                `);
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}