import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClasseService } from '../../../services/classe.service';

@Component({
  selector: 'app-enseignant-classes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="classes-container">
      <div class="header">
        <h1>Mes Classes</h1>
        <p class="subtitle">Gérez vos classes et accédez aux élèves</p>
      </div>

      <!-- Statistiques -->
      <div class="stats-summary">
        <div class="stat-item">
          <span class="stat-number">{{ classes.length }}</span>
          <span class="stat-label">Classes assignées</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ totalEleves }}</span>
          <span class="stat-label">Élèves total</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ totalMatieres }}</span>
          <span class="stat-label">Matières enseignées</span>
        </div>
      </div>

      <!-- Liste des classes -->
      <div class="classes-section">
        <div *ngIf="classes.length > 0; else noClasses" class="classes-grid">
          <div *ngFor="let classe of classes" class="classe-card">
            <div class="classe-header">
              <div class="classe-info">
                <h3>{{ classe.nom }}</h3>
                <span class="niveau-badge">{{ classe.niveau }}</span>
              </div>
              <div class="classe-actions">
                <button (click)="voirEleves(classe.id)" class="btn-primary">
                  <span class="btn-icon">👥</span>
                  Voir les élèves
                </button>
              </div>
            </div>
            
            <div class="classe-details">
              <div class="detail-item">
                <span class="detail-label">Élèves:</span>
                <span class="detail-value">{{ classe.nombre_eleves || 0 }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Matières:</span>
                <span class="detail-value">{{ classe.nombre_matieres || 0 }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Année:</span>
                <span class="detail-value">{{ classe.annee_scolaire || '2024-2025' }}</span>
              </div>
            </div>

            <div class="classe-progress">
              <div class="progress-item">
                <span class="progress-label">Notes saisies</span>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="getProgressPercentage(classe)"></div>
                </div>
                <span class="progress-text">{{ getProgressText(classe) }}</span>
              </div>
            </div>

            <div class="classe-footer">
              <button (click)="saisirNotesClasse(classe.id)" class="btn-secondary">
                <span class="btn-icon">📝</span>
                Saisir notes
              </button>
              <button (click)="voirBulletinClasse(classe.id)" class="btn-outline">
                <span class="btn-icon">📊</span>
                Bulletins
              </button>
            </div>
          </div>
        </div>
        
        <ng-template #noClasses>
          <div class="no-data">
            <div class="no-data-icon">📚</div>
            <h3>Aucune classe assignée</h3>
            <p>Vous n'avez pas encore de classes assignées. Contactez l'administrateur pour obtenir des classes.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .classes-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }

    .subtitle {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .stats-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-item {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      transition: transform 0.2s;
    }

    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }

    .stat-label {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .classes-section {
      margin-top: 30px;
    }

    .classes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
    }

    .classe-card {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 25px;
      transition: all 0.2s;
    }

    .classe-card:hover {
      border-color: #667eea;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      transform: translateY(-3px);
    }

    .classe-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .classe-info h3 {
      color: #2c3e50;
      margin: 0 0 8px 0;
      font-size: 1.3rem;
    }

    .niveau-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .classe-details {
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .detail-label {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .detail-value {
      color: #2c3e50;
      font-weight: 500;
    }

    .classe-progress {
      margin-bottom: 20px;
    }

    .progress-item {
      margin-bottom: 10px;
    }

    .progress-label {
      display: block;
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-bottom: 5px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #f1f3f4;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 5px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.8rem;
      color: #7f8c8d;
    }

    .classe-footer {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary, .btn-outline {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #27ae60;
      color: white;
    }

    .btn-secondary:hover {
      background: #229954;
      transform: translateY(-1px);
    }

    .btn-outline {
      background: transparent;
      color: #667eea;
      border: 1px solid #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .btn-icon {
      font-size: 1rem;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .no-data-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .no-data h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .no-data p {
      color: #7f8c8d;
      max-width: 400px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .classes-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-summary {
        grid-template-columns: 1fr;
      }
      
      .classe-header {
        flex-direction: column;
        gap: 15px;
      }
      
      .classe-footer {
        flex-direction: column;
      }
    }
  `]
})
export class ClassesComponent implements OnInit {
  classes: any[] = [];
  totalEleves = 0;
  totalMatieres = 0;

  constructor(private classeService: ClasseService, private router: Router) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classeService.getMesClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.calculateStats();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des classes:', err);
        this.classes = [];
      }
    });
  }

  calculateStats(): void {
    this.totalEleves = this.classes.reduce((total, classe) => total + (classe.nombre_eleves || 0), 0);
    this.totalMatieres = this.classes.reduce((total, classe) => total + (classe.nombre_matieres || 0), 0);
  }

  getProgressPercentage(classe: any): number {
    // Simulation du pourcentage de notes saisies
    // Plus tard, on pourra calculer avec les vraies données
    return Math.floor(Math.random() * 100);
  }

  getProgressText(classe: any): string {
    const percentage = this.getProgressPercentage(classe);
    if (percentage === 0) return 'Aucune note saisie';
    if (percentage < 50) return `${percentage}% des notes saisies`;
    if (percentage < 100) return `${percentage}% des notes saisies`;
    return 'Toutes les notes saisies';
  }

  voirEleves(classeId: number): void {
    this.router.navigate([`/enseignant/classes/${classeId}/eleves`]);
  }

  saisirNotesClasse(classeId: number): void {
    this.router.navigate([`/enseignant/classes/${classeId}/eleves`]);
  }

  voirBulletinClasse(classeId: number): void {
    this.router.navigate([`/enseignant/classes/${classeId}/bulletins`]);
  }
} 