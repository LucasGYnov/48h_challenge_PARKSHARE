"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useFilters } from "@/context/FilterContext";
import { 
  Search, SlidersHorizontal, BarChart3, Activity, 
  Map as MapIcon, Car, AlertTriangle, Layers, 
  Menu, X, RotateCcw 
} from "lucide-react";

interface SidebarProps {
  availableDepts: { code: string; name: string }[];
}

export function Sidebar({ availableDepts }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const { 
    minScore, setMinScore, 
    maxScore, setMaxScore,
    maxTension, setMaxTension, 
    minMotorization, setMinMotorization,
    searchQuery, setSearchQuery, 
    selectedDept, setSelectedDept,
    showCriticalOnly, setShowCriticalOnly,
    mapMetric, setMapMetric
  } = useFilters();

  if (pathname.includes("/analytics")) return null;

  // Réinitialisation avec Min à 0 et Max à 100
  const handleResetFilters = () => {
    setMinScore(0);
    setMaxScore(100);
    setMaxTension(1);
    setMinMotorization(0);
    setSearchQuery("");
    setSelectedDept("all");
    setShowCriticalOnly(false);
    setMapMetric("score");
  };

  return (
    <aside className={`bg-white border-r border-slate-100 flex flex-col shrink-0 z-20 transition-all duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-20'}`}>
      
      <div className={`h-20 flex items-center border-b border-slate-100 shrink-0 transition-all ${isOpen ? 'justify-between px-8' : 'justify-center'}`}>
        {isOpen && (
          <span className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand" /> Filtres
          </span>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-brand-dark rounded-xl transition-all shadow-sm"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto ${isOpen ? 'p-8 opacity-100' : 'p-0 opacity-0 overflow-hidden'}`}>
        {isOpen && (
          <div className="space-y-10">
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Search className="w-3 h-3" /> Recherche
              </label>
              <input 
                type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ville..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>

            <div className="space-y-8">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <SlidersHorizontal className="w-3 h-3" /> Analyse Immobilière
              </label>

              <div 
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${showCriticalOnly ? 'bg-brand/10 border-brand' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                onClick={() => setShowCriticalOnly(!showCriticalOnly)}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${showCriticalOnly ? 'text-brand-dark' : 'text-slate-400'}`} />
                  <span className={`text-xs font-bold ${showCriticalOnly ? 'text-brand-dark' : 'text-slate-500'}`}>Secteurs Critiques</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${showCriticalOnly ? 'bg-brand' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${showCriticalOnly ? 'translate-x-4' : ''}`} />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <MapIcon className="w-3 h-3 text-brand" /> Secteur Géo.
                </span>
                <select 
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-[#0a0a0a] text-[#f8fafc] border-none rounded-xl px-3 py-2.5 text-sm font-bold outline-none cursor-pointer"
                >
                  <option value="all">Toute l'Île-de-France</option>
                  {availableDepts.map((d) => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Fourchette de Score (Min et Max) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><BarChart3 className="w-3 h-3 text-brand" /> Score Min.</span>
                  <span className="text-xs font-black bg-[#0a0a0a] text-[#f8fafc] px-2 py-0.5 rounded">{minScore}%</span>
                </div>
                <input type="range" min="0" max="100" value={minScore} onChange={(e) => setMinScore(parseInt(e.target.value))} className="w-full accent-[#e8bf0d] h-1 cursor-pointer" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><BarChart3 className="w-3 h-3 text-brand" /> Score Max.</span>
                  <span className="text-xs font-black bg-[#0a0a0a] text-[#f8fafc] px-2 py-0.5 rounded">{maxScore}%</span>
                </div>
                <input type="range" min="0" max="100" value={maxScore} onChange={(e) => setMaxScore(parseInt(e.target.value))} className="w-full accent-[#e8bf0d] h-1 cursor-pointer" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><Activity className="w-3 h-3 text-brand" /> Tension Max.</span>
                  <span className="text-xs font-black bg-[#0a0a0a] text-[#f8fafc] px-2 py-0.5 rounded">{maxTension}</span>
                </div>
                <input type="range" min="0" max="1" step="0.1" value={maxTension} onChange={(e) => setMaxTension(parseFloat(e.target.value))} className="w-full accent-[#e8bf0d] h-1 cursor-pointer" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><Car className="w-3 h-3 text-brand" /> Motorisation Min.</span>
                  <span className="text-xs font-black bg-[#0a0a0a] text-[#f8fafc] px-2 py-0.5 rounded">{minMotorization}%</span>
                </div>
                <input type="range" min="0" max="100" value={minMotorization} onChange={(e) => setMinMotorization(parseInt(e.target.value))} className="w-full accent-[#e8bf0d] h-1 cursor-pointer" />
              </div>

            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                <Layers className="w-3 h-3" /> Rendu Carte (Secteurs)
              </label>
              <select 
                value={mapMetric}
                onChange={(e) => setMapMetric(e.target.value as "score" | "motorization")}
                className="w-full bg-slate-100 text-slate-900 border-none rounded-xl px-3 py-2.5 text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-brand"
              >
                <option value="score">Couleurs par Score Global</option>
                <option value="motorization">Couleurs par Motorisation</option>
              </select>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button 
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-[#0a0a0a] text-slate-600 hover:text-[#f8fafc] transition-all rounded-xl text-xs font-black uppercase tracking-widest shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </button>
            </div>

          </div>
        )}
      </div>
    </aside>
  );
}