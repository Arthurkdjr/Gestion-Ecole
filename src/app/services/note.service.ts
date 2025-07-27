import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  saveNotes(eleveId: number, notes: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/eleves/${eleveId}/notes`, { notes });
  }
} 