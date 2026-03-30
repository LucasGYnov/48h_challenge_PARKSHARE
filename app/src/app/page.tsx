import { KpiCards } from "@/components/dashboard/KpiCards";
import { Card } from "@/components/ui/Card";
import { MapWrapper } from "@/components/dashboard/MapWrapper";
import { mockZones } from "@/data/mockData";

export default function Home() {
  const topThree = [...mockZones]
    .sort((a, b) => b.potentialScore - a.potentialScore)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-8 h-full max-w-[1600px] mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          <span className="highlight-yellow px-2">Vue d'ensemble</span> des zones
        </h1>
        <p className="text-slate-500 text-lg">
          Analysez le potentiel de déploiement de <span className="font-semibold text-slate-700">Parkshare</span>.
        </p>
      </div>
      
      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-[550px] mb-8">
        {/* Carte */}
        <Card className="lg:col-span-2 p-1 bg-white border border-slate-200 overflow-hidden shadow-sm">
          <MapWrapper />
        </Card>
        
        {/* Ranking */}
        <Card className="flex flex-col gap-6 p-6 bg-slate-50 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Top Opportunités</h3>
            <span className="text-[10px] font-black text-[#f8fafc] bg-[#0a0a0a] px-2 py-1 rounded">2026</span>
          </div>

          <div className="space-y-4">
            {topThree.map((zone, index) => (
              <div key={zone.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand transition-all shadow-sm">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0a0a0a] flex items-center justify-center font-black text-brand text-lg">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">{zone.city}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Value: {zone.avgParkingPrice}€</p>
                </div>
                <div className="text-right font-black text-slate-900 text-lg">
                  {zone.potentialScore}%
                </div>
              </div>
            ))}
          </div>

          {/* Expert Card avec texte crème #f8fafc */}
          <div className="mt-auto p-5 bg-[#0a0a0a] rounded-2xl shadow-xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand/5 rounded-full -mr-8 -mt-8"></div>
            <div className="relative z-10">
              <span className="text-brand font-black uppercase text-[10px] block mb-2 tracking-widest">Expert Insights</span>
              <p className="text-sm text-[#f8fafc] leading-relaxed font-medium">
                Les zones avec un score <span className="text-white font-black underline decoration-brand decoration-2 underline-offset-4">{">"} 85%</span> sont considérées comme <span className="text-white font-bold">prioritaires</span> pour le déploiement.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}