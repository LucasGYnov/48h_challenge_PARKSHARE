# 📂 Data Pipeline & Processing - Parkshare

Ce dossier contient toute la logique d'ingénierie des données (ETL) pour le projet Parkshare. Il regroupe les scripts d'analyse, de nettoyage, de calcul des indicateurs (KPIs) et la base de données finale.

## 🎯 Objectif du Pipeline

Le but de ces scripts est de prendre des données brutes (Insee, open data sur les ménages et véhicules), de les nettoyer, de calculer des scores de "tension de stationnement" et de consolider le tout dans une base de données relationnelle exploitable par notre application Next.js.

## 🏗️ Architecture des Fichiers

### 📓 1. Notebooks Jupyter (Traitement & Logique)
Ces scripts Python (`.ipynb`) exécutent les différentes étapes de notre pipeline :
* `clean.ipynb` : Nettoyage initial des données brutes (gestion des valeurs nulles, formatage).
* `taux.ipynb` & `tension.ipynb` : Algorithmes de calcul des indicateurs clés (taux d'équipement automobile des ménages, indice de tension de stationnement par zone).
* `calcul.ipynb` : Calculs globaux et agrégations des scores.
* `join.ipynb` : Fusion (MERGE/JOIN) des différents datasets nettoyés et calculés pour créer la table finale.
* `test.ipynb` : Bac à sable pour les expérimentations de code.

### 📊 2. Datasets (Fichiers Plats)
Fichiers sources et exports intermédiaires du pipeline :
* **Données Brutes / Sources :** `code_menage.csv`, `part-des-menages-disposant-au-moins...`
* **Données Intermédiaires (Nettoyées) :** `data_clean.csv`, `data_clean1.csv`
* **Résultats de Calculs :** `taux_tension.csv`, `taux_voiture_menages.csv` (et `.xlsx`)
* **Export Final avant DB :** `data_clean_final.csv`

### 🗄️ 3. Base de Données (Production)
* **`parkshare.db`** : La base de données SQLite finale. Elle contient les tables consolidées, prêtes à être interrogées par le back-end de notre dashboard analytique.

## 🚀 Workflow d'exécution

Pour mettre à jour les données du dashboard, l'ordre d'exécution recommandé des notebooks est le suivant :
1.  Exécuter `clean.ipynb` pour préparer les fichiers bruts.
2.  Exécuter `taux.ipynb` et `tension.ipynb` pour générer les métriques métiers.
3.  Exécuter `join.ipynb` et `calcul.ipynb` pour consolider le tout.
4.  Les données finales sont ensuite injectées dans `parkshare.db`.

---
*Note pour le front-end : L'application Next.js se connectera directement à `parkshare.db` (via un ORM ou des requêtes SQL) pour alimenter les graphiques et la carte géographique.*