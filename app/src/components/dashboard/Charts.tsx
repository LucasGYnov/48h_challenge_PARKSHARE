"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ScatterChart, Scatter, ZAxis, Legend, ComposedChart,
  PieChart, Pie, AreaChart, Area
} from "recharts";
import { Card } from "../ui/Card";
import { ZoneData } from "@/types";
import { useFilters } from "@/context/FilterContext";

interface ChartsProps {
  zones: ZoneData[];
}

export function Charts({ zones }: ChartsProps) {
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


  // 1. Top 10 par Score 
  const topZones = [...filteredZones]
    .sort((a, b) => b.potentialScore - a.potentialScore)
    .slice(0, 10);

  // 2. Répartition des scores pour le Camembert
  const scoreDistribution = useMemo(() => {
    return [
      { name: "Excellent (>80%)", value: filteredZones.filter(z => z.potentialScore >= 80).length, fill: "#e8bf0d" },
      { name: "Bon (60-80%)", value: filteredZones.filter(z => z.potentialScore >= 60 && z.potentialScore < 80).length, fill: "#f2d663" },
      { name: "Moyen (40-60%)", value: filteredZones.filter(z => z.potentialScore >= 40 && z.potentialScore < 60).length, fill: "#f9ebae" },
      { name: "Faible (<40%)", value: filteredZones.filter(z => z.potentialScore < 40).length, fill: "#f1f5f9" }
    ].filter(d => d.value > 0);
  }, [filteredZones]);

  // 3. Macro-Déficit pour le Donut
  const globalDeficitData = useMemo(() => {
    const totalDwellings = filteredZones.reduce((acc, z) => acc + z.totalDwellings, 0);
    const totalParking = filteredZones.reduce((acc, z) => acc + z.totalParking, 0);
    const missingParking = Math.max(0, totalDwellings - totalParking);

    return [
      { name: "Places Existantes", value: totalParking, fill: "#0a0a0a" },
      { name: "Déficit (Manque)", value: missingParking, fill: "#e8bf0d" }
    ];
  }, [filteredZones]);

  const topDeficitVolume = useMemo(() => {
    return [...filteredZones]
      .map(z => ({ 
        city: z.city, 
        deficit: Math.max(0, z.totalDwellings - z.totalParking) 
      }))
      .sort((a, b) => b.deficit - a.deficit)
      .slice(0, 10);
  }, [filteredZones]);

  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0a0a0a] p-4 border border-slate-700 shadow-xl rounded-xl">
          <p className="font-black text-[#fcf8e6] uppercase tracking-widest text-xs mb-2 border-b border-slate-700 pb-2">{data.city}</p>
          <p className="text-sm text-slate-300">Tension : <span className="font-bold text-white">{data.avgTension.toFixed(2)}</span></p>
          <p className="text-sm text-slate-300">Motorisation : <span className="font-bold text-white">{data.motorizationRate}%</span></p>
          <p className="text-sm text-slate-300">Logements : <span className="font-bold text-white">{data.totalDwellings}</span></p>
          <div className="mt-2 pt-2 border-t border-slate-700">
            <p className="text-sm text-[#e8bf0d] font-black">Score : {data.potentialScore}%</p>
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
      
      {/* LIGNE 1 : Top 10 Score & Scatter Plot  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-[450px] p-6 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Classement</h3>
          <h2 className="text-lg font-bold text-slate-900 mb-6">Top 10 : Score de Potentiel</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topZones} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="city" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontSize: 11, fontWeight: 'bold' }} width={100} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="potentialScore" radius={[0, 4, 4, 0]} barSize={20}>
                  {topZones.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 3 ? '#0a0a0a' : '#e8bf0d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col h-[450px] p-6 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Corrélation</h3>
          <h2 className="text-lg font-bold text-slate-900 mb-6">Tension vs Motorisation</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="avgTension" name="Tension" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 'dataMax']} label={{ value: 'Taux de Tension (Plus bas = Manque de places)', position: 'bottom', fill: '#94a3b8', fontSize: 10 }} />
                <YAxis type="number" dataKey="motorizationRate" name="Motorisation" unit="%" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} label={{ value: 'Taux Motorisation (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                <ZAxis type="number" dataKey="totalDwellings" range={[50, 600]} name="Logements" />
                <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Secteurs" data={filteredZones} fill="#e8bf0d" fillOpacity={0.6} stroke="#c4a10a" strokeWidth={1} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* LIGNE 2 : NOUVEAUX GRAPHIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Camembert : Qualité du Marché */}
        <Card className="flex flex-col h-[350px] p-6 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Répartition</h3>
          <h2 className="text-sm font-bold text-slate-900 mb-2">Qualité du Marché (Scores)</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={scoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} stroke="none">
                  {scoreDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut : Déficit */}
        <Card className="flex flex-col h-[350px] p-6 bg-[#0a0a0a] border border-slate-800 shadow-xl">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Macro-Analyse</h3>
          <h2 className="text-sm font-bold text-[#fcf8e6] mb-2">Déficit Global de la Sélection</h2>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={globalDeficitData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} stroke="none">
                  {globalDeficitData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }}/>
              </PieChart>
            </ResponsiveContainer>
            {/* Texte au centre du Donut */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-6">
              <span className="text-[#e8bf0d] font-black text-xl">{Math.round((globalDeficitData[1]?.value / (globalDeficitData[0]?.value + globalDeficitData[1]?.value)) * 100 || 0)}%</span>
            </div>
          </div>
        </Card>

        {/* AreaChart : Volume Absolu */}
        <Card className="flex flex-col h-[350px] p-6 bg-white border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Pénurie Absolue</h3>
          <h2 className="text-sm font-bold text-slate-900 mb-2">Top 10 Volumes Manquants</h2>
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={topDeficitVolume} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="city" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => v.length > 10 ? v.substring(0, 10) + '...' : v} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} 
                  formatter={(value: number) => [<span className="font-bold">{value} places</span>, "Déficit estimé"]}
                />
                <Area type="monotone" dataKey="deficit" stroke="#0a0a0a" strokeWidth={3} fill="#e8bf0d" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* LIGNE 3 : Comparatif Logements vs Parkings */}
      <Card className="flex flex-col h-[400px] p-6 bg-slate-50 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Déficit d'infrastructure</h3>
        <h2 className="text-lg font-bold text-slate-900 mb-6">Logements vs Places de stationnement (Top 10)</h2>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={topZones} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fill: '#0f172a', fontSize: 11, fontWeight: 'bold' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
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