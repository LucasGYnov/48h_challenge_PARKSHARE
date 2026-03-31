"use client";

import { useState, useEffect, useMemo } from "react";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { Card } from "@/components/ui/Card";
import { MapWrapper } from "@/components/dashboard/MapWrapper";
import { DataTableModal } from "@/components/dashboard/DataTableModal";
import { useFilters } from "@/context/FilterContext";
import { ZoneData } from "@/types";
import { Maximize2, AlertTriangle } from "lucide-react";

export default function Home() {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    minScore, maxScore, maxTension, minMotorization, 
    searchQuery, selectedDept, showCriticalOnly 
  } = useFilters();
  
  const [modalType, setModalType] = useState<'residences' | 'tension' | 'critical' | 'opportunities' | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/zones');
        if (!res.ok) throw new Error("Erreur lors de la récupération des données");
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Réponse serveur invalide (pas du JSON)");
        }

        const data = await res.json();
        setZones(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredZones = useMemo(() => {
    return zones.filter(zone => {
      const deptMatch = selectedDept === "all" || (zone.zipCode && String(zone.zipCode).startsWith(selectedDept));
      const tensionMatch = zone.avgTension <= maxTension;
      const motorizationMatch = zone.motorizationRate >= minMotorization;
      const searchMatch = zone.city 
        ? String(zone.city).toLowerCase().includes(searchQuery.toLowerCase()) 
        : searchQuery === ""; 
      
      const criticalMatch = showCriticalOnly ? (zone.potentialScore >= 80 && zone.avgTension <= 0.5) : true;
      const scoreMatch = zone.potentialScore >= minScore && zone.potentialScore <= maxScore;

      return scoreMatch && tensionMatch && motorizationMatch && searchMatch && deptMatch && criticalMatch;
    });
  }, [zones, minScore, maxScore, maxTension, minMotorization, searchQuery, selectedDept, showCriticalOnly]);

  const topThree = [...filteredZones]
    .sort((a, b) => b.potentialScore - a.potentialScore)
    .slice(0, 3);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 text-slate-900">
      <div className="w-12 h-12 border-4 border-[#e8bf0d] border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black uppercase tracking-widest text-slate-400">Chargement Parkshare...</p>
    </div>
  );

  if (error) return (
    <div className="h-screen flex items-center justify-center text-red-500 font-bold">
      Erreur : {error}
    </div>
  );

  return (
    <div className="flex flex-col gap-8 h-full max-w-[1600px] mx-auto pb-10">
      
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          <span className="highlight-yellow px-2">Vue d'ensemble</span> des zones
        </h1>
        <p className="text-slate-500 text-lg">
          Potentiel de déploiement <span className="font-bold text-slate-900">Parkshare</span> ({filteredZones.length} secteurs affichés).
        </p>
      </div>
      
      <KpiCards 
        zones={filteredZones} 
        onOpenResidences={() => setModalType('residences')}
        onOpenTension={() => setModalType('tension')}
        onOpenCritical={() => setModalType('critical')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-[550px] mb-8">
        <Card className="lg:col-span-2 p-1 bg-white border border-slate-200 overflow-hidden shadow-sm relative group">
          <MapWrapper initialZones={zones} />
        </Card>
        
        {/* Panneau Ranking / Top Opportunités */}
        <Card className="flex flex-col gap-6 p-6 bg-slate-50 border border-slate-200 shadow-sm relative h-full">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Top Opportunités</h3>
            <button onClick={() => setModalType('opportunities')} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-[#e8bf0d]" title="Voir tout le classement">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto">
            {topThree.length > 0 ? topThree.map((zone, index) => (
              <div 
                key={zone.id} 
                onClick={() => setModalType('opportunities')}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-slate-800 hover:border-[#e8bf0d] transition-all shadow-md cursor-pointer"
              >
                <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-[#e8bf0d] text-lg">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-bold text-[#f8fafc] text-sm truncate max-w-[120px]">{zone.city}</p>
                  {/* <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight mt-0.5">
                    Tension: <span className="text-white font-black">{zone.avgTension.toFixed(2)}</span>
                  </p> */}
                </div>
                <div className="text-right font-black text-[#e8bf0d] text-2xl">{zone.potentialScore}%</div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm font-bold text-center mt-10">Aucune zone ne correspond à vos critères.</p>
            )}
          </div>

          {/* Expert Insights */}
          <div className="mt-auto p-5 bg-[#0a0a0a] rounded-2xl shadow-xl border border-white/5 relative overflow-hidden group cursor-pointer shrink-0" onClick={() => setModalType('critical')}>
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
               <AlertTriangle className="text-[#e8bf0d] w-5 h-5" />
            </div>
            <div className="relative z-10 text-sm text-[#f8fafc]/90 leading-relaxed font-medium">
              <span className="text-[#e8bf0d] font-black uppercase text-[10px] block mb-2 tracking-widest">Analyse Dynamique</span>
              Filtre actuel : <span className="text-white font-black underline decoration-[#e8bf0d] decoration-2 underline-offset-4">{minScore}% à {maxScore}%</span>. 
              <br/>{filteredZones.length} zones critiques identifiées.
            </div>
          </div>
        </Card>
      </div>

      <DataTableModal isOpen={modalType === 'residences'} onClose={() => setModalType(null)} title="Résidences Analysées" data={filteredZones} />
      <DataTableModal isOpen={modalType === 'tension'} onClose={() => setModalType(null)} title="Analyse de Tension" data={[...filteredZones].sort((a, b) => a.avgTension - b.avgTension)} />
      <DataTableModal isOpen={modalType === 'critical'} onClose={() => setModalType(null)} title={`Zones Critiques (${minScore}% - ${maxScore}%)`} data={[...filteredZones].sort((a,b) => b.potentialScore - a.potentialScore)} />
      <DataTableModal isOpen={modalType === 'opportunities'} onClose={() => setModalType(null)} title="Classement Complet" data={[...filteredZones].sort((a,b) => b.potentialScore - a.potentialScore)} />
    </div>
  );
}