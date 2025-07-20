import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eleve } from '../models/utilisateur';
import { Classe } from '../models/classe';

@Injectable({
  providedIn: 'root'
})
export class EleveService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getEleves(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(`${this.apiUrl}/eleves`);
  }

  getEleve(id: number): Observable<Eleve> {
    return this.http.get<Eleve>(`${this.apiUrl}/eleves/${id}`);
  }

  createEleve(eleve: Partial<Eleve>): Observable<Eleve> {
    return this.http.post<Eleve>(`${this.apiUrl}/eleves`, eleve);
  }

  updateEleve(id: number, eleve: Partial<Eleve>): Observable<Eleve> {
    return this.http.put<Eleve>(`${this.apiUrl}/eleves/${id}`, eleve);
  }

  deleteEleve(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eleves/${id}`);
  }

  getElevesByClasse(classeId: number): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(`${this.apiUrl}/classes/${classeId}/eleves`);
  }

  affecterClasse(eleveId: number, classeId: number): Observable<Eleve> {
    return this.http.post<Eleve>(`${this.apiUrl}/eleves/${eleveId}/affecter-classe`, { classe_id: classeId });
  }
} 