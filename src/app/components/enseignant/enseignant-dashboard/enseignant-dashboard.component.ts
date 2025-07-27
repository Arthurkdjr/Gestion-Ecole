import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-enseignant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="enseignant-layout">
      <nav class="sidebar">
        <div class="sidebar-header">
          <div class="user-info">
            <div class="avatar">
              <span class="avatar-text">{{ getInitials() }}</span>
            </div>
            <div class="user-details">
              <h2>Espace Enseignant</h2>
              <p>{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
              <span class="user-role">Enseignant</span>
            </div>
          </div>
        </div>
        
        <ul class="nav-menu">
          <li>
            <a routerLink="/enseignant/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <span class="icon">📊</span>
              <span class="nav-text">Tableau de bord</span>
            </a>
          </li>
          <li>
            <a routerLink="/enseignant/classes" routerLinkActive="active">
              <span class="icon">🏫</span>
              <span class="nav-text">Mes classes</span>
            </a>
          </li>
          <li>
            <a routerLink="/enseignant/bulletins" routerLinkActive="active">
              <span class="icon">📋</span>
              <span class="nav-text">Bulletins</span>
            </a>
          </li>
        </ul>
        
        <div class="sidebar-footer">
          <div class="quick-stats">
            <div class="stat-item">
              <span class="stat-icon">📚</span>
              <div class="stat-info">
                <span class="stat-number">{{ stats?.classes || 0 }}</span>
                <span class="stat-label">Classes</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">👥</span>
              <div class="stat-info">
                <span class="stat-number">{{ stats?.eleves || 0 }}</span>
                <span class="stat-label">Élèves</span>
              </div>
            </div>
          </div>
          <button (click)="logout()" class="logout-button">
            <span class="icon">🚪</span>
            <span class="logout-text">Déconnexion</span>
          </button>
        </div>
      </nav>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .enseignant-layout {
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
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }
    
    .sidebar-header {
      padding: 30px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .avatar-text {
      font-size: 18px;
      font-weight: bold;
      color: white;
    }
    
    .user-details h2 {
      margin: 0 0 5px 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .user-details p {
      margin: 0 0 3px 0;
      opacity: 0.9;
      font-size: 14px;
    }
    
    .user-role {
      font-size: 12px;
      opacity: 0.7;
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 8px;
      border-radius: 10px;
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
      transform: translateX(5px);
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
    
    .nav-text {
      font-size: 14px;
      font-weight: 500;
    }
    
    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .quick-stats {
      margin-bottom: 20px;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .stat-item:last-child {
      border-bottom: none;
    }
    
    .stat-icon {
      font-size: 16px;
      opacity: 0.8;
    }
    
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    
    .stat-number {
      font-size: 16px;
      font-weight: bold;
      color: #3498db;
    }
    
    .stat-label {
      font-size: 12px;
      opacity: 0.7;
    }
    
    .logout-button {
      width: 100%;
      background: rgba(231, 76, 60, 0.8);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
    }
    
    .logout-button:hover {
      background: rgba(231, 76, 60, 1);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
    }
    
    .logout-button .icon {
      margin-right: 8px;
      font-size: 16px;
    }
    
    .main-content {
      flex: 1;
      background: #f8f9fa;
      overflow-y: auto;
      margin-left: 280px;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .main-content {
        margin-left: 0;
      }
    }
  `]
})
export class EnseignantDashboardComponent {
  currentUser: any;
  stats: any = {};

  constructor(private authService: AuthService) {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  getInitials(): string {
    if (this.currentUser?.prenom && this.currentUser?.nom) {
      return (this.currentUser.prenom.charAt(0) + this.currentUser.nom.charAt(0)).toUpperCase();
    }
    return 'EN';
  }

  loadStats(): void {
    // Simulation des statistiques
    // Plus tard, on pourra charger depuis un service
    this.stats = {
      classes: 3,
      eleves: 45
    };
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
} 