import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utilisateur, LoginResponse } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Vérifier s'il y a un utilisateur stocké au démarrage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Propriété pour maintenir la compatibilité
  public get currentUserValue(): Utilisateur | null {
    return this.currentUserSubject.value;
  }

  login(email: string, motDePasse: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email: email,
      mot_de_passe: motDePasse
    }).pipe(
      map(response => {
        console.log('Réponse API login:', response);
        
        // Stocker le token
        localStorage.setItem('token', response.token);
        
        // Mapper le role_id vers un rôle string pour la compatibilité
        const user = response.utilisateur;
        user.role = this.mapRoleIdToString(user.role_id);
        
        // Stocker l'utilisateur
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Utilisateur | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Méthode pour maintenir la compatibilité
  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  // Méthode pour vérifier les rôles
  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private mapRoleIdToString(roleId: number): string {
    switch (roleId) {
      case 1: return 'admin';
      case 2: return 'enseignant';
      case 3: return 'eleve';
      case 4: return 'parent';
      default: return 'user';
    }
  }
} 