# NESTORA - Backend System

Ce dossier contient le code de la base de données, l'API et l'authentification de NESTORA. 

## Prérequis
- Node.js (v18+)
- Une base de données PostgreSQL en cours d'exécution.

## Installation

1. Accédez au dossier `server` :
   ```bash
   cd server
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configuration des variables d'environnement :
   Copiez le fichier `.env.example` vers `.env` et modifiez les valeurs en fonction de votre configuration locale.
   
   ```bash
   # Exemple de .env
   PORT=5000
   DATABASE_URL="postgresql://utilisateur:motdepasse@localhost:5432/nestora?schema=public"
   JWT_SECRET="votre_cle_secrete_hyper_securisee"
   ```

## Base de données & Migrations

Une fois votre base de données PostgreSQL prête et connectée via `DATABASE_URL` :

1. Créez les tables (Migration initiale) :
   ```bash
   npx prisma migrate dev --name init
   ```

2. Remplissez la base de données avec les données de test (Seed) :
   Le seed créera des pays, des villes, et un utilisateur pour chaque rôle (Chercheur, Propriétaire, Agence).
   ```bash
   npx prisma db seed
   ```

## Démarrage

- **Développement** : `npm run dev` (Démarre le serveur sur le port 5000 avec rechargement automatique)
- **Production** : `npm run build` puis `npm run start`

## Sécurité & API
- **Authentification** : Gérée via JWT (JSON Web Tokens). Chaque requête protégée nécessite le header `Authorization: Bearer <token>`.
- **Mots de passe** : Hachés de manière sécurisée en utilisant `bcryptjs`.
- **Validation** : Le backend recalcule systématiquement les montants, vérifie les permissions et protège contre les accès non autorisés.
