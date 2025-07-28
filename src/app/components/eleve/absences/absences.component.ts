import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-eleve-absences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="absences-container">
      <div class="header">
        <h1>📊 Mes Absences</h1>
        <p class="subtitle">Suivi de votre assiduité</p>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3>Total Absences</h3>
            <p class="stat-value">{{ totalAbsences }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <div class="stat-content">
            <h3>Heures Manquées</h3>
            <p class="stat-value">{{ totalHeuresManquees }}h</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>Taux de Présence</h3>
            <p class="stat-value">{{ tauxPresence }}%</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <h3>Objectif</h3>
            <p class="stat-value">95%</p>
          </div>
        </div>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Matière :</label>
          <select [(ngModel)]="selectedMatiere" (change)="filterAbsences()">
            <option value="">Toutes les matières</option>
            <option *ngFor="let matiere of matieres" [value]="matiere">{{ matiere }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Période :</label>
          <select [(ngModel)]="selectedPeriode" (change)="filterAbsences()">
            <option value="">Toutes les périodes</option>
            <option value="trimestre1">1er Trimestre</option>
            <option value="trimestre2">2ème Trimestre</option>
            <option value="trimestre3">3ème Trimestre</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Type :</label>
          <select [(ngModel)]="selectedType" (change)="filterAbsences()">
            <option value="">Tous les types</option>
            <option value="justifiee">Justifiée</option>
            <option value="non-justifiee">Non justifiée</option>
          </select>
        </div>
      </div>

      <div class="absences-list">
        <div class="list-header">
          <h2>📋 Détail des absences</h2>
          <div class="list-actions">
            <button class="btn-secondary" (click)="justifierAbsence()">
              📝 Justifier une absence
            </button>
          </div>
        </div>
        
        <div class="absences-table">
          <div class="table-header">
            <div class="header-cell">Date</div>
            <div class="header-cell">Matière</div>
            <div class="header-cell">Heures</div>
            <div class="header-cell">Type</div>
            <div class="header-cell">Motif</div>
            <div class="header-cell">Actions</div>
          </div>
          
          <div 
            *ngFor="let absence of filteredAbsences" 
            class="table-row"
            [class.justifiee]="absence.justifiee"
            [class.non-justifiee]="!absence.justifiee"
          >
            <div class="table-cell date-cell">
              <div class="date">{{ absence.date | date:'dd/MM/yyyy' }}</div>
              <div class="day">{{ absence.date | date:'EEEE' }}</div>
            </div>
            
            <div class="table-cell matiere-cell">
              <div class="matiere-name">{{ absence.matiere }}</div>
              <div class="enseignant">{{ absence.enseignant }}</div>
            </div>
            
            <div class="table-cell heures-cell">
              <div class="heures">{{ absence.heures }}h</div>
              <div class="creneaux">{{ absence.creneaux }}</div>
            </div>
            
            <div class="table-cell type-cell">
              <span class="badge" [class]="absence.justifiee ? 'justifiee' : 'non-justifiee'">
                {{ absence.justifiee ? 'Justifiée' : 'Non justifiée' }}
              </span>
            </div>
            
            <div class="table-cell motif-cell">
              <div class="motif">{{ absence.motif }}</div>
              <div class="commentaire" *ngIf="absence.commentaire">{{ absence.commentaire }}</div>
            </div>
            
            <div class="table-cell actions-cell">
              <button 
                class="btn-action" 
                [class]="absence.justifiee ? 'btn-edit' : 'btn-justify'"
                (click)="actionAbsence(absence)"
              >
                {{ absence.justifiee ? '✏️' : '📝' }}
              </button>
            </div>
          </div>
        </div>
        
        <div *ngIf="filteredAbsences.length === 0" class="no-data">
          <div class="no-data-icon">📋</div>
          <h3>Aucune absence trouvée</h3>
          <p>Parfait ! Vous n'avez aucune absence pour cette période.</p>
        </div>
      </div>

      <div class="chart-section">
        <div class="chart-header">
          <h2>📊 Évolution des absences</h2>
        </div>
        
        <div class="chart-container">
          <div class="chart-bars">
            <div *ngFor="let month of absencesParMois" class="chart-bar">
              <div class="bar-label">{{ month.mois }}</div>
              <div class="bar-container">
                <div class="bar" [style.height.%]="(month.absences / maxAbsences) * 100">
                  <span class="bar-value">{{ month.absences }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" (click)="exporterAbsences()">
          📥 Exporter le rapport
        </button>
        <button class="btn-secondary" (click)="imprimerAbsences()">
          🖨️ Imprimer
        </button>
      </div>
    </div>
  `,
  styles: [`
    .absences-container {
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

    .stats-overview {
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

    .absences-list {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 40px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #ecf0f1;
    }

    .list-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .absences-table {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #ecf0f1;
    }

    .table-header {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr 1fr 2fr 0.5fr;
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }

    .header-cell {
      padding: 15px;
      border-right: 1px solid #ecf0f1;
      font-size: 0.9rem;
    }

    .header-cell:last-child {
      border-right: none;
    }

    .table-row {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr 1fr 2fr 0.5fr;
      border-bottom: 1px solid #ecf0f1;
      transition: background 0.3s ease;
    }

    .table-row:hover {
      background: #f8f9fa;
    }

    .table-row.justifiee {
      background: #d5f4e6;
    }

    .table-row.non-justifiee {
      background: #fadbd8;
    }

    .table-cell {
      padding: 15px;
      border-right: 1px solid #ecf0f1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .table-cell:last-child {
      border-right: none;
    }

    .date-cell .date {
      font-weight: 600;
      color: #2c3e50;
    }

    .date-cell .day {
      font-size: 0.8rem;
      color: #7f8c8d;
    }

    .matiere-cell .matiere-name {
      font-weight: 600;
      color: #2c3e50;
    }

    .matiere-cell .enseignant {
      font-size: 0.8rem;
      color: #7f8c8d;
    }

    .heures-cell .heures {
      font-weight: 600;
      color: #2c3e50;
    }

    .heures-cell .creneaux {
      font-size: 0.8rem;
      color: #7f8c8d;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge.justifiee {
      background: #d5f4e6;
      color: #27ae60;
    }

    .badge.non-justifiee {
      background: #fadbd8;
      color: #e74c3c;
    }

    .motif-cell .motif {
      font-weight: 500;
      color: #2c3e50;
    }

    .motif-cell .commentaire {
      font-size: 0.8rem;
      color: #7f8c8d;
      font-style: italic;
    }

    .btn-action {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: background 0.3s ease;
    }

    .btn-action:hover {
      background: rgba(52, 152, 219, 0.1);
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #7f8c8d;
    }

    .no-data-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .no-data h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
    }

    .no-data p {
      margin: 0;
      font-size: 1.1rem;
    }

    .chart-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 40px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .chart-header {
      margin-bottom: 25px;
    }

    .chart-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .chart-container {
      height: 200px;
    }

    .chart-bars {
      display: flex;
      align-items: end;
      justify-content: space-around;
      height: 100%;
      gap: 20px;
    }

    .chart-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    .bar-label {
      margin-bottom: 10px;
      font-size: 0.9rem;
      color: #7f8c8d;
      font-weight: 500;
    }

    .bar-container {
      width: 100%;
      height: 120px;
      display: flex;
      align-items: end;
    }

    .bar {
      width: 100%;
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      border-radius: 4px 4px 0 0;
      position: relative;
      transition: height 0.3s ease;
    }

    .bar-value {
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.8rem;
      font-weight: 600;
      color: #2c3e50;
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
      .absences-container {
        padding: 20px;
      }

      .stats-overview {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
        align-items: center;
      }

      .table-header, .table-row {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .header-cell, .table-cell {
        border-right: none;
        border-bottom: 1px solid #ecf0f1;
      }

      .list-header {
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
export class AbsencesComponent implements OnInit {
  currentUser: any;
  selectedMatiere: string = '';
  selectedPeriode: string = '';
  selectedType: string = '';
  totalAbsences: number = 0;
  totalHeuresManquees: number = 0;
  tauxPresence: number = 0;
  matieres: string[] = [];
  absences: any[] = [];
  filteredAbsences: any[] = [];
  absencesParMois: any[] = [];
  maxAbsences: number = 0;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadAbsencesData();
  }

  loadAbsencesData(): void {
    // Données simulées pour les absences
    this.absences = [
      {
        date: new Date('2024-09-15'),
        matiere: 'Mathématiques',
        enseignant: 'M. Dupont',
        heures: 2,
        creneaux: '8h-10h',
        justifiee: true,
        motif: 'Maladie',
        commentaire: 'Certificat médical fourni'
      },
      {
        date: new Date('2024-09-20'),
        matiere: 'Français',
        enseignant: 'Mme Martin',
        heures: 1,
        creneaux: '14h-15h',
        justifiee: false,
        motif: 'Retard',
        commentaire: 'Retard de 15 minutes'
      },
      {
        date: new Date('2024-09-25'),
        matiere: 'Sciences',
        enseignant: 'Mme Bernard',
        heures: 3,
        creneaux: '10h-13h',
        justifiee: true,
        motif: 'Rendez-vous médical',
        commentaire: 'Justificatif fourni'
      },
      {
        date: new Date('2024-10-02'),
        matiere: 'Histoire',
        enseignant: 'M. Durand',
        heures: 1,
        creneaux: '15h-16h',
        justifiee: false,
        motif: 'Absence non justifiée',
        commentaire: ''
      },
      {
        date: new Date('2024-10-08'),
        matiere: 'Anglais',
        enseignant: 'M. Wilson',
        heures: 2,
        creneaux: '13h-15h',
        justifiee: true,
        motif: 'Rendez-vous administratif',
        commentaire: 'Justificatif fourni'
      }
    ];

    this.filteredAbsences = [...this.absences];
    this.matieres = [...new Set(this.absences.map(a => a.matiere))];
    
    this.calculateStats();
    this.generateChartData();
  }

  filterAbsences(): void {
    this.filteredAbsences = this.absences.filter(absence => {
      const matiereMatch = !this.selectedMatiere || absence.matiere === this.selectedMatiere;
      const typeMatch = !this.selectedType || 
        (this.selectedType === 'justifiee' && absence.justifiee) ||
        (this.selectedType === 'non-justifiee' && !absence.justifiee);
      
      return matiereMatch && typeMatch;
    });
  }

  calculateStats(): void {
    this.totalAbsences = this.absences.length;
    this.totalHeuresManquees = this.absences.reduce((sum, absence) => sum + absence.heures, 0);
    
    // Calcul du taux de présence (simulation)
    const totalHeuresPossibles = 200; // Heures totales possibles
    this.tauxPresence = Math.round(((totalHeuresPossibles - this.totalHeuresManquees) / totalHeuresPossibles) * 100);
  }

  generateChartData(): void {
    const mois = ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'];
    this.absencesParMois = mois.map(mois => ({
      mois: mois,
      absences: Math.floor(Math.random() * 5) + 1
    }));
    
    this.maxAbsences = Math.max(...this.absencesParMois.map(m => m.absences));
  }

  actionAbsence(absence: any): void {
    if (absence.justifiee) {
      alert(`Modifier la justification pour ${absence.matiere} du ${absence.date.toLocaleDateString()}`);
    } else {
      alert(`Justifier l'absence pour ${absence.matiere} du ${absence.date.toLocaleDateString()}`);
    }
  }

  justifierAbsence(): void {
    alert('Fonctionnalité de justification en cours de développement...');
  }

  exporterAbsences(): void {
    alert('Fonctionnalité d\'export en cours de développement...');
  }

  imprimerAbsences(): void {
    window.print();
  }
} 