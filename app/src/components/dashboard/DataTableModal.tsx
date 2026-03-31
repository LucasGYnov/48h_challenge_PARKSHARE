"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, ChevronLeft, ChevronRight, ArrowUpDown, Download } from "lucide-react";
import { ZoneData } from "@/types";

interface DataTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: ZoneData[];
  subtitle?: string;
}

export function DataTableModal({ isOpen, onClose, title, data, subtitle }: DataTableModalProps) {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ZoneData; direction: 'asc' | 'desc' } | null>(null);
  
  const itemsPerPage = 10;

  // Indispensable pour éviter les erreurs SSR avec createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filtre
  const filteredData = useMemo(() => {
    return data.filter(item => 
      String(item.city).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.zipCode).includes(searchTerm)
    );
  }, [data, searchTerm]);

  // Tri
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key: keyof ZoneData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Vraie fonction d'export CSV pour la modal
  const handleExportCSV = () => {
    const headers = ["Ville", "Code Postal", "Score de Potentiel (%)", "Taux de Tension", "Total Logements"];
    const csvRows = sortedData.map(z => [
      `"${z.city}"`, 
      z.zipCode,
      z.potentialScore,
      z.avgTension,
      z.totalDwellings
    ].join(","));

    const csvContent = "\uFEFF" + [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Parkshare_Modal_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Si la modal est fermée ou que le composant n'est pas monté côté client, on ne rend rien
  if (!isOpen || !mounted) return null;

  // Contenu de la modal
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 text-sm font-medium">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Barre d'outils */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Rechercher une ville ou un CP..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e8bf0d]/20 focus:border-[#e8bf0d] transition-all"
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{sortedData.length} résultats</span>
            <button 
              onClick={handleExportCSV}
              disabled={sortedData.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] text-[#e8bf0d] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-2 cursor-pointer hover:text-[#e8bf0d] transition-colors" onClick={() => requestSort('city')}>Ville <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-4 py-2 cursor-pointer hover:text-[#e8bf0d] transition-colors" onClick={() => requestSort('zipCode')}>CP <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-4 py-2 text-center cursor-pointer hover:text-[#e8bf0d] transition-colors" onClick={() => requestSort('potentialScore')}>Score <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-4 py-2 text-center cursor-pointer hover:text-[#e8bf0d] transition-colors" onClick={() => requestSort('avgTension')}>Tension <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-4 py-2 text-center cursor-pointer hover:text-[#e8bf0d] transition-colors" onClick={() => requestSort('totalDwellings')}>Logements <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="group bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all shadow-sm hover:shadow-md">
                  <td className="px-4 py-4 font-bold text-slate-900 rounded-l-xl">{item.city}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{item.zipCode}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${item.potentialScore >= 80 ? 'bg-[#e8bf0d] text-black' : 'bg-slate-200 text-slate-600'}`}>
                      {item.potentialScore}%
                    </span>
                  </td>
                  {/* AFFICHAGE FORCÉ À 2 DÉCIMALES POUR LA TENSION */}
                  <td className="px-4 py-4 text-center font-bold text-slate-700">{item.avgTension.toFixed(2)}</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-700 rounded-r-xl">{item.totalDwellings.toLocaleString()}</td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 font-bold">Aucune donnée trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Page {currentPage} sur {totalPages}</p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:border-[#e8bf0d] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:border-[#e8bf0d] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Utilisation du Portal pour rendre la modal au niveau du <body>
  return createPortal(modalContent, document.body);
}