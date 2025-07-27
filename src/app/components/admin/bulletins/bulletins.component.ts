import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BulletinService } from '../../../services/bulletin.service';
import { ClasseService } from '../../../services/classe.service';
import { EleveService } from '../../../services/eleve.service';

@Component({
  selector: 'app-bulletins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bulletins-container">
      <!-- Header -->
      <div class="header">
        <h1>Gestion des Bulletins</h1>
        <p class="subtitle">Gérez les bulletins de notes pour toutes les classes</p>
      </div>

      <!-- Statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ stats.totalBulletins }}</h3>
            <p>Bulletins générés</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ stats.totalEleves }}</h3>
            <p>Élèves évalués</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>{{ stats.moyenneGenerale | number:'1.1-1' }}</h3>
            <p>Moyenne générale</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <h3>{{ stats.meilleurEleve }}</h3>
            <p>Meilleur élève</p>
          </div>
        </div>
      </div>

      <!-- Filtres et actions -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="filter-group">
            <label for="classeFilter">Classe</label>
            <select id="classeFilter" [(ngModel)]="selectedClasseId" (change)="onClasseChange()" class="filter-select">
              <option value="">Toutes les classes</option>
              <option *ngFor="let classe of classes" [value]="classe.id">
                {{ classe.nom }} - {{ classe.niveau }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="periodeFilter">Période</label>
            <select id="periodeFilter" [(ngModel)]="selectedPeriode" (change)="onPeriodeChange()" class="filter-select">
              <option value="">Toutes les périodes</option>
              <option value="trimestre1">1er Trimestre</option>
              <option value="trimestre2">2ème Trimestre</option>
              <option value="trimestre3">3ème Trimestre</option>
              <option value="annuel">Annuel</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="searchFilter">Rechercher</label>
            <input 
              type="text" 
              id="searchFilter"
              [(ngModel)]="searchTerm" 
              (ngModelChange)="onSearchChange()" 
              placeholder="Nom de l'élève..." 
              class="filter-input">
          </div>
        </div>

        <div class="actions-row">
          <button (click)="genererBulletins()" class="btn-primary" [disabled]="!selectedClasseId">
            <span class="btn-icon">📊</span>
            Générer les bulletins
          </button>
          <button (click)="exporterBulletins()" class="btn-secondary" [disabled]="filteredBulletins.length === 0">
            <span class="btn-icon">📄</span>
            Exporter
          </button>
          <button (click)="imprimerBulletins()" class="btn-outline" [disabled]="filteredBulletins.length === 0">
            <span class="btn-icon">🖨️</span>
            Imprimer
          </button>
        </div>
      </div>

      <!-- Liste des bulletins -->
      <div class="bulletins-section">
        <div *ngIf="filteredBulletins.length > 0; else noBulletins" class="bulletins-grid">
          <div *ngFor="let bulletin of filteredBulletins" class="bulletin-card">
            <div class="bulletin-header">
              <div class="eleve-info">
                <h3>{{ bulletin.eleve?.nom }} {{ bulletin.eleve?.prenom }}</h3>
                <p class="eleve-details">
                  <span class="detail-item">Classe: {{ bulletin.eleve?.classe?.nom || 'Non assignée' }}</span>
                  <span class="detail-item">Période: {{ bulletin.periode || 'Non spécifiée' }}</span>
                </p>
              </div>
              <div class="bulletin-stats">
                <div class="moyenne-display" 
                     [class.excellent]="bulletin.moyenne >= 16"
                     [class.bon]="bulletin.moyenne >= 14 && bulletin.moyenne < 16"
                     [class.moyen]="bulletin.moyenne >= 10 && bulletin.moyenne < 14"
                     [class.insuffisant]="bulletin.moyenne < 10">
                  <span class="moyenne-value">{{ bulletin.moyenne | number:'1.2-2' }}</span>
                  <span class="moyenne-label">/20</span>
                </div>
                <div class="rang-display">
                  <span class="rang-label">Rang</span>
                  <span class="rang-value">{{ bulletin.rang || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="bulletin-details">
              <div class="detail-row">
                <div class="detail-item">
                  <span class="detail-label">Matières évaluées:</span>
                  <span class="detail-value">{{ bulletin.nombre_matieres || 0 }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date de création:</span>
                  <span class="detail-value">{{ bulletin.created_at | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
              
              <div class="notes-summary" *ngIf="bulletin.notes && bulletin.notes.length > 0">
                <h4>Notes par matière</h4>
                <div class="notes-grid">
                  <div *ngFor="let note of bulletin.notes.slice(0, 3)" class="note-item">
                    <span class="matiere-name">{{ note.matiere?.nom || 'Matière' }}</span>
                    <span class="note-value" 
                          [class.excellent]="note.note >= 16"
                          [class.bon]="note.note >= 14 && note.note < 16"
                          [class.moyen]="note.note >= 10 && note.note < 14"
                          [class.insuffisant]="note.note < 10">
                      {{ note.note }}/20
                    </span>
                  </div>
                  <div *ngIf="bulletin.notes.length > 3" class="more-notes">
                    +{{ bulletin.notes.length - 3 }} autres matières
                  </div>
                </div>
              </div>
            </div>

            <div class="bulletin-actions">
              <button (click)="voirDetailBulletin(bulletin.id)" class="btn-secondary">
                <span class="btn-icon">👁️</span>
                Voir détail
              </button>
              <button (click)="modifierBulletin(bulletin.id)" class="btn-primary">
                <span class="btn-icon">✏️</span>
                Modifier
              </button>
              <button (click)="telechargerBulletin(bulletin.id)" class="btn-outline">
                <span class="btn-icon">📥</span>
                Télécharger
              </button>
            </div>
          </div>
        </div>

        <ng-template #noBulletins>
          <div class="no-data">
            <div class="no-data-icon">📊</div>
            <h3>Aucun bulletin trouvé</h3>
            <p *ngIf="selectedClasseId">
              Aucun bulletin n'a été généré pour cette classe. 
              <button (click)="genererBulletins()" class="btn-primary">Générer les bulletins</button>
            </p>
            <p *ngIf="!selectedClasseId">
              Sélectionnez une classe pour voir les bulletins ou générer de nouveaux bulletins.
            </p>
          </div>
        </ng-template>
      </div>

      <!-- Modal de génération -->
      <div class="modal-overlay" *ngIf="showGenerationModal" (click)="closeGenerationModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Générer les bulletins</h2>
            <button (click)="closeGenerationModal()" class="close-btn">×</button>
          </div>
          
          <div class="modal-body">
            <div class="generation-info">
              <p>Vous êtes sur le point de générer les bulletins pour la classe <strong>{{ getClasseName() }}</strong>.</p>
              <p>Cette action va créer des bulletins pour tous les élèves de cette classe.</p>
            </div>

            <div class="form-group">
              <label for="periodeGeneration">Période</label>
              <select id="periodeGeneration" [(ngModel)]="periodeGeneration" class="form-control">
                <option value="trimestre1">1er Trimestre</option>
                <option value="trimestre2">2ème Trimestre</option>
                <option value="trimestre3">3ème Trimestre</option>
                <option value="annuel">Annuel</option>
              </select>
            </div>

            <div class="eleves-preview" *ngIf="elevesClasse.length > 0">
              <h4>Élèves concernés ({{ elevesClasse.length }})</h4>
              <div class="eleves-list">
                <div *ngFor="let eleve of elevesClasse.slice(0, 5)" class="eleve-item">
                  {{ eleve.nom }} {{ eleve.prenom }}
                </div>
                <div *ngIf="elevesClasse.length > 5" class="more-eleves">
                  +{{ elevesClasse.length - 5 }} autres élèves
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button (click)="closeGenerationModal()" class="btn-secondary">
              Annuler
            </button>
            <button (click)="confirmerGeneration()" class="btn-primary" [disabled]="generating">
              <span *ngIf="generating" class="loading-spinner"></span>
              <span *ngIf="!generating">{{ generating ? 'Génération...' : 'Générer' }}</span>
            </button>
          </div>
        </div>
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 25px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content h3 {
      font-size: 2rem;
      margin: 0;
      color: #667eea;
      font-weight: bold;
    }

    .stat-content p {
      margin: 5px 0 0 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .filters-section {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 30px;
    }

    .filters-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-group label {
      font-weight: 500;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .filter-select, .filter-input {
      padding: 10px 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }

    .filter-select:focus, .filter-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .actions-row {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary, .btn-outline {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #27ae60;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #229954;
      transform: translateY(-2px);
    }

    .btn-outline {
      background: transparent;
      color: #667eea;
      border: 1px solid #667eea;
    }

    .btn-outline:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    .btn-icon {
      font-size: 1rem;
    }

    .bulletins-section {
      margin-top: 30px;
    }

    .bulletins-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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

    .eleve-info h3 {
      color: #2c3e50;
      margin: 0 0 8px 0;
      font-size: 1.3rem;
    }

    .eleve-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 0;
    }

    .detail-item {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .bulletin-stats {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .moyenne-display {
      display: flex;
      align-items: baseline;
      gap: 2px;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
    }

    .moyenne-display.excellent {
      background: #d4edda;
      color: #155724;
    }

    .moyenne-display.bon {
      background: #fff3cd;
      color: #856404;
    }

    .moyenne-display.moyen {
      background: #f8d7da;
      color: #721c24;
    }

    .moyenne-display.insuffisant {
      background: #f8d7da;
      color: #721c24;
    }

    .moyenne-value {
      font-size: 1.5rem;
    }

    .moyenne-label {
      font-size: 0.9rem;
    }

    .rang-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .rang-label {
      font-size: 0.8rem;
      color: #7f8c8d;
    }

    .rang-value {
      font-size: 1.1rem;
      font-weight: bold;
      color: #2c3e50;
    }

    .bulletin-details {
      margin-bottom: 20px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      color: #7f8c8d;
      font-size: 0.8rem;
    }

    .detail-value {
      color: #2c3e50;
      font-weight: 500;
    }

    .notes-summary {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e1e5e9;
    }

    .notes-summary h4 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 1rem;
    }

    .notes-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .note-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
    }

    .matiere-name {
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .note-value {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .note-value.excellent { color: #27ae60; }
    .note-value.bon { color: #f39c12; }
    .note-value.moyen { color: #e67e22; }
    .note-value.insuffisant { color: #e74c3c; }

    .more-notes {
      color: #7f8c8d;
      font-size: 0.8rem;
      font-style: italic;
      text-align: center;
      padding: 5px 0;
    }

    .bulletin-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
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
      margin: 0 auto 20px auto;
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25px 30px;
      border-bottom: 1px solid #e1e5e9;
    }

    .modal-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #7f8c8d;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #e74c3c;
    }

    .modal-body {
      padding: 30px;
    }

    .generation-info {
      margin-bottom: 25px;
    }

    .generation-info p {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .eleves-preview {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .eleves-preview h4 {
      color: #2c3e50;
      margin: 0 0 15px 0;
      font-size: 1.1rem;
    }

    .eleves-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .eleve-item {
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .more-eleves {
      color: #7f8c8d;
      font-size: 0.8rem;
      font-style: italic;
      text-align: center;
      padding: 5px 0;
    }

    .modal-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      padding: 25px 30px;
      border-top: 1px solid #e1e5e9;
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .filters-row {
        grid-template-columns: 1fr;
      }
      
      .actions-row {
        flex-direction: column;
      }
      
      .bulletins-grid {
        grid-template-columns: 1fr;
      }
      
      .bulletin-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .bulletin-stats {
        align-self: stretch;
        flex-direction: row;
        justify-content: space-between;
      }
      
      .modal-content {
        margin: 10px;
        max-height: 95vh;
      }
    }
  `]
})
export class BulletinsComponent implements OnInit {
  bulletins: any[] = [];
  filteredBulletins: any[] = [];
  classes: any[] = [];
  elevesClasse: any[] = [];
  searchTerm = '';
  selectedClasseId = '';
  selectedPeriode = '';
  periodeGeneration = 'trimestre1';
  showGenerationModal = false;
  generating = false;
  
  stats = {
    totalBulletins: 0,
    totalEleves: 0,
    moyenneGenerale: 0,
    meilleurEleve: 'N/A'
  };

  constructor(
    private bulletinService: BulletinService,
    private classeService: ClasseService,
    private eleveService: EleveService
  ) {}

  ngOnInit(): void {
    this.loadBulletins();
    this.loadClasses();
    this.loadStats();
  }

  loadBulletins(): void {
    this.bulletinService.getBulletins().subscribe({
      next: (bulletins) => {
        this.bulletins = bulletins;
        this.filterBulletins();
        this.updateStats();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des bulletins:', err);
        this.bulletins = [];
        this.filteredBulletins = [];
      }
    });
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (classes) => this.classes = classes,
      error: (err) => {
        console.error('Erreur lors du chargement des classes:', err);
        this.classes = [];
      }
    });
  }

  loadStats(): void {
    this.bulletinService.getStatsBulletins().subscribe({
      next: (stats) => this.stats = stats,
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques:', err);
        // Utiliser les stats calculées localement
        this.updateStats();
      }
    });
  }

  updateStats(): void {
    this.stats.totalBulletins = this.bulletins.length;
    this.stats.totalEleves = new Set(this.bulletins.map(b => b.eleve?.id)).size;
    
    if (this.bulletins.length > 0) {
      const totalMoyenne = this.bulletins.reduce((sum, b) => sum + (b.moyenne || 0), 0);
      this.stats.moyenneGenerale = totalMoyenne / this.bulletins.length;
      
      const meilleurBulletin = this.bulletins.reduce((best, current) => 
        (current.moyenne || 0) > (best.moyenne || 0) ? current : best
      );
      this.stats.meilleurEleve = `${meilleurBulletin.eleve?.nom} ${meilleurBulletin.eleve?.prenom}`;
    }
  }

  filterBulletins(): void {
    let filtered = this.bulletins;

    // Filtre par classe
    if (this.selectedClasseId) {
      filtered = filtered.filter(b => b.eleve?.classe?.id == this.selectedClasseId);
    }

    // Filtre par période
    if (this.selectedPeriode) {
      filtered = filtered.filter(b => b.periode === this.selectedPeriode);
    }

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(b => 
        b.eleve?.nom?.toLowerCase().includes(term) ||
        b.eleve?.prenom?.toLowerCase().includes(term)
      );
    }

    this.filteredBulletins = filtered;
  }

  onClasseChange(): void {
    this.filterBulletins();
    if (this.selectedClasseId) {
      this.loadElevesClasse();
    }
  }

  onPeriodeChange(): void {
    this.filterBulletins();
  }

  onSearchChange(): void {
    this.filterBulletins();
  }

  loadElevesClasse(): void {
    if (!this.selectedClasseId) return;
    
    this.eleveService.getElevesByClasse(parseInt(this.selectedClasseId)).subscribe({
      next: (eleves) => this.elevesClasse = eleves,
      error: (err) => {
        console.error('Erreur lors du chargement des élèves:', err);
        this.elevesClasse = [];
      }
    });
  }

  getClasseName(): string {
    const classe = this.classes.find(c => c.id == this.selectedClasseId);
    return classe ? `${classe.nom} - ${classe.niveau}` : '';
  }

  genererBulletins(): void {
    if (!this.selectedClasseId) {
      alert('Veuillez sélectionner une classe');
      return;
    }
    this.showGenerationModal = true;
  }

  closeGenerationModal(): void {
    this.showGenerationModal = false;
    this.generating = false;
  }

  confirmerGeneration(): void {
    if (!this.selectedClasseId) return;

    this.generating = true;
    this.bulletinService.genererBulletins(parseInt(this.selectedClasseId)).subscribe({
      next: () => {
        this.loadBulletins();
        this.closeGenerationModal();
        this.generating = false;
      },
      error: (err) => {
        console.error('Erreur lors de la génération:', err);
        alert('Erreur lors de la génération des bulletins');
        this.generating = false;
      }
    });
  }

  exporterBulletins(): void {
    if (!this.selectedClasseId) {
      alert('Veuillez sélectionner une classe');
      return;
    }

    this.bulletinService.exporterBulletins(parseInt(this.selectedClasseId)).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulletins_${this.getClasseName()}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Erreur lors de l\'export:', err);
        alert('Erreur lors de l\'export des bulletins');
      }
    });
  }

  imprimerBulletins(): void {
    // Logique d'impression
    window.print();
  }

  voirDetailBulletin(bulletinId: number): void {
    // Navigation vers le détail du bulletin
    console.log('Voir détail bulletin:', bulletinId);
  }

  modifierBulletin(bulletinId: number): void {
    // Navigation vers la modification du bulletin
    console.log('Modifier bulletin:', bulletinId);
  }

  telechargerBulletin(bulletinId: number): void {
    // Téléchargement d'un bulletin individuel
    console.log('Télécharger bulletin:', bulletinId);
  }
} 