import { NextResponse } from "next/server";
import { openDb } from "@/lib/db";

export async function GET() {
  try {
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

    const processedZones = rows.map((row) => {
      let safeTension = row.avgTension ?? 1;
      if (safeTension > 1) safeTension = 1;

      // Calcul score (60% Tension, 40% Motorisation)
      let score = ((1 - safeTension) * 60) + ((row.motorizationRate || 0) * 0.4);
      score = Math.max(0, Math.min(100, Math.round(score)));

      let extractedCity = "Ville Inconnue";
      if (row.rawAddress) {
        const match = row.rawAddress.match(/\d{5}\s+(.+)$/);
        if (match && match[1]) {
          extractedCity = match[1].trim();
          // Gestion arrondissements Paris
          if (extractedCity.toUpperCase() === 'PARIS' && row.zipCode?.startsWith('750')) {
            const arr = parseInt(row.zipCode.substring(3, 5), 10);
            extractedCity = `Paris ${arr}e`;
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

    return NextResponse.json(processedZones);
  } catch (error) {
    console.error("Erreur API Zones:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}