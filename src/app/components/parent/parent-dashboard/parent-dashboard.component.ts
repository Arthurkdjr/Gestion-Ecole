import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="parent-layout">
      <nav class="sidebar">
        <div class="sidebar-header">
          <div class="user-info">
            <div class="avatar">
              {{ getInitials() }}
            </div>
            <div class="user-details">
              <h2>Espace Parent</h2>
              <p class="user-name">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
              <p class="user-role">Parent</p>
            </div>
          </div>
        </div>
        
        <ul class="nav-menu">
          <li>
            <a routerLink="/parent/enfants" routerLinkActive="active">
              <span class="icon">👨‍👩‍👧‍👦</span>
              <span class="nav-text">Mes Enfants</span>
            </a>
          </li>
          <li>
            <a routerLink="/parent/bulletins" routerLinkActive="active">
              <span class="icon">📋</span>
              <span class="nav-text">Bulletins</span>
            </a>
          </li>
          <li>
            <a routerLink="/parent/communications" routerLinkActive="active">
              <span class="icon">💬</span>
              <span class="nav-text">Communications</span>
            </a>
          </li>
          <li>
            <a routerLink="/parent/absences" routerLinkActive="active">
              <span class="icon">📊</span>
              <span class="nav-text">Absences</span>
            </a>
          </li>
        </ul>
        
        <div class="sidebar-footer">
          <button (click)="logout()" class="logout-button">
            <span class="icon">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>
      
      <main class="main-content">
        <div class="content-header">
          <div class="welcome-section">
            <h1>Bonjour {{ currentUser?.prenom }} ! 👋</h1>
            <p>Bienvenue dans votre espace parent</p>
          </div>
          <div class="quick-stats">
            <div class="stat-item">
              <span class="stat-number">3</span>
              <span class="stat-label">Enfants</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">12</span>
              <span class="stat-label">Bulletins</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">5</span>
              <span class="stat-label">Messages</span>
            </div>
          </div>
        </div>
        
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .parent-layout {
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }
    
    .sidebar {
      width: 300px;
      background: linear-gradient(180deg, #9b59b6 0%, #8e44ad 100%);
      color: white;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
      position: fixed;
      height: 100vh;
      z-index: 1000;
    }
    
    .sidebar-header {
      padding: 30px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .user-info {
      text-align: center;
    }
    
    .avatar {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 auto 15px;
      border: 3px solid rgba(255, 255, 255, 0.3);
    }
    
    .user-details h2 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .user-name {
      margin: 0 0 5px 0;
      font-size: 1.1rem;
      opacity: 0.9;
    }
    
    .user-role {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.7;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 15px;
      display: inline-block;
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
      padding: 18px 20px;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 4px solid transparent;
      margin: 5px 10px;
      border-radius: 8px;
    }
    
    .nav-menu a:hover {
      background: rgba(255, 255, 255, 0.1);
      border-left-color: #f39c12;
      transform: translateX(5px);
    }
    
    .nav-menu a.active {
      background: rgba(243, 156, 18, 0.2);
      border-left-color: #f39c12;
      box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
    }
    
    .nav-menu .icon {
      margin-right: 15px;
      font-size: 1.3rem;
      width: 25px;
      text-align: center;
    }
    
    .nav-text {
      font-weight: 500;
      font-size: 1rem;
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
      padding: 15px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 1rem;
    }
    
    .logout-button:hover {
      background: rgba(231, 76, 60, 1);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
    }
    
    .logout-button .icon {
      margin-right: 10px;
      font-size: 1.2rem;
    }
    
    .main-content {
      flex: 1;
      margin-left: 300px;
      background: #f8f9fa;
      min-height: 100vh;
    }
    
    .content-header {
      background: white;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      border-radius: 0 0 15px 15px;
    }
    
    .welcome-section {
      margin-bottom: 25px;
    }
    
    .welcome-section h1 {
      color: #2c3e50;
      margin: 0 0 8px 0;
      font-size: 2.2rem;
      font-weight: 700;
    }
    
    .welcome-section p {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.1rem;
    }
    
    .quick-stats {
      display: flex;
      gap: 30px;
    }
    
    .stat-item {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
      border-radius: 12px;
      color: white;
      min-width: 120px;
      box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
      transition: transform 0.3s ease;
    }
    
    .stat-item:hover {
      transform: translateY(-5px);
    }
    
    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        position: relative;
        height: auto;
      }
      
      .main-content {
        margin-left: 0;
      }
      
      .quick-stats {
        flex-direction: column;
        gap: 15px;
      }
      
      .stat-item {
        min-width: auto;
      }
      
      .welcome-section h1 {
        font-size: 1.8rem;
      }
    }
  `]
})
export class ParentDashboardComponent {
  currentUser: any;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  getInitials(): string {
    if (this.currentUser?.prenom && this.currentUser?.nom) {
      return (this.currentUser.prenom.charAt(0) + this.currentUser.nom.charAt(0)).toUpperCase();
    }
    return 'PA';
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
} 