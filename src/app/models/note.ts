export interface Note {
  id: number;
  eleve: Eleve;
  matiere: Matiere;
  classe: Classe;
  valeur: number;
  coefficient: number;
  type: 'devoir' | 'examen' | 'composition';
  periode: string;
  dateEvaluation: Date;
  commentaire?: string;
  enseignant: Enseignant;
}

export interface Bulletin {
  id: number;
  eleve: Eleve;
  classe: Classe;
  periode: string;
  anneeScolaire: string;
  notes: Note[];
  moyenneGenerale: number;
  rang: number;
  mention: string;
  appreciation: string;
  dateGeneration: Date;
  disponible: boolean;
}

export interface Eleve {
  id: number;
  nom: string;
  prenom: string;
  numeroEtudiant: string;
}

export interface Matiere {
  id: number;
  nom: string;
  coefficient: number;
}

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
}

export interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
} 