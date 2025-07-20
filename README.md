# Gestion École - Frontend Angular

Application web de gestion administrative et académique d'établissement scolaire développée avec Angular 19.

## 🎯 Objectif

Développer une application web sécurisée qui centralise la gestion administrative et académique de l'école via un back-office accessible à l'administration et aux enseignants, tout en offrant un portail dédié aux élèves et parents pour consulter en temps réel les bulletins de notes.

## 🚀 Fonctionnalités

### 👨‍💼 Administrateur
- **Tableau de bord** : Vue d'ensemble avec statistiques
- **Gestion des élèves** : CRUD complet avec recherche
- **Gestion des classes** : Création et affectation
- **Gestion des enseignants** : Création et affectation
- **Gestion des matières** : Création avec coefficients
- **Gestion des bulletins** : Génération et téléchargement

### 👨‍🏫 Enseignant
- **Tableau de bord** : Vue personnalisée
- **Saisie des notes** : Interface de saisie par classe/matière
- **Mes classes** : Consultation des classes assignées

### 👨‍🎓 Élève
- **Consultation des bulletins** : Accès en lecture seule
- **Téléchargement PDF** : Bulletins disponibles

### 👨‍👩‍👧‍👦 Parent
- **Suivi des enfants** : Accès aux bulletins de tous les enfants
- **Historique** : Consultation des bulletins par période

## 🛠️ Technologies Utilisées

- **Frontend** : Angular 19 (Standalone Components)
- **Backend** : Laravel (API REST)
- **Authentification** : JWT Token
- **Styles** : CSS3 avec design moderne
- **Responsive** : Mobile-first design

## 📁 Structure du Projet

```
src/
├── app/
│   ├── components/
│   │   ├── admin/           # Composants administrateur
│   │   ├── enseignant/      # Composants enseignant
│   │   ├── eleve/          # Composants élève
│   │   ├── parent/         # Composants parent
│   │   ├── login/          # Page de connexion
│   │   └── unauthorized/   # Page d'erreur
│   ├── models/             # Interfaces TypeScript
│   ├── services/           # Services API
│   ├── guards/             # Guards d'authentification
│   └── app.component.ts    # Composant principal
├── styles.css              # Styles globaux
└── main.ts                 # Point d'entrée
```

## 🔧 Installation et Configuration

### Prérequis
- Node.js (version 18+)
- npm ou yarn
- Backend Laravel configuré et fonctionnel

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd gestion-ecole-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'API**
Modifier l'URL de l'API dans les services :
```typescript
// src/app/services/auth.service.ts
private apiUrl = 'http://localhost:8000/api'; // URL de votre backend Laravel
```

4. **Lancer l'application**
```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 🔐 Authentification

L'application utilise un système d'authentification JWT avec 4 rôles :

- **Administrateur** : Accès complet à toutes les fonctionnalités
- **Enseignant** : Saisie des notes et consultation des classes
- **Élève** : Consultation de ses propres bulletins
- **Parent** : Consultation des bulletins de ses enfants

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Design System

### Couleurs par rôle
- **Administrateur** : Bleu foncé (#2c3e50)
- **Enseignant** : Vert (#27ae60)
- **Élève** : Bleu (#3498db)
- **Parent** : Violet (#9b59b6)

### Composants réutilisables
- Formulaires modaux
- Tableaux de données
- Cartes de statistiques
- Boutons d'action

## 🔄 API Endpoints

L'application communique avec le backend Laravel via les endpoints suivants :

### Authentification
- `POST /api/login` - Connexion utilisateur
- `POST /api/logout` - Déconnexion

### Élèves
- `GET /api/eleves` - Liste des élèves
- `POST /api/eleves` - Créer un élève
- `PUT /api/eleves/{id}` - Modifier un élève
- `DELETE /api/eleves/{id}` - Supprimer un élève

### Bulletins
- `GET /api/bulletins` - Liste des bulletins
- `GET /api/bulletins/{id}/pdf` - Télécharger PDF
- `POST /api/bulletins/generer` - Générer bulletin

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Variables d'environnement
Créer un fichier `.env` pour configurer l'URL de l'API :
```
API_URL=http://localhost:8000/api
```

## 📋 TODO

- [ ] Implémentation complète de la gestion des classes
- [ ] Implémentation complète de la gestion des enseignants
- [ ] Implémentation complète de la gestion des matières
- [ ] Implémentation complète de la saisie des notes
- [ ] Implémentation complète des bulletins
- [ ] Notifications email
- [ ] Tests unitaires
- [ ] Tests d'intégration

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est développé dans le cadre d'un projet académique.

## 👥 Auteurs

- Équipe de développement (Groupe de 3 étudiants)

---

**Note** : Ce projet est en cours de développement. Certains modules affichent "Module en cours de développement..." et seront implémentés progressivement.
