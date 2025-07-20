import { Classe } from './classe';

export interface Matiere {
  id: number;
  nom: string;
  code: string;
  coefficient: number;
  niveau: string;
  enseignant?: Enseignant;
  classes: Classe[];
}

export interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  matieres: Matiere[];
  classes: Classe[];
} 