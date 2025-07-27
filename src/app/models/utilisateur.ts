import { Matiere } from './matiere';
import { Classe } from './classe';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  role_id: number;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  utilisateur: Utilisateur;
  token: string;
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