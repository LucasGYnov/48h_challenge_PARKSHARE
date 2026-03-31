import { KpiCards } from "@/components/dashboard/KpiCards";
import { Card } from "@/components/ui/Card";
import { MapWrapper } from "@/components/dashboard/MapWrapper";
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
        
        // --- NOUVEAUTÉ : Traitement des arrondissements de Paris ---
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

export default async function Home() {
  const realZones = await getAggregatedData();
  const topThree = [...realZones].sort((a, b) => b.potentialScore - a.potentialScore).slice(0, 3);

  return (
    <div className="flex flex-col gap-8 h-full max-w-[1600px] mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          <span className="highlight-yellow px-2">Vue d'ensemble</span> des zones
        </h1>
        <p className="text-slate-500 text-lg">Analysez le potentiel de déploiement de <b>Parkshare</b>.</p>
      </div>
      <KpiCards zones={realZones} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-[550px] mb-8">
        <Card className="lg:col-span-2 p-1 bg-white border border-slate-200 overflow-hidden shadow-sm">
          <MapWrapper initialZones={realZones} />
        </Card>
        <Card className="flex flex-col gap-6 p-6 bg-slate-50 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Top Opportunités</h3>
            <span className="text-[10px] font-black text-[#f8fafc] bg-[#0a0a0a] px-2 py-1 rounded">2026</span>
          </div>
          <div className="space-y-4">
            {topThree.map((zone, index) => (
              <div key={zone.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand transition-all shadow-sm">
                <span className="w-10 h-10 rounded-xl bg-[#0a0a0a] flex items-center justify-center font-black text-brand text-lg">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{zone.city}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Tension: {zone.avgTension}</p>
                </div>
                <div className="text-right font-black text-slate-900 text-lg">{zone.potentialScore}%</div>
              </div>
            ))}
          </div>
          <div className="mt-auto p-5 bg-[#0a0a0a] rounded-2xl shadow-xl relative overflow-hidden border border-white/5">
            <div className="relative z-10 text-sm text-[#f8fafc]/90 leading-relaxed font-medium">
              <span className="text-brand font-black uppercase text-[10px] block mb-2 tracking-widest">Expert Insights</span>
              Les zones score &gt; 80% manquent de parkings privés.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}