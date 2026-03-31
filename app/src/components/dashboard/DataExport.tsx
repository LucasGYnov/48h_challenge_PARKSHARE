"use client";

import { useState, useMemo } from "react";
import { useFilters } from "@/context/FilterContext";
import { ZoneData } from "@/types";
import { Download, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface DataExportProps {
  zones: ZoneData[];
}

export function DataExport({ zones }: DataExportProps) {
  const { 
    minScore, maxScore, maxTension, minMotorization, 
    searchQuery, selectedDept, showCriticalOnly 
  } = useFilters();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ZoneData; direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 8;

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

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredZones];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredZones, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key: keyof ZoneData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleExportCSV = () => {
    const headers = ["Ville", "Code Postal", "Score de Potentiel (%)", "Taux de Tension", "Motorisation (%)", "Total Logements", "Places Existantes"];
    const csvRows = sortedData.map(z => [
      `"${z.city}"`, 
      z.zipCode,
      z.potentialScore,
      z.avgTension,
      z.motorizationRate,
      z.totalDwellings,
      z.totalParking
    ].join(","));

    const csvContent = "\uFEFF" + [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Parkshare_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0a0a0a] rounded-2xl shadow-xl flex flex-col border border-slate-800 relative overflow-hidden w-full max-w-full">
      {/* HEADER */}
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between relative z-10">
        <div>
          <h3 className="font-bold text-[#fcf8e6] text-lg">Export des données brutes</h3>
          <p className="text-sm text-slate-400">{filteredZones.length} secteurs correspondent à vos filtres actuels.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={filteredZones.length === 0}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#e8bf0d] text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#c4a10a] transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Télécharger CSV
        </button>
      </div>

      {/* ZONE DE SCROLL HORIZONTAL PROPRE */}
      <div className="relative w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] p-6">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-4 py-2 cursor-pointer hover:text-[#e8bf0d]" onClick={() => requestSort('city')}>Ville <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-4 py-2 cursor-pointer hover:text-[#e8bf0d]" onClick={() => requestSort('zipCode')}>CP <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-4 py-2 text-center cursor-pointer hover:text-[#e8bf0d]" onClick={() => requestSort('potentialScore')}>Score <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-4 py-2 text-center cursor-pointer hover:text-[#e8bf0d]" onClick={() => requestSort('avgTension')}>Tension <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-4 py-2 text-center cursor-pointer hover:text-[#e8bf0d]" onClick={() => requestSort('motorizationRate')}>Motorisation <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-4 py-2 text-center cursor-pointer hover:text-[#e8bf0d]" onClick={() => requestSort('totalDwellings')}>Logements <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="group bg-white/5 hover:bg-white/10 border border-transparent rounded-xl transition-all">
                  <td className="px-4 py-3 font-bold text-[#f8fafc] rounded-l-xl truncate max-w-[200px]">{item.city}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{item.zipCode}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${item.potentialScore >= 80 ? 'bg-[#e8bf0d] text-black' : 'bg-slate-800 text-slate-300'}`}>
                      {item.potentialScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-slate-300">{item.avgTension.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-300">{item.motorizationRate}%</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-300 rounded-r-xl">{item.totalDwellings.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Page {currentPage} sur {totalPages}</p>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 bg-white/5 text-white rounded-xl disabled:opacity-30 hover:bg-[#e8bf0d] hover:text-black transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 bg-white/5 text-white rounded-xl disabled:opacity-30 hover:bg-[#e8bf0d] hover:text-black transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}