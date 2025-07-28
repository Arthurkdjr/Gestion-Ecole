import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-eleve-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notes-container">
      <div class="header">
        <h1>📝 Mes Notes</h1>
        <p class="subtitle">Détail de vos évaluations par matière</p>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Matière :</label>
          <select [(ngModel)]="selectedMatiere" (change)="filterNotes()">
            <option value="">Toutes les matières</option>
            <option *ngFor="let matiere of matieres" [value]="matiere.nom">{{ matiere.nom }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Période :</label>
          <select [(ngModel)]="selectedPeriode" (change)="filterNotes()">
            <option value="">Toutes les périodes</option>
            <option value="trimestre1">1er Trimestre</option>
            <option value="trimestre2">2ème Trimestre</option>
            <option value="trimestre3">3ème Trimestre</option>
          </select>
        </div>
      </div>

      <div class="notes-summary">
        <div class="summary-card">
          <div class="summary-icon">📊</div>
          <div class="summary-content">
            <h3>Moyenne Générale</h3>
            <p class="summary-value">{{ moyenneGenerale }}/20</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">📈</div>
          <div class="summary-content">
            <h3>Évolution</h3>
            <p class="summary-value" [class]="getEvolutionClass()">{{ evolution }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">🎯</div>
          <div class="summary-content">
            <h3>Objectif</h3>
            <p class="summary-value">{{ objectif }}/20</p>
          </div>
        </div>
      </div>

      <div class="notes-list">
        <div *ngFor="let matiere of filteredMatieres" class="matiere-section">
          <div class="matiere-header">
            <h2>{{ matiere.nom }}</h2>
            <div class="matiere-stats">
              <span class="moyenne-matiere">Moyenne: {{ matiere.moyenne }}/20</span>
              <span class="coefficient">Coef: {{ matiere.coefficient }}</span>
            </div>
          </div>
          
          <div class="notes-grid">
            <div *ngFor="let note of matiere.notes" class="note-card" [class]="getNoteCardClass(note.valeur)">
              <div class="note-header">
                <span class="note-type">{{ note.type }}</span>
                <span class="note-date">{{ note.date }}</span>
              </div>
              
              <div class="note-value">
                <span class="note-score">{{ note.valeur }}/20</span>
                <div class="note-bar">
                  <div class="note-progress" [style.width.%]="(note.valeur / 20) * 100"></div>
                </div>
              </div>
              
              <div class="note-footer">
                <span class="note-appreciation" [class]="getAppreciationClass(note.valeur)">
                  {{ getAppreciation(note.valeur) }}
                </span>
                <span class="note-comment" *ngIf="note.commentaire">{{ note.commentaire }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" (click)="exporterNotes()">
          📥 Exporter mes notes
        </button>
        <button class="btn-secondary" (click)="imprimerNotes()">
          🖨️ Imprimer
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notes-container {
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

    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .filter-group label {
      color: #2c3e50;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .filter-group select {
      padding: 8px 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background: white;
      color: #2c3e50;
      font-size: 0.9rem;
      cursor: pointer;
      transition: border-color 0.3s ease;
    }

    .filter-group select:focus {
      outline: none;
      border-color: #3498db;
    }

    .notes-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .summary-icon {
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

    .summary-content h3 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 1rem;
      font-weight: 600;
    }

    .summary-value {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      color: #3498db;
    }

    .summary-value.positive {
      color: #27ae60;
    }

    .summary-value.negative {
      color: #e74c3c;
    }

    .notes-list {
      margin-bottom: 40px;
    }

    .matiere-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .matiere-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #ecf0f1;
    }

    .matiere-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .matiere-stats {
      display: flex;
      gap: 15px;
    }

    .moyenne-matiere {
      background: #3498db;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .coefficient {
      background: #95a5a6;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .note-card {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      border-left: 4px solid #3498db;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .note-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    .note-card.excellent {
      border-left-color: #27ae60;
      background: #d5f4e6;
    }

    .note-card.bon {
      border-left-color: #3498db;
      background: #d6eaf8;
    }

    .note-card.moyen {
      border-left-color: #f39c12;
      background: #fdeaa7;
    }

    .note-card.insuffisant {
      border-left-color: #e74c3c;
      background: #fadbd8;
    }

    .note-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .note-type {
      font-weight: 600;
      color: #2c3e50;
      font-size: 1rem;
    }

    .note-date {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .note-value {
      margin-bottom: 15px;
    }

    .note-score {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .note-bar {
      width: 100%;
      height: 8px;
      background: #ecf0f1;
      border-radius: 4px;
      overflow: hidden;
    }

    .note-progress {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2980b9);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .note-card.excellent .note-progress {
      background: linear-gradient(90deg, #27ae60, #229954);
    }

    .note-card.bon .note-progress {
      background: linear-gradient(90deg, #3498db, #2980b9);
    }

    .note-card.moyen .note-progress {
      background: linear-gradient(90deg, #f39c12, #e67e22);
    }

    .note-card.insuffisant .note-progress {
      background: linear-gradient(90deg, #e74c3c, #c0392b);
    }

    .note-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .note-appreciation {
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .note-appreciation.excellent {
      background: #27ae60;
      color: white;
    }

    .note-appreciation.bon {
      background: #3498db;
      color: white;
    }

    .note-appreciation.moyen {
      background: #f39c12;
      color: white;
    }

    .note-appreciation.insuffisant {
      background: #e74c3c;
      color: white;
    }

    .note-comment {
      color: #7f8c8d;
      font-size: 0.8rem;
      font-style: italic;
    }

    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
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
      .notes-container {
        padding: 20px;
      }

      .filters {
        flex-direction: column;
        align-items: center;
      }

      .notes-summary {
        grid-template-columns: 1fr;
      }

      .notes-grid {
        grid-template-columns: 1fr;
      }

      .matiere-header {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
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
export class NotesComponent implements OnInit {
  currentUser: any;
  selectedMatiere: string = '';
  selectedPeriode: string = '';
  moyenneGenerale: number = 0;
  evolution: string = '+0.5';
  objectif: number = 16;
  matieres: any[] = [];
  filteredMatieres: any[] = [];

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadNotesData();
  }

  loadNotesData(): void {
    // Données simulées pour les notes
    this.matieres = [
      {
        nom: 'Mathématiques',
        coefficient: 4,
        moyenne: 16.5,
        notes: [
          { type: 'Devoir 1', valeur: 17, date: '15/09/2024', commentaire: 'Très bon travail' },
          { type: 'Devoir 2', valeur: 16, date: '28/09/2024', commentaire: 'Attention aux calculs' },
          { type: 'Examen', valeur: 16.5, date: '12/10/2024', commentaire: 'Excellent' }
        ]
      },
      {
        nom: 'Français',
        coefficient: 3,
        moyenne: 14.2,
        notes: [
          { type: 'Rédaction', valeur: 15, date: '10/09/2024', commentaire: 'Bonne expression' },
          { type: 'Grammaire', valeur: 13, date: '22/09/2024', commentaire: 'À améliorer' },
          { type: 'Examen', valeur: 14.5, date: '08/10/2024', commentaire: 'Satisfaisant' }
        ]
      },
      {
        nom: 'Histoire-Géographie',
        coefficient: 2,
        moyenne: 15.8,
        notes: [
          { type: 'Contrôle Histoire', valeur: 16, date: '18/09/2024', commentaire: 'Très bien' },
          { type: 'Contrôle Géographie', valeur: 15.5, date: '05/10/2024', commentaire: 'Bon travail' }
        ]
      },
      {
        nom: 'Sciences',
        coefficient: 3,
        moyenne: 17.1,
        notes: [
          { type: 'TP Physique', valeur: 18, date: '12/09/2024', commentaire: 'Excellent' },
          { type: 'Contrôle SVT', valeur: 16.5, date: '25/09/2024', commentaire: 'Très bien' },
          { type: 'Examen', valeur: 16.8, date: '10/10/2024', commentaire: 'Excellent travail' }
        ]
      },
      {
        nom: 'Anglais',
        coefficient: 2,
        moyenne: 13.5,
        notes: [
          { type: 'Oral', valeur: 14, date: '20/09/2024', commentaire: 'Bon accent' },
          { type: 'Écrit', valeur: 13, date: '03/10/2024', commentaire: 'À travailler' }
        ]
      },
      {
        nom: 'Sport',
        coefficient: 1,
        moyenne: 18.0,
        notes: [
          { type: 'Athlétisme', valeur: 18, date: '14/09/2024', commentaire: 'Excellent' },
          { type: 'Collectif', valeur: 18, date: '30/09/2024', commentaire: 'Très bon esprit d\'équipe' }
        ]
      }
    ];

    this.filteredMatieres = [...this.matieres];
    this.calculateMoyenneGenerale();
  }

  filterNotes(): void {
    this.filteredMatieres = this.matieres.filter(matiere => {
      const matiereMatch = !this.selectedMatiere || matiere.nom === this.selectedMatiere;
      // Ici on pourrait ajouter la logique pour filtrer par période
      return matiereMatch;
    });
  }

  calculateMoyenneGenerale(): void {
    const totalPoints = this.matieres.reduce((sum, matiere) => 
      sum + (matiere.moyenne * matiere.coefficient), 0);
    const totalCoeffs = this.matieres.reduce((sum, matiere) => 
      sum + matiere.coefficient, 0);
    
    this.moyenneGenerale = Math.round((totalPoints / totalCoeffs) * 10) / 10;
  }

  getNoteCardClass(note: number): string {
    if (note >= 16) return 'excellent';
    if (note >= 14) return 'bon';
    if (note >= 10) return 'moyen';
    return 'insuffisant';
  }

  getAppreciation(note: number): string {
    if (note >= 16) return 'Excellent';
    if (note >= 14) return 'Bon';
    if (note >= 10) return 'Moyen';
    return 'Insuffisant';
  }

  getAppreciationClass(note: number): string {
    if (note >= 16) return 'excellent';
    if (note >= 14) return 'bon';
    if (note >= 10) return 'moyen';
    return 'insuffisant';
  }

  getEvolutionClass(): string {
    return this.evolution.startsWith('+') ? 'positive' : 'negative';
  }

  exporterNotes(): void {
    alert('Fonctionnalité d\'export en cours de développement...');
  }

  imprimerNotes(): void {
    window.print();
  }
} 