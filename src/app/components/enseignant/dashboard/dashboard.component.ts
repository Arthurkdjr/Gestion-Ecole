import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClasseService } from '../../../services/classe.service';
import { NoteService } from '../../../services/note.service';

@Component({
  selector: 'app-enseignant-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Tableau de Bord Enseignant</h1>
        <p class="welcome-text">Bienvenue dans votre espace de travail</p>
      </div>

      <!-- Statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ stats.totalClasses }}</h3>
            <p>Classes assignées</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ stats.totalEleves }}</h3>
            <p>Élèves total</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <h3>{{ stats.notesSaisies }}</h3>
            <p>Notes saisies</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ stats.moyenneGenerale | number:'1.1-1' }}</h3>
            <p>Moyenne générale</p>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="quick-actions">
        <h2>Actions rapides</h2>
        <div class="actions-grid">
          <button (click)="voirMesClasses()" class="action-btn">
            <span class="action-icon">📚</span>
            <span>Mes Classes</span>
          </button>
          <button (click)="saisirNotes()" class="action-btn">
            <span class="action-icon">📝</span>
            <span>Saisir des notes</span>
          </button>
          <button (click)="voirBulletins()" class="action-btn">
            <span class="action-icon">📊</span>
            <span>Consulter les bulletins</span>
          </button>
        </div>
      </div>

      <!-- Classes récentes -->
      <div class="recent-classes">
        <h2>Mes Classes</h2>
        <div *ngIf="classes.length > 0; else noClasses" class="classes-grid">
          <div *ngFor="let classe of classes.slice(0, 4)" class="classe-card" (click)="voirEleves(classe.id)">
            <div class="classe-header">
              <h3>{{ classe.nom }}</h3>
              <span class="niveau-badge">{{ classe.niveau }}</span>
            </div>
            <div class="classe-stats">
              <p><strong>{{ classe.nombre_eleves || 0 }}</strong> élèves</p>
              <p><strong>{{ classe.nombre_matieres || 0 }}</strong> matières</p>
            </div>
            <div class="classe-actions">
              <button class="btn-secondary">Voir les élèves</button>
            </div>
          </div>
        </div>
        <ng-template #noClasses>
          <div class="no-data">
            <p>Aucune classe assignée pour le moment.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }
    
    .welcome-text {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content h3 {
      font-size: 2rem;
      margin: 0;
      font-weight: bold;
    }

    .stat-content p {
      margin: 5px 0 0 0;
      opacity: 0.9;
    }

    .quick-actions {
      margin-bottom: 40px;
    }

    .quick-actions h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .action-btn {
      background: white;
      border: 2px solid #e1e5e9;
      padding: 20px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .action-btn:hover {
      border-color: #667eea;
      background: #f8f9ff;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2rem;
    }

    .recent-classes h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .classes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .classe-card {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 10px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .classe-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .classe-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .classe-header h3 {
      color: #2c3e50;
      margin: 0;
      font-size: 1.2rem;
    }

    .niveau-badge {
      background: #667eea;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .classe-stats {
      margin-bottom: 15px;
    }

    .classe-stats p {
      margin: 5px 0;
      color: #7f8c8d;
    }

    .classe-stats strong {
      color: #2c3e50;
    }

    .btn-secondary {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.2s;
    }

    .btn-secondary:hover {
      background: #5a6fd8;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
      background: #f8f9fa;
      border-radius: 10px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
      
      .classes-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  classes: any[] = [];
  stats = {
    totalClasses: 0,
    totalEleves: 0,
    notesSaisies: 0,
    moyenneGenerale: 0
  };

  constructor(
    private classeService: ClasseService,
    private noteService: NoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadStats();
  }

  loadClasses(): void {
    this.classeService.getMesClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.stats.totalClasses = classes.length;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des classes:', err);
        this.classes = [];
      }
    });
  }

  loadStats(): void {
    // Pour l'instant, on calcule les stats basées sur les classes
    // Plus tard, on pourra ajouter des endpoints spécifiques pour les stats
    this.stats.totalEleves = this.classes.reduce((total, classe) => total + (classe.nombre_eleves || 0), 0);
    this.stats.notesSaisies = 0; // À implémenter avec un endpoint dédié
    this.stats.moyenneGenerale = 0; // À implémenter avec un endpoint dédié
  }

  voirMesClasses(): void {
    this.router.navigate(['/enseignant/classes']);
  }

  saisirNotes(): void {
    this.router.navigate(['/enseignant/classes']);
  }

  voirBulletins(): void {
    this.router.navigate(['/enseignant/bulletins']);
  }

  voirEleves(classeId: number): void {
    this.router.navigate([`/enseignant/classes/${classeId}/eleves`]);
  }
} 