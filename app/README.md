# 🚗 Parkshare Analytics - Application Dashboard (Partie Dev)

Ce dossier contient l'application web interactive développée pour le **Challenge 48h Parkshare** (Profil Dev). Il s'agit d'un tableau de bord connecté à une base de données SQLite permettant de visualiser, filtrer et exporter les zones à fort potentiel commercial en Île-de-France.

## 🛠️ Stack Technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
- **UI & Style** : Tailwind CSS, Lucide React
- **Cartographie** : React-Leaflet, Leaflet.js
- **Dataviz** : Recharts
- **Base de données** : SQLite (`sqlite`, `sqlite3`)
- **Langage** : TypeScript

---

## 🚀 Installation et Lancement

### 1. Prérequis et Base de données
L'application nécessite la base de données SQLite générée par le profil **Data**.
Assurez-vous de créer un dossier `data` à la racine de ce projet (au même niveau que `src` ou `package.json`) et d'y placer le fichier `parkshare.db`.

```text
/votre-dossier-app
├── /src
├── /public
├── /data
│   └── parkshare.db   <-- Fichier requis pour faire tourner l'API
├── package.json
└── ...
````

### 2\. Démarrer le serveur local

Installez les dépendances puis lancez le serveur de développement :

```bash
npm install
# ou yarn install

npm run dev
# ou yarn dev
```

Ouvrez [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) dans votre navigateur pour utiliser le dashboard. Les modifications du code source rechargeront automatiquement la page.

-----

## 🗄️ Schéma de la Base de Données

Conformément aux attentes du cahier des charges, l'application se connecte à une base de données structurée pour garantir la traçabilité des données, de la source jusqu'aux KPIs.

### 1\. Tables Sources Brutes

Données non altérées telles que reçues (limitées à 100 lignes sur le repo GitHub pour des raisons de poids) :

  - `RegistreNationalCoproprietes_BRUT`
  - `equipement_automobile_menages_BRUT`

### 2\. Table Transformée Principale

  - `data_croisee_CLEAN` : C'est la table nettoyée, géocodée et jointe, interrogée par l'API du dashboard.
      - `id` (INTEGER) : Clé primaire
      - `code_postal_adresse_de_reference` (TEXT) : Code postal du secteur
      - `adresse_de_reference` (TEXT) : Nom de la ville ou adresse
      - `lat` / `long` (REAL) : Coordonnées GPS pour le placement sur la carte Leaflet
      - `taux_tension` (REAL) : Ratio de places existantes par logement
      - `taux_equipement_menages` (REAL) : % de ménages possédant un véhicule
      - `nombre_de_lots_a_usage_d_habitation` (INTEGER) : Volume de logements
      - `nombre_de_lots_de_stationnement` (INTEGER) : Volume de parkings privés

### 3\. Tables de KPIs (Agrégation dynamique)

Afin d'optimiser le filtrage en temps réel, les KPIs finaux sont calculés et agrégés dynamiquement par l'API Next.js (`src/app/api/zones/route.ts`) via une requête SQL (`GROUP BY code_postal_adresse_de_reference`).
Le **Score de potentiel (0 à 100%)** est généré à la volée en pondérant la tension de stationnement (60%) et la motorisation (40%).

-----

## 📖 Fonctionnalités du Dashboard

  - **Carte Interactive** : Visualisation géographique avec rendu conditionnel (Score Global ou Taux de Motorisation).
  - **Filtres Dynamiques (Sidebar)** : Filtrage global en temps réel synchronisé via React Context (Score, Tension, Motorisation, Département).
  - **Mode Secteurs Critiques** : Isoler rapidement les zones où la demande est extrême (Score \> 80% et Tension \< 0.5).
  - **Analyses Avancées (`/analytics`)** : Visualisation des corrélations (Scatter plot) et de la taille du marché macroscopique (Donut & Area charts).
  - **Export Data** : Modales de données brutes (`React Portals`) incluant un moteur de recherche interne et un export CSV natif formaté pour Microsoft Excel (encodage UTF-8 avec BOM).

<!-- end list -->
