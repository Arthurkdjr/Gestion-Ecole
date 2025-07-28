import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-eleve-bulletins',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bulletins-container">
      <div class="header">
        <h1>📋 Mes Bulletins</h1>
        <p class="subtitle">Consultez vos résultats scolaires</p>
      </div>

      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Moyenne Générale</h3>
            <p class="stat-value">{{ moyenneGenerale }}/20</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>Rang</h3>
            <p class="stat-value">{{ rang }}/{{ totalEleves }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <h3>Matières</h3>
            <p class="stat-value">{{ matieres.length }}</p>
          </div>
        </div>
      </div>

      <div class="bulletins-list">
        <div class="section-header">
          <h2>📚 Détail par matière</h2>
        </div>
        
        <div class="matieres-grid">
          <div *ngFor="let matiere of matieres" class="matiere-card">
            <div class="matiere-header">
              <h3>{{ matiere.nom }}</h3>
              <span class="coefficient">Coef: {{ matiere.coefficient }}</span>
            </div>
            
            <div class="notes-section">
              <div class="note-item" *ngFor="let note of matiere.notes">
                <span class="note-label">{{ note.type }}</span>
                <span class="note-value" [class]="getNoteClass(note.valeur)">{{ note.valeur }}/20</span>
              </div>
            </div>
            
            <div class="matiere-footer">
              <div class="moyenne-matiere">
                <strong>Moyenne: {{ matiere.moyenne }}/20</strong>
              </div>
              <div class="appreciation" [class]="getAppreciationClass(matiere.moyenne)">
                {{ getAppreciation(matiere.moyenne) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" (click)="telechargerBulletin()">
          📥 Télécharger le bulletin
        </button>
        <button class="btn-secondary" (click)="imprimerBulletin()">
          🖨️ Imprimer
        </button>
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
      margin-bottom: 40px;
    }

    .header h1 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 2.5rem;
      font-weight: 700;
    }

    .subtitle {
      color: #7f8c8d;
      font-size: 1.1rem;
      margin: 0;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .stat-content h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 1rem;
      font-weight: 600;
    }

    .stat-value {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      color: #3498db;
    }

    .section-header {
      margin-bottom: 30px;
    }

    .section-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .matieres-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    .matiere-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .matiere-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .matiere-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #ecf0f1;
    }

    .matiere-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .coefficient {
      background: #3498db;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .notes-section {
      margin-bottom: 20px;
    }

    .note-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #ecf0f1;
    }

    .note-item:last-child {
      border-bottom: none;
    }

    .note-label {
      color: #7f8c8d;
      font-weight: 500;
    }

    .note-value {
      font-weight: 600;
      font-size: 1.1rem;
    }

    .note-value.excellent {
      color: #27ae60;
    }

    .note-value.bon {
      color: #3498db;
    }

    .note-value.moyen {
      color: #f39c12;
    }

    .note-value.insuffisant {
      color: #e74c3c;
    }

    .matiere-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      border-top: 2px solid #ecf0f1;
    }

    .moyenne-matiere {
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .appreciation {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .appreciation.excellent {
      background: #d5f4e6;
      color: #27ae60;
    }

    .appreciation.bon {
      background: #d6eaf8;
      color: #3498db;
    }

    .appreciation.moyen {
      background: #fdeaa7;
      color: #f39c12;
    }

    .appreciation.insuffisant {
      background: #fadbd8;
      color: #e74c3c;
    }

    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 40px;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #ecf0f1;
      color: #2c3e50;
    }

    .btn-secondary:hover {
      background: #d5dbdb;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .bulletins-container {
        padding: 20px;
      }

      .stats-cards {
        grid-template-columns: 1fr;
      }

      .matieres-grid {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }

      .header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class BulletinsComponent implements OnInit {
  currentUser: any;
  moyenneGenerale: number = 0;
  rang: number = 0;
  totalEleves: number = 0;
  matieres: any[] = [];

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadBulletinData();
  }

  loadBulletinData(): void {
    // Données simulées pour le bulletin
    this.matieres = [
      {
        nom: 'Mathématiques',
        coefficient: 4,
        moyenne: 16.5,
        notes: [
          { type: 'Devoir 1', valeur: 17 },
          { type: 'Devoir 2', valeur: 16 },
          { type: 'Examen', valeur: 16.5 }
        ]
      },
      {
        nom: 'Français',
        coefficient: 3,
        moyenne: 14.2,
        notes: [
          { type: 'Rédaction', valeur: 15 },
          { type: 'Grammaire', valeur: 13 },
          { type: 'Examen', valeur: 14.5 }
        ]
      },
      {
        nom: 'Histoire-Géographie',
        coefficient: 2,
        moyenne: 15.8,
        notes: [
          { type: 'Contrôle Histoire', valeur: 16 },
          { type: 'Contrôle Géographie', valeur: 15.5 }
        ]
      },
      {
        nom: 'Sciences',
        coefficient: 3,
        moyenne: 17.1,
        notes: [
          { type: 'TP Physique', valeur: 18 },
          { type: 'Contrôle SVT', valeur: 16.5 },
          { type: 'Examen', valeur: 16.8 }
        ]
      },
      {
        nom: 'Anglais',
        coefficient: 2,
        moyenne: 13.5,
        notes: [
          { type: 'Oral', valeur: 14 },
          { type: 'Écrit', valeur: 13 }
        ]
      },
      {
        nom: 'Sport',
        coefficient: 1,
        moyenne: 18.0,
        notes: [
          { type: 'Athlétisme', valeur: 18 },
          { type: 'Collectif', valeur: 18 }
        ]
      }
    ];

    // Calculer la moyenne générale
    const totalPoints = this.matieres.reduce((sum, matiere) => 
      sum + (matiere.moyenne * matiere.coefficient), 0);
    const totalCoeffs = this.matieres.reduce((sum, matiere) => 
      sum + matiere.coefficient, 0);
    
    this.moyenneGenerale = Math.round((totalPoints / totalCoeffs) * 10) / 10;
    this.rang = 5;
    this.totalEleves = 28;
  }

  getNoteClass(note: number): string {
    if (note >= 16) return 'excellent';
    if (note >= 14) return 'bon';
    if (note >= 10) return 'moyen';
    return 'insuffisant';
  }

  getAppreciation(moyenne: number): string {
    if (moyenne >= 16) return 'Excellent';
    if (moyenne >= 14) return 'Bon';
    if (moyenne >= 10) return 'Moyen';
    return 'Insuffisant';
  }

  getAppreciationClass(moyenne: number): string {
    if (moyenne >= 16) return 'excellent';
    if (moyenne >= 14) return 'bon';
    if (moyenne >= 10) return 'moyen';
    return 'insuffisant';
  }

  telechargerBulletin(): void {
    alert('Fonctionnalité de téléchargement en cours de développement...');
  }

  imprimerBulletin(): void {
    window.print();
  }
} 