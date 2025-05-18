# Cahier des Charges - Application de Création de Groupes (Projet Nexus)

## 1. Introduction

### 1.1 Contexte

Dans le cadre des formations Simplon, la constitution répétée de groupes d’apprenants selon des critères (mixité, ancienneté, compétences, etc.) est chronophage et sujette aux doublons. Le client demande une application web modulable et pédagogique pour générer, gérer et historiser ces groupes, débutant en stockage local avant migration server-side.

### 1.2 Objectifs

- **Automatiser** la création de groupes selon des critères personnalisables
- **Historiser** chaque tirage pour éviter les doublons
- **Expérience fluide** : responsive (desktop & mobile), accessible (WCAG 2.1 AA)
- **RGPD** : aucun tracking tiers, export/import des données utilisateurs
- **Déploiement** : conteneurisation Docker + pipeline CI/CD (GitHub Actions) avec pnpm

## 2. Périmètre

- **Type** : Single Page Application (SPA)
- **Frontend** : Angular (HTML, CSS via Tailwind CSS + DaisyUI, TypeScript)
- **Backend** : Java 11+ avec Spring Boot
- **Base de données** : PostgreSQL (v12+)
- **Design** : Charte Graphique + Wireframe + Maquette Figma
- **Persistance initiale** : LocalStorage (prototype, avant migration backend)
- **Import/Export** : CSV (listes, personnes, tirages)
- **Communication** : WebSocket prévisionnel (Spring WebSocket/STOMP)

## 3. Exigences Fonctionnelles

### 3.1 Gestion des Listes

- **CRUD Listes** : créer, renommer, supprimer (nom unique par user)
- **Tableau de bord** : synthèse (nom liste, nb personnes, nb tirages créés)

### 3.2 Gestion des Personnes

- **CRUD Personnes**, champs :
  - Nom (3–50 car.)
  - Genre (libre)
  - Âge (1–99)
  - Niveau technique (1–4)
  - Profils (multi : auditif, visuel, kinesthésique, analytique, collaboratif, leadership, créatif, autonome)
  - Ancien·ne DWWM (oui/non)
  - Aisance en français (1–4)

### 3.3 Création de Groupes

1. Définir nb et noms des groupes
2. Choisir critères de mixité (âge, ancienneté, niveau, profils)
3. Génération aléatoire tenant compte de l’historique
4. Ajustement manuel (drag-and-drop)
5. Validation et verrouillage du tirage
6. Relance possible

### 3.4 Dashboards Utilisateurs

- **3 rôles** : Admin, Formateur, Apprenant
  1. **Admin** : gestion des utilisateurs, tags globaux, métriques globales
  2. **Formateur** : création/suivi des listes et tirages de ses groupes
  3. **Apprenant** : consultation de ses affectations et historique
- Routes protégées via guards Angular (`CanActivate`)

### 3.5 Import / Export CSV

- **Export** : listes, personnes, tirages
- **Import** : restaurer des listes depuis un fichier CSV

### 3.6 Gestion du Compte

- Simulation client-side : création, modification, suppression
- Renouvellement des CGU tous les 13 mois (alerte in-app)

## 4. Exigences Non-Fonctionnelles

| Critère          | Objectif                          | Mesure                       |
| ---------------- | --------------------------------- | ---------------------------- |
| Performance      | < 200 ms / interaction clé        | Audit Lighthouse local       |
| Qualité de code  | Couverture tests ≥ 80 %           | Rapports Jest/Vitest, JaCoCo |
| Accessibilité    | WCAG 2.1 AA                       | Axe / Pa11y                  |
| Sécurité & RGPD  | Pas de tracking, isolation client | Revue de code                |
| Containerisation | Image Docker opérationnelle       | Build & Run Docker           |
| CI/CD            | Pipeline GitHub Actions vert      | Statut workflows             |

## 5. Architecture & Contraintes Techniques

### 5.1 Structure Générale

