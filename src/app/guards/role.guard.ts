import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('RoleGuard - Vérification de l\'accès');
    console.log('Route data:', route.data);
    
    if (!this.authService.isAuthenticated()) {
      console.log('RoleGuard - Utilisateur non authentifié, redirection vers login');
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'];
    console.log('RoleGuard - Rôle requis:', requiredRole);
    
    if (!requiredRole) {
      console.log('RoleGuard - Aucun rôle requis, accès autorisé');
      return true;
    }

    const userRole = this.authService.currentUserValue?.role;
    console.log('RoleGuard - Rôle utilisateur:', userRole);
    
    if (userRole === requiredRole) {
      console.log('RoleGuard - Accès autorisé');
      return true;
    } else {
      console.log('RoleGuard - Accès refusé, redirection vers unauthorized');
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
} 