import { Enseignant } from './matiere';
import { Matiere } from './matiere';

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  anneeScolaire: string;
  effectif: number;
  eleves: Eleve[];
  enseignants: Enseignant[];
  matieres: Matiere[];
}

export interface Eleve {
  id: number;
  nom: string;
  prenom: string;
  numeroEtudiant: string;
  dateNaissance: Date;
  classe: Classe;
} 