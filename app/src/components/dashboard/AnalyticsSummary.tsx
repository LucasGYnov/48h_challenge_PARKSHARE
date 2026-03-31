"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { ZoneData } from "@/types";
import { Calculator, Target, Car, Home } from "lucide-react";

interface AnalyticsSummaryProps {
  zones: ZoneData[];
}

export function AnalyticsSummary({ zones }: AnalyticsSummaryProps) {
  const { 
    minScore, maxScore, maxTension, minMotorization, 
    searchQuery, selectedDept, showCriticalOnly 
  } = useFilters();

  const filteredZones = useMemo(() => {
    return zones.filter(zone => {
      const deptMatch = selectedDept === "all" || (zone.zipCode && String(zone.zipCode).startsWith(selectedDept));
      const tensionMatch = zone.avgTension <= maxTension;
      const motorizationMatch = zone.motorizationRate >= minMotorization;
      const searchMatch = zone.city ? String(zone.city).toLowerCase().includes(searchQuery.toLowerCase()) : searchQuery === ""; 
      const criticalMatch = showCriticalOnly ? (zone.potentialScore >= 80 && zone.avgTension <= 0.5) : true;
      return zone.potentialScore >= minScore && zone.potentialScore <= maxScore && tensionMatch && motorizationMatch && searchMatch && deptMatch && criticalMatch;
    });
  }, [zones, minScore, maxScore, maxTension, minMotorization, searchQuery, selectedDept, showCriticalOnly]);

  if (filteredZones.length === 0) return null;

  const avgScore = Math.round(filteredZones.reduce((acc, z) => acc + z.potentialScore, 0) / filteredZones.length);
  const avgTension = (filteredZones.reduce((acc, z) => acc + z.avgTension, 0) / filteredZones.length).toFixed(2);
  const avgMotorization = Math.round(filteredZones.reduce((acc, z) => acc + z.motorizationRate, 0) / filteredZones.length);
  const totalDwellings = filteredZones.reduce((acc, z) => acc + z.totalDwellings, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
      {/* SCORE MOYEN */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex flex-col mb-1">
          <div className="flex items-center gap-2 text-slate-400">
            <Target className="w-4 h-4 text-brand" />
            <span className="text-[10px] font-black uppercase tracking-widest">Score Moyen</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Indice d'opportunité global</p>
        </div>
        <div className="text-3xl font-black text-slate-900">{avgScore}%</div>
      </div>
      
      {/* TENSION MOYENNE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex flex-col mb-1">
          <div className="flex items-center gap-2 text-slate-400">
            <Calculator className="w-4 h-4 text-brand" />
            <span className="text-[10px] font-black uppercase tracking-widest">Tension Moyenne</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Ratio places / logements</p>
        </div>
        <div className="text-3xl font-black text-slate-900">{avgTension}</div>
      </div>

      {/* MOTORISATION MOYENNE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex flex-col mb-1">
          <div className="flex items-center gap-2 text-slate-400">
            <Car className="w-4 h-4 text-brand" />
            <span className="text-[10px] font-black uppercase tracking-widest">Motorisation Moy.</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Équipement des ménages</p>
        </div>
        <div className="text-3xl font-black text-slate-900">{avgMotorization}%</div>
      </div>

      {/* VOLUME LOGEMENTS */}
      <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10"><Home className="w-24 h-24 text-brand" /></div>
        <div className="flex flex-col mb-1 z-10">
          <div className="flex items-center gap-2 text-slate-400">
            <Home className="w-4 h-4 text-[#e8bf0d]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Volume Logements</span>
          </div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Taille du marché cible</p>
        </div>
        <div className="text-3xl font-black text-[#fcf8e6] z-10">{totalDwellings.toLocaleString()}</div>
      </div>
    </div>
  );
}