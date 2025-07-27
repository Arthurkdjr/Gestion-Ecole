import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BulletinService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Récupérer tous les bulletins
  getBulletins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bulletins`);
  }

  // Récupérer les bulletins d'une classe
  getBulletinsByClasse(classeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/classes/${classeId}/bulletins`);
  }

  // Récupérer le bulletin d'un élève
  getBulletinByEleve(eleveId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eleves/${eleveId}/bulletin`);
  }

  // Générer les bulletins pour une classe
  genererBulletins(classeId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/classes/${classeId}/bulletins/generer`, {});
  }

  // Exporter les bulletins d'une classe
  exporterBulletins(classeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/classes/${classeId}/bulletins/export`, {
      responseType: 'blob'
    });
  }

  // Récupérer les statistiques des bulletins
  getStatsBulletins(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bulletins/stats`);
  }

  // Récupérer les bulletins de l'enseignant connecté
  getMesBulletins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bulletins/mes-bulletins`);
  }
} 