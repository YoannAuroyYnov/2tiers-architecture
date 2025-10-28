# Architecture 2-tiers

## Sommaire

- [🚀 Installation et Configuration](#-installation-et-configuration)
- [❓ Questions d'analyse 2-tiers](#-questions-danalyse-2-tiers)

## 🚀 Installation et Configuration

### Prérequis

- `Node.js`
- `PostgreSQL`
- `pnpm`

### Installation et lancement

1. **Cloner le projet**

   ```bash
   git clone https://github.com/YoannAuroyYnov/2tiers-architecture.git
   cd 2tiers-architecture
   ```

2. **Installer les dépendances**

   ```bash
   pnpm install
   ```

3. **Configuration de la base de données**

   Créer un fichier `.env` à la racine du projet :

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=library_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

4. **Créer la base de données PostgreSQL**

   ```bash
   createdb library_db;
   ```

5. **Lancer l'application**
   ```bash
   node index.js
   ```

### Structure du projet

```
├── app/
│   ├── models/          # Modèles de données
│   ├── repositories/    # Couche d'accès aux données
│   └── views/           # Interface utilisateur (console)
├── index.js             # Point d'entrée de l'application
└── package.json         # Configuration et dépendances
```

## ❓ Questions d'analyse 2-tiers

### Où se trouve la logique de validation des données ?

**Réponse :** La logique de validation est **dispersée et problématique** :

- **Dans la Vue (`BookView.js`)** : Validation côté interface utilisateur
- **Aucune validation dans le Modèle** : La classe `Book` accepte n'importe quelles données sans validation
- **Aucune validation dans le Repository** : `BookRepository` fait confiance aux données reçues

**Problème** : Cette approche viole le principe de responsabilité unique. La validation devrait être dans le modèle métier.

### Que se passe-t-il si vous voulez ajouter une interface web en plus de l'interface console ?

**Réponse :** Une **duplication de code massive** serait nécessaire :

**Problèmes identifiés :**

- La validation est dans `BookView` → Il faudrait re-coder toute la validation dans l'interface web
- La logique métier est mélangée avec l'interface console

### Comment tester la logique métier sans l'interface ?

**Réponse :** **C'est très difficile** avec l'architecture actuelle :

**Problèmes pour les tests :**

1. **Pas de logique métier isolée** : La validation est dans `BookView`
2. **Couplage base de données** : `BookRepository` est directement couplé à PostgreSQL
3. **Pas d'injection de dépendances** : Impossible de mocker les dépendances
4. **Tests d'intégration obligatoires** : Il faut une vraie base de données pour tester

### Identifiez les couplages forts dans le code

**Couplages forts identifiés :**

#### 1. **Vue ↔ Repository (Très fort)**

- `BookView` instancie directement `BookRepository`
- Impossible de changer de système de persistance sans modifier la vue

#### 2. **Repository ↔ Base de données PostgreSQL (Fort)**

- `BookRepository` importe directement `pg`
- Couplé à la structure spécifique des tables PostgreSQL
- Impossible de changer de SGBD sans réécrire le repository

#### 3. **Vue ↔ Interface Console (Fort)**

- `BookView` utilise directement `readline` et `console`
- Impossible de réutiliser pour une interface web/API
- La logique métier est mélangée à la présentation

**Conséquences des couplages :**

- Code difficile à maintenir
- Tests unitaires impossibles
- Évolution architecturale compliquée
- Réutilisation de code limitée
- Violation des principes SOLID
