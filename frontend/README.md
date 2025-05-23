# Plan d'Implémentation du Projet Nexus

## Vue d'ensemble
Projet Nexus est une application Angular 19+ pour la création et gestion de groupes d'apprenants selon divers critères. L'application utilise initialement le LocalStorage pour la persistance des données avant une future migration vers un backend.

## Technologies
- **Frontend**: Angular 19+, TypeScript, pnpm
- **Styling**: Tailwind CSS + DaisyUI
- **Icons**: Lucide Angular
- **Testing**: Vitest (tests unitaires), Cypress (tests E2E)
- **CI/CD**: GitHub Actions

## Structure du Projet
```
frontend/
├── src/
│   ├── app/
│   │   ├── core/         # services globaux (auth, storage, error handling)
│   │   ├── features/     # modules fonctionnels (listes, personnes, groupes)
│   │   ├── shared/       # composants réutilisables
│   │   ├── layouts/      # layouts de l'application
│   │   ├── pages/        # composants de pages
│   │   ├── guards/       # guards d'authentification
│   │   └── interceptors/ # intercepteurs HTTP
│   ├── assets/           # ressources statiques
│   └── styles/           # styles globaux
└── e2e/                  # tests end-to-end
```

## Plan d'Implémentation

### Phase 1: Configuration et Structure de Base
1. **Configuration de l'environnement**
   - Vérifier la configuration de Tailwind CSS et DaisyUI
   - Configurer les tests avec Vitest et Cypress
   - Mettre en place ESLint et Prettier

2. **Mise en place de la structure modulaire**
   - Configurer les modules core, shared, features, etc.
   - Définir les routes principales de l'application
   - Créer les layouts de base (MainLayout, AuthLayout)

3. **Services de base**
   - Implémenter le service LocalStorageService pour la persistance
   - Créer un service d'authentification simulé
   - Mettre en place la gestion des erreurs

### Phase 2: Fonctionnalités de Gestion des Listes
1. **Modèles de données**
   - Définir les interfaces pour User, List, Person, Drawing, Group
   - Créer les services CRUD pour les listes

2. **Composants de gestion des listes**
   - Créer le composant ListsPage pour afficher toutes les listes
   - Implémenter les formulaires de création/édition de listes
   - Développer le tableau de bord des listes

### Phase 3: Gestion des Personnes
1. **Services de gestion des personnes**
   - Implémenter les services CRUD pour les personnes
   - Créer les validateurs pour les formulaires de personnes

2. **Composants de gestion des personnes**
   - Développer le composant PersonsPage pour afficher les personnes d'une liste
   - Créer les formulaires d'ajout/édition de personnes avec tous les champs requis
   - Implémenter l'import/export CSV des personnes

### Phase 4: Création et Gestion des Groupes
1. **Algorithme de génération de groupes**
   - Implémenter l'algorithme de création de groupes aléatoires
   - Intégrer les critères de mixité (âge, ancienneté, niveau, profils)
   - Gérer l'historique pour éviter les doublons

2. **Interface de création de groupes**
   - Développer l'interface de définition des groupes
   - Créer le composant de visualisation des groupes
   - Implémenter le drag-and-drop pour l'ajustement manuel

3. **Historisation des tirages**
   - Créer le système de sauvegarde des tirages
   - Développer l'interface de consultation de l'historique

### Phase 5: Fonctionnalités Utilisateur
1. **Gestion des rôles**
   - Implémenter la simulation des rôles (Admin, Formateur, Apprenant)
   - Créer les guards pour protéger les routes selon les rôles

2. **Tableaux de bord spécifiques**
   - Développer le tableau de bord Admin
   - Créer le tableau de bord Formateur
   - Implémenter la vue Apprenant

3. **Gestion du compte**
   - Créer les composants de gestion de profil
   - Implémenter la simulation de création/modification/suppression de compte
   - Développer le système d'alerte pour les CGU

### Phase 6: Tests et Qualité
1. **Tests unitaires**
   - Écrire les tests unitaires pour les services
   - Tester les composants principaux
   - Atteindre une couverture de tests ≥ 80%

2. **Tests E2E**
   - Implémenter les scénarios de test critiques
   - Tester le flux complet de création de groupes
   - Vérifier l'import/export CSV

3. **Accessibilité et Performance**
   - Vérifier la conformité WCAG 2.1 AA
   - Optimiser les performances
   - Tester la responsivité (desktop & mobile)

### Phase 7: Déploiement et CI/CD
1. **Configuration CI/CD**
   - Mettre en place le workflow GitHub Actions
   - Configurer les étapes d'installation, lint, test, build
   - Configurer le déploiement sur GitHub Pages

2. **Documentation**
   - Compléter la documentation du projet
   - Créer des templates pour les issues et PR
   - Documenter l'utilisation de l'application

## Prochaines Étapes
1. Commencer par la Phase 1 pour mettre en place la structure de base
2. Implémenter progressivement les fonctionnalités en suivant les phases
3. Maintenir une qualité de code élevée avec des tests réguliers
4. Préparer la migration future vers un backend Spring Boot
