import { Charts } from "@/components/dashboard/Charts";
import { AnalyticsSummary } from "@/components/dashboard/AnalyticsSummary";
import { DataExport } from "@/components/dashboard/DataExport";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { openDb } from "@/lib/db";
import { ZoneData } from "@/types";

async function getAggregatedData(): Promise<ZoneData[]> {
  const db = await openDb();
  
  const rows = await db.all(`
    SELECT 
      CAST(code_postal_adresse_de_reference AS TEXT) as zipCode,
      MAX(adresse_de_reference) as rawAddress,
      AVG(lat) as lat,
      AVG(long) as lng,
      AVG(taux_tension) as avgTension,
      MAX(taux_equipement_menages) as motorizationRate,
      COUNT(*) as totalBuildings,
      SUM(nombre_de_lots_a_usage_d_habitation) as totalDwellings,
      SUM(nombre_de_lots_de_stationnement) as totalParking
    FROM data_croisee_CLEAN
    WHERE lat IS NOT NULL AND long IS NOT NULL
    GROUP BY code_postal_adresse_de_reference
  `);

  return rows.map(row => {
    let safeTension = row.avgTension ?? 1;
    if (safeTension > 1) safeTension = 1;

    let score = ((1 - safeTension) * 60) + ((row.motorizationRate || 0) * 0.4);
    score = Math.max(0, Math.min(100, Math.round(score)));

    let extractedCity = "Ville Inconnue";
    if (row.rawAddress) {
      const match = row.rawAddress.match(/\d{5}\s+(.+)$/);
      if (match && match[1]) {
        extractedCity = match[1].trim();
        if (extractedCity.toUpperCase() === 'PARIS' && row.zipCode && row.zipCode.startsWith('750')) {
          const arrondissement = parseInt(row.zipCode.substring(3, 5), 10);
          extractedCity = `Paris ${arrondissement}e`;
        }
      }
    }

    return {
      id: row.zipCode,
      city: extractedCity,
      zipCode: row.zipCode,
      lat: row.lat,
      lng: row.lng,
      avgTension: Math.round(safeTension * 100) / 100,
      motorizationRate: row.motorizationRate || 0,
      totalBuildings: row.totalBuildings,
      totalDwellings: row.totalDwellings || 0,
      totalParking: row.totalParking || 0,
      potentialScore: score,
    };
  });
}

export default async function AnalyticsPage() {
  const realZones = await getAggregatedData();

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto p-6 lg:p-10 pb-20">
      
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <Link 
              href="/" 
              className="p-2 bg-white border border-slate-200 hover:border-brand hover:text-brand-dark rounded-xl transition-all shadow-sm"
              title="Retour à l'accueil"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Analyse de <span className="highlight-yellow px-2">marché</span>
            </h1>
          </div>
          <p className="text-slate-500 text-lg ml-14">
            Explorez les corrélations et exportez les données de prospection.
          </p>
        </div>
      </div>
      
      <AnalyticsSummary zones={realZones} />
      <Charts zones={realZones} />
      <div className="w-full">
        <DataExport zones={realZones} />
      </div>

    </div>
  );
}