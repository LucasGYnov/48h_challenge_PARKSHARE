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
- **⚡ Architecture Moderne** : Rendu hybride (Server/Client) avec Next.js pour des performances optimales.

---

## 📖 Guide Fonctionnel Détaillé

### 1. Comprendre les Données (Les KPIs Métiers)
Le dashboard ne se contente pas d'afficher des données brutes, il les croise pour générer des indicateurs d'aide à la décision :
* **Le Taux de Tension** : C'est le ratio entre le nombre de places de parking privées et le nombre de logements dans une zone. Plus il est proche de 0, plus la pénurie est forte (idéal pour Parkshare).
* **Le Taux de Motorisation** : Donnée INSEE représentant le pourcentage de ménages possédant au moins un véhicule dans la zone.
* **Le Score de Potentiel (0-100%)** : L'algorithme central de l'application. Il pondère la pénurie de places (60%) et l'équipement automobile (40%) pour donner une note globale d'opportunité à chaque commune/secteur.

### 2. Le Moteur de Filtres Dynamiques (Sidebar)
L'application utilise un état global (React Context) pour synchroniser la totalité de l'interface. Chaque modification dans la barre latérale met instantanément à jour la Carte, les KPIs, les Graphiques et les Tableaux :
* **Recherche** : Filtrage textuel instantané par nom de ville.
* **Secteurs Critiques (Bouton rapide)** : Isole d'un clic les zones cumulant un Score > 80% ET une Tension extrême (< 0.5).
* **Curseurs (Sliders)** : Permettent d'affiner la recherche en définissant un Score minimum/maximum, une Tension maximale tolérée, ou un Taux de motorisation minimum.
* **Rendu Carte** : Permet de basculer la coloration de la carte (Choroplèthe) pour visualiser soit le Score Global, soit la Motorisation.

### 3. Le Centre d'Analyse (Page Analytics)
Une page dédiée à la compréhension macroscopique du marché via des graphiques interactifs (Recharts) :
* **Top 10 (Bar Chart)** : Classement visuel des meilleures villes selon les filtres actifs.
* **Corrélation (Scatter Plot)** : Nuage de points croisant la Tension (X) et la Motorisation (Y). La taille des bulles représente le volume de logements. Permet de valider visuellement les hypothèses de scoring.
* **Qualité du Marché (Pie Chart)** : Répartition des zones affichées par tranches qualitatives (Excellent, Bon, Moyen, Faible).
* **Macro-Déficit (Donut Chart)** : Montre le ratio global entre les places existantes et les places manquantes sur toute la sélection active.
* **Pénurie Absolue (Area Chart)** : Un score de 95% sur un village de 50 habitants rapporte moins qu'un score de 70% sur une ville de 50 000 habitants. Ce graphique affiche le *volume absolu* de places manquantes.

### 4. Tableaux de Données (Modales) et Export Excel/CSV
Pour transformer l'analyse en action commerciale, les données sont exportables :
* **Modales Interactives (Portals)** : En cliquant sur n'importe quel KPI du tableau de bord, une modale s'ouvre avec un tableau détaillé. Ces tableaux intègrent leur propre moteur de recherche interne, une pagination, et un tri ascendant/descendant par colonne.
* **Export CSV natif Excel** : Un bouton "Télécharger CSV" est disponible dans chaque modale et sur la page Analytics.
    * L'export génère un fichier à la volée contenant *uniquement* les données actuellement filtrées.
    * **Encodage technique** : Le fichier généré inclut un marqueur BOM (`\uFEFF`) en UTF-8. Cela garantit que le fichier s'ouvrira parfaitement dans **Microsoft Excel** sans aucun problème d'accents sur les noms de villes françaises.
    * Le nommage du fichier est dynamique et inclut la date du jour (ex: `Parkshare_Export_2024-10-27.csv`).

---

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router) / React
- **Stylisation** : Tailwind CSS / Lucide Icons
- **Cartographie** : React-Leaflet / Leaflet.js
- **Visualisation de données** : Recharts
- **Base de données** : SQLite (via `sqlite` et `sqlite3`)
- **Langage** : TypeScript

