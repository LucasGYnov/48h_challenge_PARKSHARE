# 🚗 Parkshare Analytics - Dashboard de Prospection

Bienvenue sur le dépôt de l'application **Parkshare Analytics**, développée dans le cadre du Challenge 48h Parkshare. Ce tableau de bord interactif permet aux équipes commerciales d'identifier visuellement et statistiquement les zones géographiques (Île-de-France) présentant le plus fort potentiel pour le déploiement de notre solution de partage de parkings.

## 📸 Aperçu de l'interface

![Aperçu du Dashboard](./dashboard.png)
*Vue principale : Carte interactive, KPIs globaux et Top Opportunités.*

![Aperçu des Analyses](./analytics.png)
*Centre d'analyse : Graphiques de corrélation, macro-déficit et export CSV.*

---

## ✨ Fonctionnalités Principales

- **🗺️ Cartographie Interactive (Leaflet)** : Visualisation géographique avec deux modes (Points d'intérêt ou Rendu par Secteurs/Communes).
- **📊 Filtres Croisés Dynamiques** : Filtrage en temps réel par Score de potentiel, Taux de tension, Taux de motorisation et zone géographique (Département/Ville).
- **📈 Centre d'Analyse (Recharts)** : Graphiques interactifs (Bar charts, Scatter plots, Pie charts, Area charts) pour analyser les corrélations (Tension vs Motorisation) et les déficits macroscopiques.
- **💾 Export de Données** : Génération et téléchargement à la volée de fichiers CSV reprenant les données filtrées pour l'équipe commerciale.
- **⚡ Architecture Moderne** : Rendu hybride (Server/Client) avec Next.js 14 pour des performances optimales.

---

## 📖 Guide Fonctionnel Détaillé

### 1. Comprendre les Données (Les KPIs Métiers)
Le dashboard croise plusieurs sources pour générer des indicateurs d'aide à la décision :
* **Le Taux de Tension** : Ratio entre le nombre de places de parking privées et le nombre de logements. Plus il est proche de 0, plus la pénurie est forte (cible prioritaire).
* **Le Taux de Motorisation** : Donnée issue de l'INSEE représentant le pourcentage de ménages possédant au moins un véhicule.
* **Le Score de Potentiel (0-100%)** : Algorithme pondérant la pénurie de places (60%) et l'équipement automobile (40%) pour noter l'opportunité commerciale.

### 2. Le Moteur de Filtres Dynamiques (Sidebar)
L'application utilise un état global pour synchroniser l'interface. Toute modification met à jour instantanément la carte et les graphiques :
* **Recherche** : Filtrage textuel par nom de ville ou code postal.
* **Secteurs Critiques** : Bouton d'accès rapide isolant les zones avec un Score > 80% et une Tension < 0.5.
* **Curseurs (Sliders)** : Ajustement précis des seuils de score, de tension et de motorisation.
* **Rendu Carte** : Bascule de la coloration (Choroplèthe) entre Score Global et Motorisation.

### 3. Le Centre d'Analyse (Page Analytics)
Une vue macroscopique du marché via **Recharts** :
* **Top 10** : Classement des meilleures opportunités selon les filtres actifs.
* **Corrélation (Scatter Plot)** : Nuage de points croisant Tension et Motorisation. La taille des bulles indique le volume de logements.
* **Macro-Déficit (Donut Chart)** : Ratio global entre places existantes et manquantes sur la sélection.
* **Pénurie Absolue (Area Chart)** : Visualisation du volume brut de places manquantes (potentiel de masse).

### 4. Tableaux de Données & Export CSV
* **Modales Interactives** : Accès aux données brutes via des tableaux paginés avec tri par colonne.
* **Export CSV natif Excel** : Bouton de téléchargement incluant uniquement les données filtrées.
    * **Technique** : Encodage avec marqueur **BOM** (`\uFEFF`) en UTF-8 pour une compatibilité parfaite avec les accents français dans Microsoft Excel.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router) / React
- **Stylisation** : Tailwind CSS / Lucide Icons
- **Cartographie** : React-Leaflet / Leaflet.js
- **Visualisation de données** : Recharts
- **Base de données** : SQLite (via `sqlite` et `sqlite3`)
- **Langage** : TypeScript

---

## 🚀 Instructions d'Installation

### Prérequis
- Node.js (version 18+)
- NPM ou Yarn
- Le fichier de base de données `parkshare.db`.

> **⚠️ Note sur la Base de Données :**
> Sur GitHub, la base `parkshare.db` est fournie **partiellement** (limitée aux 100 premières lignes des tables brutes) pour respecter les limites de taille. Pour les données réelles complètes, utilisez le pipeline du dossier `/data`.

### Étape 1 : Installation
```bash
git clone [https://github.com/LucasGYnov/48h_challenge_PARKSHARE.git](https://github.com/LucasGYnov/48h_challenge_PARKSHARE.git)
cd 48h_challenge_PARKSHARE/app
npm install
```

### Étape 2 : Configuration
1. Créez un dossier `data` à la racine du dossier `app`.
2. Placez-y votre fichier `parkshare.db` complet.

### Étape 3 : Lancement
```bash
npm run dev
```
Accédez au dashboard sur : `http://localhost:3000`

---

## 🗄️ Schéma de la Base de Données (SQLite)

### 1. Tables Sources Brutes
- `raw_dvf` : Transactions immobilières brutes.
- `raw_insee` : Statistiques démographiques et motorisation.

### 2. Table Transformée : `data_croisee_CLEAN`
Table centrale géocodée et jointe utilisée par l'API.

| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER | ID unique |
| `code_postal_adresse_de_reference` | TEXT | CP de la zone |
| `adresse_de_reference` | TEXT | Nom de la commune/adresse |
| `lat` / `long` | REAL | Coordonnées GPS |
| `taux_tension` | REAL | Ratio Parkings / Logements |
| `taux_equipement_menages` | REAL | % de ménages motorisés |
| `nombre_de_lots_a_usage_d_habitation` | INTEGER | Total logements |
| `nombre_de_lots_de_stationnement` | INTEGER | Total parkings privés |

### 3. Logique d'Agrégation
L'API effectue une agrégation à la volée via `/api/zones/route.ts` :
- **Tension** : `AVG(taux_tension)`
- **Score** : Formule pondérée (60% Déficit stationnement / 40% Motorisation).

---

## 🤝 L'Équipe (Challenge 48h)

- **Data** : ELIDRISSI Hamza
- **Dev** : GERARD Lucas
- **Infra** : TIEOUROU Gnatin Eymanuel
```