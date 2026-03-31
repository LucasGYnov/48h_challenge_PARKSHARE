import { Card } from "../ui/Card";
import { ZoneData } from "@/types";
import { Building2, Activity, Map, ArrowUpRight } from "lucide-react";
import { useFilters } from "@/context/FilterContext";
import Link from "next/link";

interface KpiCardsProps {
  zones: ZoneData[];
  onOpenResidences: () => void;
  onOpenTension: () => void;
  onOpenCritical: () => void;
}

export function KpiCards({ zones, onOpenResidences, onOpenTension, onOpenCritical }: KpiCardsProps) {
  const { minScore, maxScore } = useFilters();
  
  if (!zones || zones.length === 0) return null;

  const totalBuildings = zones.reduce((acc, zone) => acc + zone.totalBuildings, 0);
  const totalTensionAcc = zones.reduce((acc, zone) => acc + (zone.avgTension * zone.totalBuildings), 0);
  const avgTension = (totalTensionAcc / totalBuildings).toFixed(2);
  
  const highPotentialZones = zones.filter(zone => zone.potentialScore >= minScore && zone.potentialScore <= maxScore).length;

  const kpis = [
    { 
      title: "Résidences Analysées", 
      value: totalBuildings.toLocaleString(), 
      icon: Building2, 
      onClick: onOpenResidences,
      subtitle: "Détail des ensembles"
    },
    { 
      title: "Taux de Tension Moyen", 
      value: avgTension, 
      icon: Activity, 
      onClick: onOpenTension,
      subtitle: "Déficit parking"
    },
    { 
      title: `Zones Critiques (${minScore}% - ${maxScore}%)`, 
      value: highPotentialZones, 
      icon: Map, 
      onClick: onOpenCritical,
      subtitle: "Prospection prioritaire"
    },
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Synthèse du marché</h2>
        <Link href="/analytics" className="text-[10px] font-black text-brand-dark hover:text-brand transition-colors flex items-center gap-1 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-xl">
          Analyses détaillées <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={index} 
              onClick={kpi.onClick}
              className="flex items-center gap-5 p-6 border-slate-100 hover:shadow-xl hover:border-brand/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-brand">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-brand/10 group-hover:bg-brand transition-colors">
                <Icon className="w-7 h-7 text-brand-dark group-hover:text-black" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {kpi.title}
                </p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
                <p className="text-[9px] font-bold text-brand-dark mt-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                  {kpi.subtitle}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}