import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  
  // Routes protégées par authentification
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['administrateur'] },
    loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'eleves', loadComponent: () => import('./components/admin/eleves/eleves.component').then(m => m.ElevesComponent) },
      { path: 'classes', loadComponent: () => import('./components/admin/classes/classes.component').then(m => m.ClassesComponent) },
      { path: 'enseignants', loadComponent: () => import('./components/admin/enseignants/enseignants.component').then(m => m.EnseignantsComponent) },
      { path: 'matieres', loadComponent: () => import('./components/admin/matieres/matieres.component').then(m => m.MatieresComponent) },
      { path: 'bulletins', loadComponent: () => import('./components/admin/bulletins/bulletins.component').then(m => m.BulletinsComponent) }
    ]
  },
  
  {
    path: 'enseignant',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['enseignant'] },
    loadComponent: () => import('./components/enseignant/enseignant-dashboard/enseignant-dashboard.component').then(m => m.EnseignantDashboardComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/enseignant/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'classes', loadComponent: () => import('./components/enseignant/classes/classes.component').then(m => m.ClassesComponent) },
      { path: 'classes/:id/eleves', loadComponent: () => import('./components/enseignant/classes/eleves.component').then(m => m.ElevesComponent) },
      { path: 'eleves/:id/notes', loadComponent: () => import('./components/enseignant/notes/notes.component').then(m => m.NotesComponent) },
      { path: 'bulletins', loadComponent: () => import('./components/enseignant/bulletins/bulletins.component').then(m => m.BulletinsComponent) }
    ]
  },
  
  {
    path: 'eleve',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['eleve'] },
    loadComponent: () => import('./components/eleve/eleve-dashboard/eleve-dashboard.component').then(m => m.EleveDashboardComponent),
    children: [
      { path: '', redirectTo: 'bulletins', pathMatch: 'full' },
      { path: 'bulletins', loadComponent: () => import('./components/eleve/bulletins/bulletins.component').then(m => m.BulletinsComponent) }
    ]
  },
  
  {
    path: 'parent',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['parent'] },
    loadComponent: () => import('./components/parent/parent-dashboard/parent-dashboard.component').then(m => m.ParentDashboardComponent),
    children: [
      { path: '', redirectTo: 'enfants', pathMatch: 'full' },
      { path: 'enfants', loadComponent: () => import('./components/parent/enfants/enfants.component').then(m => m.EnfantsComponent) }
    ]
  },
  
  { path: 'unauthorized', loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: '**', redirectTo: '/login' }
];
