import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FilterProvider } from "@/context/FilterContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parkshare Analytics",
  description: "Dashboard analytique pour l'optimisation des parkings partagés",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50 text-slate-900 flex h-screen overflow-hidden`}>
        {/* Le Provider doit envelopper TOUT ce qui utilise les filtres */}
        <FilterProvider>
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              {children}
            </main>
          </div>
        </FilterProvider>
      </body>
    </html>
  );
}