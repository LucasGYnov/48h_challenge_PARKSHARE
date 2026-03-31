"use client"; // On passe en client pour gérer la détection d'URL

import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FilterProvider } from "@/context/FilterContext";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Définit ici les pages où la sidebar doit être MASQUÉE
  // Si vous voulez la supprimer partout, passez simplement 'showSidebar' à false
  const isAnalyticsPage = pathname.includes("/analytics");
  const showSidebar = !isAnalyticsPage; // Masquée sur analytics

  return (
    <html lang="fr">
      <head>
        <title>Parkshare Analytics</title>
        {/* On définit l'icône ici ou via le fichier icon.png dans /app */}
        <link rel="icon" href="/logomark.svg" /> 
      </head>
      <body className={`${inter.className} bg-white flex h-screen overflow-hidden`} suppressHydrationWarning={true}>
        <FilterProvider>
          {/* La Sidebar ne s'affiche que si showSidebar est vrai */}
          {showSidebar && <Sidebar availableDepts={[]} />} 
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
              {children}
            </main>
          </div>
        </FilterProvider>
      </body>
    </html>
  );
}