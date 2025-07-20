import { Matiere } from './matiere';
import { Classe } from './classe';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  role: 'administrateur' | 'enseignant' | 'eleve' | 'parent';
  dateCreation: Date;
  actif: boolean;
  role_id: number; // Ajouté pour compatibilité API
}

export interface Administrateur extends Utilisateur {
  role: 'administrateur';
}

export interface Enseignant extends Utilisateur {
  role: 'enseignant';
  matieres: Matiere[];
  classes: Classe[];
}

export interface Eleve extends Utilisateur {
  role: 'eleve';
  dateNaissance: Date;
  classe: Classe;
  parent?: Parent;
  numeroEtudiant: string;
}

export interface Parent extends Utilisateur {
  role: 'parent';
  enfants: Eleve[];
  telephone: string;
} 