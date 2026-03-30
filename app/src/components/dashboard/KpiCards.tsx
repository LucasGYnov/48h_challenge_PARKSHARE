import { Card } from "../ui/Card";
import { mockZones } from "@/data/mockData";
import { Euro, TrendingUp, Map } from "lucide-react";
import Link from "next/link";

export function KpiCards() {
  // Calcul de moyennes pour l'analyse globale
  const avgPrice = Math.round(mockZones.reduce((acc, zone) => acc + zone.avgParkingPrice, 0) / mockZones.length);
  const highPotentialZones = mockZones.filter(zone => zone.potentialScore >= 80).length;
  const avgMotorization = Math.round(mockZones.reduce((acc, zone) => acc + zone.motorizationRate, 0) / mockZones.length);

  const kpis = [
    { title: "Prix Moyen (Mensuel)", value: `${avgPrice} €`, icon: Euro },
    { title: "Zones Haut Potentiel (>80)", value: highPotentialZones, icon: TrendingUp },
    { title: "Taux de Motorisation Moyen", value: `${avgMotorization} %`, icon: Map },
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
              <div className="p-4 rounded-2xl bg-brand-light">
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