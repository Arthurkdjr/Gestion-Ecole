import { Matiere } from './matiere';
import { Classe } from './classe';

export interface DocumentJustificatif {
  id: number;
  nom: string;
  type: 'certificat_naissance' | 'bulletin_anterieur' | 'certificat_medical' | 'piece_identite' | 'autre';
  fichier_url: string;
  date_upload: string;
  statut: 'en_attente' | 'valide' | 'rejete';
  commentaire?: string;
  eleve_id: number;
}

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
  date_naissance: string;
  classe_id: number | null;
  classe?: Classe;
  parent_id?: number;
  parent?: Parent;
  numero_etudiant: string;
  documents_justificatifs?: DocumentJustificatif[];
  statut_inscription: 'en_attente' | 'valide' | 'rejete';
}

export interface Parent extends Utilisateur {
  role: 'parent';
  enfants: Eleve[];
  telephone: string;
} 