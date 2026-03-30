import { Charts } from "@/components/dashboard/Charts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/" 
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-900"
              title="Retour à l'accueil"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Analyse détaillée du marché</h1>
          </div>
          <p className="text-slate-500 ml-9">Explorez les corrélations et les classements pour identifier les meilleures opportunités.</p>
        </div>
      </div>
      
      {/* On intègre nos graphiques ici */}
      <Charts />
      
      {/* Un petit espace pour un futur tableau de données brutes par exemple */}
      <div className="bg-white rounded-xl border border-slate-100 p-8 flex items-center justify-center text-slate-400 border-dashed min-h-[200px]">
        [Le Tableau des données brutes viendra ici plus tard]
      </div>
    </div>
  );
}