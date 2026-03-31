"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ScatterChart, Scatter, ZAxis, Legend, ComposedChart
} from "recharts";
import { Card } from "../ui/Card";
import { ZoneData } from "@/types";
import { useFilters } from "@/context/FilterContext";

interface ChartsProps {
  zones: ZoneData[];
}

export function Charts({ zones }: ChartsProps) {
  // 1. On récupère les filtres de la Sidebar
  const { minScore, maxTension, searchQuery, selectedDept } = useFilters();

  // 2. On filtre les données comme sur la carte
  const filteredZones = zones.filter(zone => {
    const deptMatch = selectedDept === "all" || (zone.zipCode && String(zone.zipCode).startsWith(selectedDept));
    const tensionMatch = zone.avgTension <= maxTension;
    const searchMatch = zone.city ? String(zone.city).toLowerCase().includes(searchQuery.toLowerCase()) : searchQuery === "";
    
    return zone.potentialScore >= minScore && tensionMatch && searchMatch && deptMatch;
  });

  // 3. Préparation des données pour les Top 10 (triées par score décroissant)
  const topZones = [...filteredZones]
    .sort((a, b) => b.potentialScore - a.potentialScore)
    .slice(0, 10); // On prend le top 10 pour que les graphiques à barres restent lisibles

  // Custom Tooltip pour le nuage de points
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0a0a0a] p-4 border border-slate-700 shadow-xl rounded-xl">
          <p className="font-black text-[#fcf8e6] uppercase tracking-widest text-xs mb-2 border-b border-slate-700 pb-2">{data.city}</p>
          <p className="text-sm text-slate-300">Tension : <span className="font-bold text-white">{data.avgTension}</span></p>
          <p className="text-sm text-slate-300">Motorisation : <span className="font-bold text-white">{data.motorizationRate}%</span></p>
          <p className="text-sm text-slate-300">Logements : <span className="font-bold text-white">{data.totalDwellings}</span></p>
          <div className="mt-2 pt-2 border-t border-slate-700">
            <p className="text-sm text-brand font-black">Score : {data.potentialScore}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (filteredZones.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 font-bold">Aucune zone ne correspond à vos filtres.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* LIGNE 1 : Palmarès & Nuage de points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graphique 1 : Palmarès des zones */}
        <Card className="flex flex-col h-[450px] p-6 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Classement</h3>
          <h2 className="text-lg font-bold text-slate-900 mb-6">Top 10 : Score de Potentiel</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topZones} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontSize: 11, fontWeight: 'bold' }} width={100} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="potentialScore" radius={[0, 4, 4, 0]} barSize={20}>
                  {topZones.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 3 ? '#0a0a0a' : '#e8bf0d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Graphique 2 : Matrice d'opportunité */}
        <Card className="flex flex-col h-[450px] p-6 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Corrélation</h3>
          <h2 className="text-lg font-bold text-slate-900 mb-6">Tension vs Motorisation</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  type="number" dataKey="avgTension" name="Tension" 
                  axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} 
                  domain={[0, 'dataMax']} 
                  label={{ value: 'Taux de Tension (Plus bas = Manque de places)', position: 'bottom', fill: '#94a3b8', fontSize: 10 }}
                />
                <YAxis 
                  type="number" dataKey="motorizationRate" name="Motorisation" unit="%" 
                  axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} 
                  domain={[0, 100]}
                  label={{ value: 'Taux Motorisation (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                />
                <ZAxis type="number" dataKey="totalDwellings" range={[50, 600]} name="Logements" />
                <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Secteurs" data={filteredZones} fill="#e8bf0d" fillOpacity={0.6} stroke="#c4a10a" strokeWidth={1} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* LIGNE 2 : Analyse du Déficit Physique */}
      <Card className="flex flex-col h-[400px] p-6 bg-slate-50 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Déficit d'infrastructure</h3>
        <h2 className="text-lg font-bold text-slate-900 mb-6">Logements vs Places de stationnement (Top 10)</h2>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={topZones} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontSize: 11, fontWeight: 'bold' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="totalDwellings" name="Nombre de Logements" fill="#0a0a0a" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="totalParking" name="Places de Parking existantes" fill="#e8bf0d" radius={[4, 4, 0, 0]} barSize={30} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
}