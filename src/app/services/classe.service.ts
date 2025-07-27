import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClasseService {
  private apiUrl = 'http://localhost:8000/api/classes';

  constructor(private http: HttpClient) {}

  getClasses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getClasse(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createClasse(classe: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, classe);
  }

  updateClasse(id: number, classe: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, classe);
  }

  deleteClasse(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getMesClasses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/classes/mes-classes`);
  }
} 