```bash
/ project-root
├── frontend            # Application Angular
│   ├── src
│   │   ├── app
│   │   │   ├── core         # services globaux (auth, apiClient, errorHandler)
│   │   │   ├── features     # modules fonctionnels (listes, personnes, groupes)
│   │   │   ├── shared       # composants réutilisables (button, modal)
│   │   │   ├── layouts      # MainLayout, AuthLayout
│   │   │   ├── pages        # DashboardAdmin, DashboardFormateur, HomeApprenant
│   │   │   ├── guards       # auth guards par rôle
│   │   │   └── interceptors # JWT, gestion erreurs HTTP
│   │   ├── assets          # images, icons (lucide-angular)
│   │   └── styles          # Tailwind config, globals.scss
│   └── e2e                 # Cypress tests end-to-end
├── backend             # API Spring Boot
│   ├── src/main/java/com/tonapp
│   │   ├── config      # sécurité, Swagger, WebSocket
│   │   ├── controller  # endpoints REST
│   │   ├── dto         # Data Transfer Objects
│   │   ├── entity      # JPA Entities (User, List, Person…)
│   │   ├── exception   # GlobalExceptionHandler
│   │   ├── repository  # Spring Data JPA interfaces
│   │   ├── security    # JWT, OAuth2 config
│   │   └── service     # business logic
│   └── src/main/resources
│       ├── application.yml
│       └── db          # scripts init SQL
├── .github/workflows   # CI/CD definitions
├── Dockerfile          # multi-stage build
└── README.md
```

### 5.2 Modèle Conceptuel de Données

| Entité  | Champs principaux                                                                             |
| ------- | --------------------------------------------------------------------------------------------- |
| User    | id (UUID), githubId, name, avatarUrl, role, timestamps                                        |
| List    | id (UUID), name, ownerId, timestamps                                                          |
| Person  | id (UUID), listId, name, genre, age, niveauTech, profils[], ancienDWWM, aisanceFr, timestamps |
| Drawing | id (UUID), listId, date, groups[]                                                             |
| Group   | id (UUID), drawingId, name, members[]                                                         |

**Relations** : List→Person (1:n), List→Drawing (1:n), Drawing→Group (1:n), Group⇆Person (n:m)

## 6. API REST

> Préfixe `/api`

### Authentification

- `GET  /auth/github` → OAuth2 redirection
- `GET  /auth/callback` → callback GitHub
- `POST /auth/refresh` → rafraîchir JWT
- `POST /auth/logout` → déconnexion
- `GET  /auth/profile` → profil utilisateur

### Listes

- `GET    /lists`
- `POST   /lists`
- `PATCH  /lists/:id`
- `DELETE /lists/:id`

### Personnes

- `GET    /lists/:id/persons`
- `POST   /lists/:id/persons`
- `PATCH  /persons/:id`
- `DELETE /persons/:id`

### Tirages & Groupes

- `GET    /lists/:id/drawings`
- `POST   /lists/:id/drawings`
- `GET    /drawings/:id/groups`
- `PATCH  /api/groups/:id`
- `DELETE /api/groups/:id`

### Import/Export CSV

- `POST /import` (fichier CSV)
- `GET  /export` → téléchargement CSV

## 7. Temps Réel (Optionnel)

- **WebSocket** via Spring WebSocket + STOMP over SockJS
- **Événements** : `drawing:created`, `group:updated`, `notification:new` pour mise à jour instantanée

## 8. Tests & Qualité

### 8.1 Frontend

- **Unitaires** : Vitest ou Jest pour components, services, guards
- **E2E** : Cypress pour scénarios clés (login, création de groupes, export)

### 8.2 Backend

- **Unitaires** : JUnit 5 + Mockito pour services et logique
- **Intégration** : `@SpringBootTest` + Testcontainers (PostgreSQL) pour endpoints et persistance

## 9. CI/CD (GitHub Actions + pnpm)

Fichier : `.github/workflows/ci.yml`

```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js & pnpm
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"
      - name: Install dependencies (frontend)
        working-directory: frontend
        run: pnpm install --frozen-lockfile
      - name: Setup JDK 11
        uses: actions/
```
