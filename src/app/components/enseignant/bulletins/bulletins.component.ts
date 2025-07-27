import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClasseService } from '../../../services/classe.service';
import { BulletinService } from '../../../services/bulletin.service';

@Component({
  selector: 'app-enseignant-bulletins',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bulletins-container">
      <div class="header">
        <h1>Bulletins de notes</h1>
        <p class="subtitle">Consultez et gérez les bulletins de vos classes</p>
      </div>

      <!-- Statistiques -->
      <div class="stats-summary">
        <div class="stat-item">
          <span class="stat-icon">📊</span>
          <div class="stat-content">
            <span class="stat-number">{{ stats.totalBulletins }}</span>
            <span class="stat-label">Bulletins générés</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">👥</span>
          <div class="stat-content">
            <span class="stat-number">{{ stats.totalEleves }}</span>
            <span class="stat-label">Élèves évalués</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📈</span>
          <div class="stat-content">
            <span class="stat-number">{{ stats.moyenneGenerale | number:'1.1-1' }}</span>
            <span class="stat-label">Moyenne générale</span>
          </div>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📅</span>
          <div class="stat-content">
            <span class="stat-number">{{ stats.derniereMiseAJour }}</span>
            <span class="stat-label">Dernière mise à jour</span>
          </div>
        </div>
      </div>

      <!-- Sélection de classe -->
      <div class="classe-selection">
        <h2>Sélectionner une classe</h2>
        <div class="classes-grid">
          <div *ngFor="let classe of classes" 
               class="classe-card" 
               [class.selected]="selectedClasseId === classe.id"
               (click)="selectClasse(classe.id)">
            <div class="classe-header">
              <h3>{{ classe.nom }}</h3>
              <span class="niveau-badge">{{ classe.niveau }}</span>
            </div>
            <div class="classe-stats">
              <p><strong>{{ classe.nombre_eleves || 0 }}</strong> élèves</p>
              <p><strong>{{ classe.nombre_matieres || 0 }}</strong> matières</p>
            </div>
            <div class="classe-actions">
              <button (click)="voirBulletinsClasse(classe.id)" class="btn-primary">
                <span class="btn-icon">📊</span>
                Voir les bulletins
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulletins de la classe sélectionnée -->
      <div class="bulletins-section" *ngIf="selectedClasseId && bulletins.length > 0">
        <div class="section-header">
          <h2>Bulletins - {{ getClasseName() }}</h2>
          <div class="header-actions">
            <button (click)="exporterBulletins()" class="btn-secondary">
              <span class="btn-icon">📄</span>
              Exporter
            </button>
            <button (click)="imprimerBulletins()" class="btn-outline">
              <span class="btn-icon">🖨️</span>
              Imprimer
            </button>
          </div>
        </div>

        <div class="bulletins-grid">
          <div *ngFor="let bulletin of bulletins" class="bulletin-card">
            <div class="bulletin-header">
              <div class="eleve-info">
                <h4>{{ bulletin.eleve?.nom }} {{ bulletin.eleve?.prenom }}</h4>
                <p class="eleve-details">{{ bulletin.eleve?.email }}</p>
              </div>
              <div class="bulletin-meta">
                <span class="moyenne-badge" 
                      [class.excellent]="bulletin.moyenne >= 16"
                      [class.bon]="bulletin.moyenne >= 14 && bulletin.moyenne < 16"
                      [class.moyen]="bulletin.moyenne >= 10 && bulletin.moyenne < 14"
                      [class.insuffisant]="bulletin.moyenne < 10">
                  {{ bulletin.moyenne | number:'1.2-2' }}/20
                </span>
                <span class="date-badge">{{ bulletin.date_creation | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>

            <div class="notes-summary">
              <div class="summary-item">
                <span class="summary-label">Matières:</span>
                <span class="summary-value">{{ bulletin.notes?.length || 0 }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Moyenne:</span>
                <span class="summary-value">{{ bulletin.moyenne | number:'1.2-2' }}/20</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Rang:</span>
                <span class="summary-value">{{ bulletin.rang || 'N/A' }}</span>
              </div>
            </div>

            <div class="bulletin-actions">
              <button (click)="voirDetailBulletin(bulletin.id)" class="btn-primary">
                <span class="btn-icon">👁️</span>
                Voir détail
              </button>
              <button (click)="modifierNotes(bulletin.eleve?.id)" class="btn-secondary">
                <span class="btn-icon">✏️</span>
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucun bulletin -->
      <div class="no-data" *ngIf="selectedClasseId && bulletins.length === 0">
        <div class="no-data-icon">📊</div>
        <h3>Aucun bulletin disponible</h3>
        <p>Il n'y a pas encore de bulletins générés pour cette classe.</p>
        <button (click)="genererBulletins()" class="btn-primary">
          <span class="btn-icon">📊</span>
          Générer les bulletins
        </button>
      </div>

      <!-- Aucune classe -->
      <div class="no-data" *ngIf="classes.length === 0">
        <div class="no-data-icon">📚</div>
        <h3>Aucune classe assignée</h3>
        <p>Vous n'avez pas encore de classes assignées pour consulter les bulletins.</p>
      </div>
    </div>
  `,
  styles: [`
    .bulletins-container {
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
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-item {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 25px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.2s;
    }

    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }

    .stat-label {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .classe-selection {
      margin-bottom: 40px;
    }

    .classe-selection h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .classes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .classe-card {
      background: white;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      padding: 25px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .classe-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .classe-card.selected {
      border-color: #667eea;
      background: #f8f9ff;
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

    .classe-stats {
      margin-bottom: 20px;
    }

    .classe-stats p {
      margin: 5px 0;
      color: #7f8c8d;
    }

    .classe-stats strong {
      color: #2c3e50;
    }

    .classe-actions {
      display: flex;
      gap: 10px;
    }

    .bulletins-section {
      margin-top: 40px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .section-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 1.8rem;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .bulletins-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
    }

    .bulletin-card {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 25px;
      transition: all 0.2s;
    }

    .bulletin-card:hover {
      border-color: #667eea;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      transform: translateY(-3px);
    }

    .bulletin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .eleve-info h4 {
      color: #2c3e50;
      margin: 0 0 5px 0;
      font-size: 1.2rem;
    }

    .eleve-details {
      color: #7f8c8d;
      margin: 0;
      font-size: 0.9rem;
    }

    .bulletin-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
    }

    .moyenne-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .moyenne-badge.excellent {
      background: #d4edda;
      color: #155724;
    }

    .moyenne-badge.bon {
      background: #fff3cd;
      color: #856404;
    }

    .moyenne-badge.moyen {
      background: #f8d7da;
      color: #721c24;
    }

    .moyenne-badge.insuffisant {
      background: #f8d7da;
      color: #721c24;
    }

    .date-badge {
      background: #e9ecef;
      color: #6c757d;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .notes-summary {
      margin-bottom: 20px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .summary-label {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .summary-value {
      color: #2c3e50;
      font-weight: 500;
    }

    .bulletin-actions {
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
      margin-top: 40px;
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
      margin: 0 auto 20px auto;
    }

    @media (max-width: 768px) {
      .stats-summary {
        grid-template-columns: 1fr;
      }
      
      .classes-grid {
        grid-template-columns: 1fr;
      }
      
      .bulletins-grid {
        grid-template-columns: 1fr;
      }
      
      .section-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .bulletin-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .bulletin-meta {
        align-items: flex-start;
      }
    }
  `]
})
export class BulletinsComponent implements OnInit {
  classes: any[] = [];
  selectedClasseId: number | null = null;
  bulletins: any[] = [];
  stats = {
    totalBulletins: 0,
    totalEleves: 0,
    moyenneGenerale: 0,
    derniereMiseAJour: 'Aujourd\'hui'
  };

  constructor(
    private classeService: ClasseService,
    private bulletinService: BulletinService,
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
        this.stats.totalEleves = classes.reduce((total, classe) => total + (classe.nombre_eleves || 0), 0);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des classes:', err);
        this.classes = [];
      }
    });
  }

  loadStats(): void {
    // Simulation des statistiques
    // Plus tard, on pourra ajouter des endpoints dédiés
    this.stats.totalBulletins = Math.floor(Math.random() * 50) + 10;
    this.stats.moyenneGenerale = Math.random() * 10 + 10; // Entre 10 et 20
  }

  selectClasse(classeId: number): void {
    this.selectedClasseId = classeId;
    this.loadBulletins(classeId);
  }

  loadBulletins(classeId: number): void {
    // Simulation du chargement des bulletins
    // Plus tard, on utilisera un vrai endpoint
    this.bulletins = [
      {
        id: 1,
        eleve: { nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com' },
        moyenne: 15.5,
        rang: 3,
        date_creation: new Date(),
        notes: []
      },
      {
        id: 2,
        eleve: { nom: 'Martin', prenom: 'Marie', email: 'marie.martin@email.com' },
        moyenne: 17.2,
        rang: 1,
        date_creation: new Date(),
        notes: []
      }
    ];
  }

  getClasseName(): string {
    const classe = this.classes.find(c => c.id === this.selectedClasseId);
    return classe ? classe.nom : '';
  }

  voirBulletinsClasse(classeId: number): void {
    this.selectClasse(classeId);
  }

  voirDetailBulletin(bulletinId: number): void {
    // Navigation vers le détail du bulletin
    console.log('Voir détail bulletin:', bulletinId);
  }

  modifierNotes(eleveId: number): void {
    this.router.navigate([`/enseignant/eleves/${eleveId}/notes`]);
  }

  exporterBulletins(): void {
    console.log('Exporter les bulletins');
    // Logique d'export
  }

  imprimerBulletins(): void {
    console.log('Imprimer les bulletins');
    // Logique d'impression
  }

  genererBulletins(): void {
    console.log('Générer les bulletins');
    // Logique de génération
  }
} 