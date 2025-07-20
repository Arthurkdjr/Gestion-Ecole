import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utilisateur } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // URL de votre backend Laravel
  private currentUserSubject: BehaviorSubject<Utilisateur | null>;
  public currentUser: Observable<Utilisateur | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Utilisateur | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Utilisateur | null {
    return this.currentUserSubject.value;
  }

  login(email: string, motDePasse: string): Observable<Utilisateur> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, mot_de_passe: motDePasse })
      .pipe(map(response => {
        console.log('Réponse API login:', response);
        const user = response.utilisateur;
        if (user && response.token) {
          // Ajout de la propriété role selon role_id
          switch (user.role_id) {
            case 1: user.role = 'administrateur'; break;
            case 2: user.role = 'enseignant'; break;
            case 3: user.role = 'eleve'; break;
            case 4: user.role = 'parent'; break;
            default: user.role = 'inconnu';
          }
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
} 