import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FilterProvider } from "@/context/FilterContext";
import { openDb } from "@/lib/db";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parkshare Analytics",
  description: "Optimisation du stationnement en Île-de-France",
  icons: {
    icon: "/logomark.svg",
  },
};

async function getDepartments() {
  const db = await openDb();
  const rows = await db.all(`
    SELECT SUBSTR(CAST(code_postal_adresse_de_reference AS TEXT), 1, 2) as code,
           MAX(departement) as name
    FROM data_croisee_CLEAN
    WHERE code_postal_adresse_de_reference IS NOT NULL 
      AND LENGTH(CAST(code_postal_adresse_de_reference AS TEXT)) >= 2
    GROUP BY code
    ORDER BY code ASC
  `);
  return rows.map(r => ({ code: r.code, name: `${r.code} - ${r.name}` }));
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const depts = await getDepartments();

  return (
    <html lang="fr">
      <body className={`${inter.className} bg-white flex h-screen overflow-hidden`} suppressHydrationWarning={true}>
        <FilterProvider>
          <Sidebar availableDepts={depts} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            

            <main className="flex-1 overflow-y-auto bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] px-6 lg:px-12 py-8 custom-scrollbar">
              <div className="max-w-[1600px] mx-auto w-full relative z-10">
                {children}
              </div>
            </main>
            
          </div>
        </FilterProvider>
      </body>
    </html>
  );
}