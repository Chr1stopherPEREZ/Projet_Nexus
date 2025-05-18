# Brief.v1 - Projet Nexus

Votre client apprécie le travail accompli et vous demande de rendre fonctionnel le prototype front-end déjà conçu. Il n’est pas question, pour l’instant, de persistance serveur ni de tracking (RGPD). Vous réaliserez une SPA Angular animée, en TypeScript, simulant la persistance en LocalStorage et répondant aux spécifications du cahier des charges associé.

---

## Pré-requis

* Maîtrise d’**Angular (v15+)**, **TypeScript**, **pnpm**
* Utilisation de **Tailwind CSS + DaisyUI** pour le style
* Intégration d’**icônes Lucide** via lucide-angular
* Prototypage en **LocalStorage** (avant bascule backend)
* Connaissance de **testing** (Vitest, Cypress)

---

## Modalités pédagogiques

* **Durée** : 9 demi‑journées
* **Organisation** : binôme ou solo
* **Outils de gestion** : GitHub (branches main/dev/features), Issues & PR Templates

---

## 1. Maquettage (2 demi‑journées)

* Reprendre et compléter les wireframes et maquettes **Figma** (desktop & mobile)
* Documenter le guide de style : couleurs, typographies, espacement (tokens Tailwind)
* Valider l’accessibilité (WCAG 2.1 AA) et présenter un premier prototype interactif

## 2. Modèle Conceptuel de Données (MCD) (1 demi‑journée)

* Traduire en **diagramme Mermaid** le MCD validé (User, List, Person, Drawing, Group)
* Expliquer les choix de simulation (JSON dans LocalStorage) et préparer la V2 backend

## 3. Intégration Front-End (3 demi‑journées)

* Initialiser le projet Angular avec **pnpm**
* Structurer l’architecture : `core`, `shared`, `features`, `layouts`, `pages`, `guards`, `interceptors`
* Intégration HTML/CSS via Tailwind + DaisyUI
* Création de composants stateless et stateful en TypeScript
* Simulation de la persistance (LocalStorage) pour listes, personnes et tirages

## 4. Tests & Qualité (1 demi‑journée)

* Installer et configurer **Vitest** pour tests unitaires (coverage ≥ 80 %)
  * Commande : `pnpm run test:unit`
* Mettre en place **Cypress** pour tests E2E des cas critiques
  * Commande : `pnpm run test:e2e`
* Intégrer **ESLint** / **Prettier** (config partagée) et **audit Axe-core** en CI

## 5. CI/CD & Déploiement (1 demi‑journée)

* Créer le workflow GitHub Actions (`.github/workflows/front-ci.yml`) :
  * `pnpm install --frozen-lockfile`
  * `pnpm run lint`
  * `pnpm run test:unit`
  * `pnpm run build --output-path=dist/frontend`
  * Publication sur GitHub Pages via `peaceiris/actions-gh-pages`
* Documenter la procédure de déploiement et la configuration CI

## 6. Composants Métiers (1 demi‑journée)

* Implémentation de la génération aléatoire de groupes selon critères
* Prise en compte de l’historique (LocalStorage)
* Ajustement manuel via drag-and-drop
* Validation et verrouillage du tirage

## Modalités d’évaluation

* Qualité des maquettes et respect de l’accessibilité
* Propreté de l’architecture Angular et cohérence des composants
* Couverture et réussite des tests unitaires et E2E
* Fonctionnement du prototype déployé sur GitHub Pages
* Qualité de la documentation (README, Issues, PR Templates)

## Livrables

* **Dépôt GitHub** public contenant :
  * Code source front complet
  * Maquettes Figma (liens & fichiers)
  * Diagramme MCD (Mermaid)
  * Fichier CI (`front-ci.yml`)
  * Scripts de tests et configuration lint
  * README et templates de tickets/PR
* **URL du site** déployé (GitHub Pages)
* **Présentation orale** (10 min max)

## Critères de performance

* Maquette responsive et accessible (WCAG 2.1 AA)
* Build Angular < 2 s (Lighthouse CI)
* Coverage tests unitaires ≥ 80 %
* Scénarios E2E réussis (> 90 % de fiabilité)
* CI verte (lint, test, deploy)

