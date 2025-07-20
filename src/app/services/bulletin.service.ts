import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bulletin, Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getBulletins(): Observable<Bulletin[]> {
    return this.http.get<Bulletin[]>(`${this.apiUrl}/bulletins`);
  }

  getBulletin(id: number): Observable<Bulletin> {
    return this.http.get<Bulletin>(`${this.apiUrl}/bulletins/${id}`);
  }

  getBulletinsByEleve(eleveId: number): Observable<Bulletin[]> {
    return this.http.get<Bulletin[]>(`${this.apiUrl}/eleves/${eleveId}/bulletins`);
  }

  getBulletinsByClasse(classeId: number): Observable<Bulletin[]> {
    return this.http.get<Bulletin[]>(`${this.apiUrl}/classes/${classeId}/bulletins`);
  }

  generateBulletin(eleveId: number, periode: string): Observable<Bulletin> {
    return this.http.post<Bulletin>(`${this.apiUrl}/bulletins/generer`, {
      eleve_id: eleveId,
      periode: periode
    });
  }

  downloadBulletinPDF(bulletinId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/bulletins/${bulletinId}/pdf`, {
      responseType: 'blob'
    });
  }

  downloadBulletinsClasse(classeId: number, periode: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/classes/${classeId}/bulletins/telecharger`, {
      responseType: 'blob',
      params: { periode }
    });
  }

  // Services pour les notes
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  getNotesByEleve(eleveId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/eleves/${eleveId}/notes`);
  }

  getNotesByClasse(classeId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/classes/${classeId}/notes`);
  }

  createNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/notes`, note);
  }

  updateNote(id: number, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/notes/${id}`, note);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notes/${id}`);
  }
} 