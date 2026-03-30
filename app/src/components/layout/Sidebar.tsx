"use client";
import { useFilters } from "@/context/FilterContext";
import { mockZones } from "@/data/mockData";
import { Search, SlidersHorizontal, BarChart3, Euro, Map as MapIcon } from "lucide-react";

export function Sidebar() {
  const { minScore, setMinScore, maxPrice, setMaxPrice, searchQuery, setSearchQuery, selectedDept, setSelectedDept } = useFilters();

  // --- LOGIQUE DYNAMIQUE ---
  // On récupère les départements uniques présents dans les données
  const deptNames: Record<string, string> = {
    "75": "Paris", "77": "Seine-et-Marne", "78": "Yvelines", "91": "Essonne",
    "92": "Hauts-de-Seine", "93": "Seine-Saint-Denis", "94": "Val-de-Marne", "95": "Val-d'Oise"
  };

  const availableDepts = Array.from(new Set(mockZones.map(z => z.zipCode.substring(0, 2))))
    .sort()
    .map(code => ({
      code,
      name: `${code} - ${deptNames[code] || 'Autre'}`
    }));

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col shrink-0 z-20">
      <div className="p-8 space-y-10">
        
        {/* Recherche */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Search className="w-3 h-3" /> Recherche
          </label>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ville..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-all"
          />
        </div>

        {/* Filtres */}
        <div className="space-y-8">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <SlidersHorizontal className="w-3 h-3" /> Analyse du marché
          </label>

          {/* Dropdown Départements (Boucle sur les données) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <MapIcon className="w-3 h-3 text-brand" /> Secteur Géo.
            </span>
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-900 text-[#f8fafc] border-none rounded-xl px-3 py-2.5 text-sm font-bold outline-none cursor-pointer hover:bg-black transition-colors"
            >
              <option value="all">Tous les secteurs</option>
              {availableDepts.map((d) => (
                <option key={d.code} value={d.code}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Slider Score */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><BarChart3 className="w-3 h-3 text-brand" /> Score Min.</span>
              <span className="text-xs font-black bg-[#0a0a0a] text-[#f8fafc] px-2 py-0.5 rounded">{minScore}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={minScore} 
              onChange={(e) => setMinScore(parseInt(e.target.value))} 
              className="w-full accent-brand h-1 cursor-pointer" 
            />
          </div>

          {/* Slider Prix */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><Euro className="w-3 h-3 text-brand" /> Prix Max</span>
              <span className="text-xs font-black bg-[#0a0a0a] text-[#f8fafc] px-2 py-0.5 rounded">{maxPrice}€</span>
            </div>
            <input 
              type="range" min="50" max="250" step="10" value={maxPrice} 
              onChange={(e) => setMaxPrice(parseInt(e.target.value))} 
              className="w-full accent-brand h-1 cursor-pointer" 
            />
          </div>
        </div>
      </div>
    </aside>
  );
}