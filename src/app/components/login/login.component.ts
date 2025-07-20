import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Gestion École</h1>
          <p>Connexion à votre espace</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="credentials.email" 
              required 
              class="form-control"
              placeholder="Entrez votre email">
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="credentials.motDePasse" 
              required 
              class="form-control"
              placeholder="Entrez votre mot de passe">
          </div>
          
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            [disabled]="loading || !loginForm.valid" 
            class="login-button">
            <span *ngIf="loading">Connexion...</span>
            <span *ngIf="!loading">Se connecter</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .login-header h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 28px;
    }
    
    .login-header p {
      color: #666;
      margin: 0;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group label {
      font-weight: 500;
      color: #333;
    }
    
    .form-control {
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .login-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error-message {
      background: #fee;
      color: #c33;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #fcc;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  credentials = {
    email: '',
    motDePasse: ''
  };
  
  loading = false;
  errorMessage = '';
  returnUrl = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login(this.credentials.email, this.credentials.motDePasse)
      .subscribe({
        next: (user) => {
          this.loading = false;
          this.redirectUser(user.role_id); // Utilise role_id pour la redirection
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Email ou mot de passe incorrect';
          console.error('Erreur de connexion:', error);
        }
      });
  }

  private redirectUser(role_id: number): void {
    switch (role_id) {
      case 1: // administrateur
        this.router.navigate(['/admin']);
        break;
      case 2: // enseignant
        this.router.navigate(['/enseignant']);
        break;
      case 3: // élève
        this.router.navigate(['/eleve']);
        break;
      case 4: // parent
        this.router.navigate(['/parent']);
        break;
      default:
        this.router.navigate(['/unauthorized']);
    }
  }
} 