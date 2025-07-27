import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <nav class="sidebar">
        <div class="sidebar-header">
          <h2>Administration</h2>
          <p>{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
        </div>
        
        <ul class="nav-menu">
          <li>
            <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <span class="icon">📊</span>
              Tableau de bord
            </a>
          </li>
          <li>
            <a routerLink="/admin/eleves" routerLinkActive="active">
              <span class="icon">👥</span>
              Élèves
            </a>
          </li>
          <li>
            <a routerLink="/admin/classes" routerLinkActive="active">
              <span class="icon">🏫</span>
              Classes
            </a>
          </li>
          <li>
            <a routerLink="/admin/enseignants" routerLinkActive="active">
              <span class="icon">👨‍🏫</span>
              Enseignants
            </a>
          </li>
          <li>
            <a routerLink="/admin/matieres" routerLinkActive="active">
              <span class="icon">📚</span>
              Matières
            </a>
          </li>
          <li>
            <a routerLink="/admin/bulletins" routerLinkActive="active">
              <span class="icon">📋</span>
              Bulletins
            </a>
          </li>
        </ul>
        
        <div class="sidebar-footer">
          <button (click)="logout()" class="logout-button">
            <span class="icon">🚪</span>
            Déconnexion
          </button>
        </div>
      </nav>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }
    
    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
      color: white;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .sidebar-header {
      padding: 30px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .sidebar-header h2 {
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 600;
    }
    
    .sidebar-header p {
      margin: 0;
      opacity: 0.8;
      font-size: 14px;
    }
    
    .nav-menu {
      list-style: none;
      padding: 0;
      margin: 0;
      flex: 1;
    }
    
    .nav-menu li {
      margin: 0;
    }
    
    .nav-menu a {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
    }
    
    .nav-menu a:hover {
      background: rgba(255, 255, 255, 0.1);
      border-left-color: #3498db;
    }
    
    .nav-menu a.active {
      background: rgba(52, 152, 219, 0.2);
      border-left-color: #3498db;
    }
    
    .nav-menu .icon {
      margin-right: 12px;
      font-size: 18px;
      width: 20px;
      text-align: center;
    }
    
    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .logout-button {
      width: 100%;
      background: rgba(231, 76, 60, 0.8);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    }
    
    .logout-button:hover {
      background: rgba(231, 76, 60, 1);
    }
    
    .logout-button .icon {
      margin-right: 8px;
    }
    
    .main-content {
      flex: 1;
      background: #f8f9fa;
      overflow-y: auto;
    }
  `]
})
export class AdminDashboardComponent {
  currentUser: any;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
} 