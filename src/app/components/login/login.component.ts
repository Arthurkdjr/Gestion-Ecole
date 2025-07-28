import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../models/utilisateur';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <div class="logo-icon">🎓</div>
            <h1>Système de Gestion Académique</h1>
          </div>
          <p class="subtitle">Connectez-vous à votre espace personnel</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Adresse email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              class="form-control"
              placeholder="votre.email@ecole.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              class="form-control"
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <div *ngIf="errorMessage" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>

          <button type="submit" class="login-btn" [disabled]="loading">
            <span *ngIf="loading" class="loading-spinner"></span>
            <span *ngIf="!loading" class="btn-icon">🚀</span>
            {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>

        <div class="login-footer">
          <p class="footer-text">
            <span class="footer-icon">💡</span>
            Accédez à toutes les fonctionnalités de gestion
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 450px;
      position: relative;
      overflow: hidden;
    }

    .login-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .logo-icon {
      font-size: 3rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .login-header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
    }

    .subtitle {
      color: #7f8c8d;
      font-size: 1rem;
      margin: 0;
    }

    .login-form {
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control::placeholder {
      color: #bdc3c7;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #f5c6cb;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .error-icon {
      font-size: 1.2rem;
    }

    .login-btn {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .login-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    .login-btn:hover::before {
      left: 100%;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .btn-icon {
      font-size: 1.2rem;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .login-footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .footer-text {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .footer-icon {
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 30px 20px;
        margin: 10px;
      }

      .login-header h1 {
        font-size: 1.5rem;
      }

      .logo-icon {
        font-size: 2.5rem;
      }
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: LoginResponse) => {
        console.log('Réponse API login:', response);
        const user = response.utilisateur;
        this.redirectUser(user.role_id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        this.loading = false;

        if (error.status === 422) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 401) {
          this.errorMessage = 'Identifiants invalides';
        } else {
          this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
        }
      }
    });
  }

  private redirectUser(roleId: number): void {
    console.log('=== DÉBUT REDIRECTION ===');
    console.log('Redirection pour role_id:', roleId);
    console.log('URL actuelle:', window.location.href);
    
    let targetUrl = '';
    
    switch (roleId) {
      case 1: // Admin
        targetUrl = '/admin/dashboard';
        console.log('Redirection vers admin/dashboard');
        break;
      case 2: // Enseignant
        targetUrl = '/enseignant/dashboard';
        console.log('Redirection vers enseignant/dashboard');
        break;
      case 3: // Élève
        targetUrl = '/parent/dashboard';
        console.log('Redirection vers parent/dashboard (test)');
        break;
      case 4: // Parent
        targetUrl = '/parent/dashboard';
        console.log('Redirection vers parent/dashboard');
        break;
      default:
        targetUrl = '/';
        console.log('Redirection vers page d\'accueil');
        break;
    }
    
    console.log('URL cible:', targetUrl);
    console.log('Tentative de navigation Angular...');
    
    this.router.navigate([targetUrl]).then(() => {
      console.log('Navigation Angular réussie vers:', targetUrl);
    }).catch(error => {
      console.error('Erreur navigation Angular:', error);
      console.log('Tentative avec window.location.href...');
      window.location.href = targetUrl;
    });
    
    console.log('=== FIN REDIRECTION ===');
  }
} 