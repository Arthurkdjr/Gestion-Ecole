import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EnseignantService {
  private apiUrl = 'http://localhost:8000/api/enseignants';

  constructor(private http: HttpClient) {}

  getEnseignants(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEnseignant(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEnseignant(enseignant: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, enseignant);
  }

  updateEnseignant(id: number, enseignant: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, enseignant);
  }

  deleteEnseignant(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  affecterClasses(enseignantId: number, classeIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${enseignantId}/affecter-classes`, {
      classe_ids: classeIds
    });
  }

  getClassesEnseignant(enseignantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${enseignantId}/classes`);
  }
} 