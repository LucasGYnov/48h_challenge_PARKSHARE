// src/components/dashboard/KpiCards.tsx
import { Card } from "../ui/Card";
import { ZoneData } from "@/types";
import { Building2, Activity, Map } from "lucide-react";
import Link from "next/link";

interface KpiCardsProps {
  zones: ZoneData[];
}

export function KpiCards({ zones }: KpiCardsProps) {
  if (!zones || zones.length === 0) return null;

  // 1. Total Buildings Analyzed
  const totalBuildings = zones.reduce((acc, zone) => acc + zone.totalBuildings, 0);
  
  // 2. Average Tension (weighted by number of buildings in the zone)
  const totalTensionAcc = zones.reduce((acc, zone) => acc + (zone.avgTension * zone.totalBuildings), 0);
  const avgTension = (totalTensionAcc / totalBuildings).toFixed(2);

  // 3. High Potential Zones
  const highPotentialZones = zones.filter(zone => zone.potentialScore >= 80).length;

  const kpis = [
    { title: "Résidences Analysées", value: totalBuildings.toLocaleString(), icon: Building2 },
    { title: "Taux de Tension Moyen", value: avgTension, icon: Activity },
    { title: "Secteurs Critiques (>80%)", value: highPotentialZones, icon: Map },
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Synthèse du marché</h2>
        <Link 
          href="/analytics" 
          className="text-sm font-medium text-brand-dark hover:text-brand transition-colors flex items-center gap-1"
        >
          Voir les graphiques d'analyse &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="flex items-center gap-5 p-6 border-slate-100 hover:shadow-md transition-shadow">
              <div className="p-4 rounded-2xl bg-brand/10">
                <Icon className="w-7 h-7 text-brand-dark" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{kpi.title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{kpi.value}</h3>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}