---

## 🚀 Instructions d'Installation et d'Utilisation

### Prérequis
- Node.js (version 18 ou supérieure)
- NPM ou Yarn
- Le fichier de base de données SQLite fourni par l'équipe Data (`parkshare.db`).

> **⚠️ Note importante concernant la Base de Données :**
> En raison des limites de taille de fichier sur GitHub, la base de données SQLite (`parkshare.db`) présente sur ce dépôt n'a été poussée que **partiellement**. Les tables contenant les données brutes sont limitées aux 100 premières lignes pour servir d'exemple de structure et de typage. Pour exploiter le dashboard avec l'intégralité des données réelles de l'Île-de-France, vous devez générer la base complète via le pipeline du dossier `/data`.

### Étape 1 : Cloner et installer
```bash
# Cloner le dépôt
git clone [https://github.com/LucasGYnov/48h_challenge_PARKSHARE.git](https://github.com/LucasGYnov/48h_challenge_PARKSHARE.git)
cd 48h_challenge_PARKSHARE/app

# Installer les dépendances
npm install
# ou
yarn install

### Étape 2 : Configuration de la Base de Données

1.  Assurez-vous d'avoir un dossier `data` à la racine de ce dossier `app` (ou ajustez le chemin dans `src/lib/db.ts`).
2.  Placez-y le fichier de base de données SQLite complet généré par l'équipe Data et nommez-le `parkshare.db`.
    *(Chemin attendu par défaut : `./data/parkshare.db`)*

### Étape 3 : Lancer le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

Ouvrez [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) dans votre navigateur pour accéder au Dashboard.

-----

## 🗄️ Schéma de la Base de Données (SQLite)

Pour garantir la traçabilité et les performances, la base de données est structurée en respectant une logique de pipeline Data.

### 1\. Tables Sources Brutes

*(Alimentées par l'équipe Data - Non altérées par l'application)*

  - `raw_dvf` : Données des Valeurs Foncières (transactions immobilières).
  - `raw_insee` : Statistiques démographiques et taux d'équipement automobile.

### 2\. Table Transformée Principale : `data_croisee_CLEAN`

C'est la table centrale interrogée par notre API. Elle contient les données nettoyées, géocodées et jointes.

| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER | Identifiant unique de la ligne |
| `code_postal_adresse_de_reference` | TEXT | Code postal de la zone |
| `adresse_de_reference` | TEXT | Adresse complète ou nom de la commune |
| `lat` / `long` | REAL | Coordonnées géographiques (Latitude / Longitude) |
| `taux_tension` | REAL | Ratio : (Places de parking existantes / Nombre de logements) |
| `taux_equipement_menages` | REAL | Pourcentage de ménages possédant au moins un véhicule (%) |
| `nombre_de_lots_a_usage_d_habitation` | INTEGER | Volume total de logements sur le lot |
| `nombre_de_lots_de_stationnement` | INTEGER | Volume total de places de parking privées sur le lot |
| `departement` | TEXT | Nom du département pour le filtrage macro |

### 3\. Logique d'Agrégation (KPIs)

Plutôt que de stocker des vues figées, l'application Next.js (via la route `/api/zones/route.ts`) effectue une agrégation à la volée (`GROUP BY code_postal`) pour générer les KPIs par secteur :

  - **Tension Moyenne** : `AVG(taux_tension)` (Plafonné à 1.00).
  - **Volume Logements / Parkings** : `SUM()` des lots correspondants.
  - **Score Parkshare (0-100%)** : Formule métier pondérée combinant le déficit de stationnement (60%) et le taux de motorisation (40%).

-----

## 🤝 L'Équipe

Projet réalisé dans le cadre du Challenge 48h Parkshare.

  - **Data** : ELIDRISSI Hamza
  - **Dev** : GERARD Lucas
  - **Infra** : TIEOUROU Gnatin Eymanuel
