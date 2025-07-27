import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AffectationService {
  private apiUrl = 'http://localhost:8000/api/affectations';

  constructor(private http: HttpClient) {}

  // Créer une affectation (enseignant + matière + classe)
  createAffectation(affectation: {
    enseignant_id: number;
    matiere_id: number;
    classe_id: number;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, affectation);
  }

  // Récupérer toutes les affectations
  getAffectations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Récupérer les affectations d'un enseignant
  getAffectationsByEnseignant(enseignantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?enseignant_id=${enseignantId}`);
  }

  // Récupérer les affectations d'une classe
  getAffectationsByClasse(classeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?classe_id=${classeId}`);
  }

  // Récupérer les affectations d'une matière
  getAffectationsByMatiere(matiereId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?matiere_id=${matiereId}`);
  }

  // Supprimer une affectation
  deleteAffectation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une affectation
  updateAffectation(id: number, affectation: {
    enseignant_id: number;
    matiere_id: number;
    classe_id: number;
  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, affectation);
  }
} 