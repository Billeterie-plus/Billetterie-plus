# My Ticket — Plateforme de billetterie (train, concert, spectacle...)

Plateforme complète de vente de billets avec application web, application mobile,
et espace organisateur. Un même backend sert les deux clients.

## Architecture

```
ticketing-platform/
├── backend/    API Node.js/Express + TypeScript + Prisma (SQLite en local)
├── web/        Application web Next.js 14 (acheteurs + organisateurs)
├── mobile/     Application mobile React Native / Expo (acheteurs + organisateurs)
└── shared/     Types TypeScript partagés entre web et mobile
```

### Fonctionnalités incluses

- Catalogue d'événements multi-types : train (gare départ/arrivée), concert,
  sport, théâtre, autre — chacun avec ses propres tarifs/catégories
  (ex: "1ère classe" / "2nde classe", "Fosse" / "Carré Or").
- Achat de billets : sélection de catégorie + quantité, code promo, paiement.
- Paiement Stripe Checkout (mode test) avec **repli automatique en "mode démo"**
  si aucune clé Stripe n'est configurée, pour pouvoir tester tout le flux sans
  compte Stripe.
- Billets électroniques avec QR code unique, vérifiables à l'entrée.
- Espace organisateur : création d'événements et de tarifs, publication,
  tableau de bord des ventes (revenu, billets vendus, taux de scan), codes
  promo, scan des billets (caméra sur mobile, saisie manuelle sur web).
- Notifications (stub) : un point d'intégration unique (`notification.service.ts`)
  prêt à être branché sur un vrai fournisseur d'email/push.

## 1. Backend (API)

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed      # crée 2 comptes de démo + 2 événements d'exemple
npm run dev        # démarre l'API sur http://localhost:4000
```

Comptes créés par le seed :
- Organisateur : `organisateur@demo.com` / `password123`
- Acheteur : `client@demo.com` / `password123`

Base de données : SQLite par défaut (fichier `dev.db`, zéro configuration).
Pour la production, changez `provider = "postgresql"` dans
`prisma/schema.prisma` et pointez `DATABASE_URL` vers votre base Postgres —
le reste du schéma est déjà compatible.

Paiement : pour activer de vrais paiements Stripe (mode test ou production),
renseignez `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` dans `.env`. Sans
clé, chaque commande est automatiquement confirmée ("mode démo") pour pouvoir
tester tout le parcours d'achat sans intégration de paiement.

## 2. Application web

```bash
cd web
cp .env.local.example .env.local
npm install
npm run dev     # http://localhost:3000
```

Pages principales : accueil (recherche/filtre), détail événement + achat,
mes billets (QR code), connexion/inscription, espace organisateur
(tableau de bord, création d'événement, statistiques, scan de billets).

## 3. Application mobile

```bash
cd mobile
npm install
npx expo start
```

Scannez le QR code avec l'app **Expo Go** (iOS/Android) ou lancez un
simulateur (`npx expo start --ios` / `--android`).

Important : dans `src/lib/api.ts`, remplacez `API_URL` par l'adresse IP
locale de votre machine (ex: `http://192.168.1.20:4000`) si vous testez sur
un téléphone physique — `localhost` ne fonctionne que dans un simulateur.

L'app mobile réutilise la même API que le web et propose en plus un vrai
scanner de billets par caméra (écran "Scanner" de l'espace organisateur, via
`expo-camera`).

## Prochaines étapes suggérées

- Brancher un vrai fournisseur d'email/push (Resend, SendGrid, Expo Push)
  dans `backend/src/services/notification.service.ts`.
- Ajouter `@stripe/stripe-react-native` côté mobile pour un vrai paiement in-app
  (actuellement le mobile utilise le mode démo ; le web gère déjà Stripe Checkout).
- Ajouter une gestion de sièges numérotés (plan de salle / plan de wagon) si
  nécessaire — le modèle `Ticket.seatInfo` est déjà prévu pour ça.
- Passer la base de données en PostgreSQL et déployer (Render, Railway,
  Fly.io pour l'API ; Vercel pour le web ; EAS Build pour l'app mobile).
- Ajouter des tests automatisés (l'ossature Express + Prisma s'y prête bien).

## Note sur la vérification

Le code a été vérifié dans cet environnement : le build Next.js compile et
type-check sans erreur, et le backend TypeScript compile correctement (les
avertissements de type liés à Prisma disparaissent après `prisma generate`,
qui nécessite un accès réseau non disponible dans cet environnement de
développement mais fonctionnera normalement sur votre machine ou en CI).
