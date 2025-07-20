import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unauthorized-container">
      <div class="error-card">
        <div class="error-icon">🚫</div>
        <h1>Accès Refusé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <button (click)="goToLogin()" class="back-btn">
          Retour à la connexion
        </button>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .error-card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
    }
    
    .error-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #e74c3c;
      margin: 0 0 15px 0;
      font-size: 24px;
      font-weight: 600;
    }
    
    p {
      color: #7f8c8d;
      margin: 0 0 30px 0;
      line-height: 1.5;
    }
    
    .back-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: transform 0.2s ease;
    }
    
    .back-btn:hover {
      transform: translateY(-2px);
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
} 