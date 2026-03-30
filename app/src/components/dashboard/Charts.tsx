"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ScatterChart, Scatter, ZAxis
} from "recharts";
import { mockZones } from "@/data/mockData";
import { Card } from "../ui/Card";

export function Charts() {
  // Préparation des données pour le Top 5 (triées par score décroissant)
  const topZones = [...mockZones].sort((a, b) => b.potentialScore - a.potentialScore);

  // Custom Tooltip pour le nuage de points
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
          <p className="font-bold text-slate-900">{data.city}</p>
          <p className="text-sm text-slate-600">Prix : {data.avgParkingPrice} €/mois</p>
          <p className="text-sm text-brand-dark font-semibold">Score : {data.potentialScore}/100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique 1 : Le Palmarès des zones */}
      <Card className="flex flex-col h-[400px]">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Palmarès des zones (Score)</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topZones} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="potentialScore" radius={[4, 4, 0, 0]}>
                {topZones.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#c4a10a' : '#e8bf0d'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Graphique 2 : Nuage de points (Corrélation) */}
      <Card className="flex flex-col h-[400px]">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Analyse de corrélation</h3>
        <p className="text-sm text-slate-500 mb-6">Prix moyen vs Score de potentiel</p>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                dataKey="avgParkingPrice" 
                name="Prix moyen" 
                unit=" €" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                domain={['auto', 'auto']}
              />
              <YAxis 
                type="number" 
                dataKey="potentialScore" 
                name="Score" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                domain={[0, 100]}
              />
              {/* Le ZAxis permet de faire varier la taille des points selon la densité de population */}
              <ZAxis type="number" dataKey="populationDensity" range={[100, 500]} name="Densité" />
              <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Zones" data={mockZones} fill="#e8bf0d" fillOpacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}