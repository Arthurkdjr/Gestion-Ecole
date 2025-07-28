import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('AuthGuard - Vérification de l\'authentification');
    console.log('AuthGuard - isAuthenticated():', this.authService.isAuthenticated());
    console.log('AuthGuard - currentUserValue:', this.authService.currentUserValue);
    
    if (this.authService.isAuthenticated()) {
      console.log('AuthGuard - Utilisateur authentifié, accès autorisé');
      return true;
    } else {
      console.log('AuthGuard - Utilisateur non authentifié, redirection vers login');
      this.router.navigate(['/login']);
      return false;
    }
  }
} 