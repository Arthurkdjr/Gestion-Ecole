import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatiereService } from '../../../services/matiere.service';
import { ClasseService } from '../../../services/classe.service';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="matieres-container">
      <!-- Header -->
      <div class="header">
        <h1>Gestion des Matières</h1>
        <p class="subtitle">Gérez les matières et leurs associations avec les classes</p>
      </div>

      <!-- Statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ matieres.length }}</h3>
            <p>Total matières</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏫</div>
          <div class="stat-content">
            <h3>{{ classes.length }}</h3>
            <p>Classes disponibles</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ getMoyenneCoefficient() | number:'1.1-1' }}</h3>
            <p>Coef. moyen</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-bar">
        <div class="search-section">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearchChange()" 
            placeholder="Rechercher une matière..." 
            class="search-input">
        </div>
        <button (click)="openForm()" class="add-btn">
          <span class="btn-icon">➕</span>
          Ajouter une matière
        </button>
      </div>

      <!-- Liste des matières -->
      <div class="matieres-section">
        <div *ngIf="filteredMatieres.length > 0; else noMatieres" class="matieres-grid">
          <div *ngFor="let matiere of filteredMatieres" class="matiere-card">
            <div class="matiere-header">
              <div class="matiere-info">
                <h3>{{ matiere.nom }}</h3>
                <span class="matiere-code">{{ matiere.code }}</span>
              </div>
              <div class="matiere-badges">
                <span class="coefficient-badge">Coef: {{ matiere.coefficient }}</span>
                <span class="niveau-badge">{{ matiere.niveau }}</span>
              </div>
            </div>
            
            <div class="matiere-details">
              <div class="detail-item">
                <span class="detail-label">Classes associées:</span>
                <span class="detail-value">
                  <span *ngIf="matiere.classes && matiere.classes.length > 0; else noClasse">
                    {{ getClasseNoms(matiere) }}
                  </span>
                  <ng-template #noClasse><em>Aucune classe</em></ng-template>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Créée le:</span>
                <span class="detail-value">{{ matiere.created_at | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>

            <div class="matiere-actions">
              <button (click)="editMatiere(matiere)" class="btn-secondary">
                <span class="btn-icon">✏️</span>
                Modifier
              </button>
              <button (click)="deleteMatiere(matiere.id)" class="btn-danger">
                <span class="btn-icon">🗑️</span>
                Supprimer
              </button>
            </div>
          </div>
        </div>
        
        <ng-template #noMatieres>
          <div class="no-data">
            <div class="no-data-icon">📚</div>
            <h3>Aucune matière trouvée</h3>
            <p>{{ searchTerm ? 'Aucune matière ne correspond à votre recherche.' : 'Commencez par ajouter votre première matière.' }}</p>
          </div>
        </ng-template>
      </div>

      <!-- Modal de formulaire -->
      <div class="modal-overlay" *ngIf="showForm" (click)="closeForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingMatiere ? 'Modifier' : 'Ajouter' }} une matière</h2>
            <button (click)="closeForm()" class="close-btn">×</button>
          </div>
          
          <form (ngSubmit)="onSubmit()" #matiereForm="ngForm" class="matiere-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="nom">Nom de la matière *</label>
                <input 
                  type="text" 
                  id="nom" 
                  name="nom" 
                  [(ngModel)]="matiereFormData.nom" 
                  required 
                  class="form-control"
                  placeholder="Ex: Mathématiques">
              </div>
              
              <div class="form-group">
                <label for="code">Code *</label>
                <input 
                  type="text" 
                  id="code" 
                  name="code" 
                  [(ngModel)]="matiereFormData.code" 
                  required 
                  class="form-control"
                  placeholder="Ex: MATH101">
              </div>
              
              <div class="form-group">
                <label for="coefficient">Coefficient *</label>
                <input 
                  type="number" 
                  id="coefficient" 
                  name="coefficient" 
                  [(ngModel)]="matiereFormData.coefficient" 
                  required 
                  class="form-control"
                  min="1" 
                  max="10"
                  step="0.5"
                  placeholder="Ex: 2">
              </div>
              
              <div class="form-group">
                <label for="niveau">Niveau *</label>
                <select 
                  id="niveau" 
                  name="niveau" 
                  [(ngModel)]="matiereFormData.niveau" 
                  required 
                  class="form-control">
                  <option value="">Sélectionner un niveau</option>
                  <option value="L1">Licence 1 (L1)</option>
                  <option value="L2">Licence 2 (L2)</option>
                  <option value="L3">Licence 3 (L3)</option>
                  <option value="M1">Master 1 (M1)</option>
                  <option value="M2">Master 2 (M2)</option>
                  <option value="PhD">Doctorat (PhD)</option>
                </select>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label for="classes">Classes associées</label>
              <div class="classes-selector">
                <div *ngFor="let classe of classes" class="classe-option">
                  <input 
                    type="checkbox" 
                    [id]="'classe_' + classe.id"
                    [value]="classe.id"
                    [checked]="matiereFormData.classe_id.includes(classe.id)"
                    (change)="toggleClasse(classe.id)"
                    class="classe-checkbox">
                  <label [for]="'classe_' + classe.id" class="classe-label">
                    {{ classe.nom }} - {{ classe.niveau }}
                  </label>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" (click)="closeForm()" class="btn-secondary">
                Annuler
              </button>
              <button type="submit" [disabled]="!matiereForm.valid || loading" class="btn-primary">
                <span *ngIf="loading" class="loading-spinner"></span>
                <span *ngIf="!loading">{{ editingMatiere ? 'Modifier' : 'Ajouter' }}</span>
              </button>
            </div>
            
            <div *ngIf="errorMessage" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .matieres-container {
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

    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      gap: 20px;
      flex-wrap: wrap;
    }

    .search-section {
      flex: 1;
      max-width: 400px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .add-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .matieres-section {
      margin-top: 30px;
    }

    .matieres-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
    }

    .matiere-card {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 25px;
      transition: all 0.2s;
    }

    .matiere-card:hover {
      border-color: #667eea;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      transform: translateY(-3px);
    }

    .matiere-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .matiere-info h3 {
      color: #2c3e50;
      margin: 0 0 8px 0;
      font-size: 1.3rem;
    }

    .matiere-code {
      background: #667eea;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .matiere-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .coefficient-badge {
      background: #27ae60;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .niveau-badge {
      background: #f39c12;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .matiere-details {
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
      text-align: right;
    }

    .matiere-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-secondary, .btn-danger {
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

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
      transform: translateY(-1px);
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-danger:hover {
      background: #c0392b;
      transform: translateY(-1px);
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
      max-width: 600px;
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

    .matiere-form {
      padding: 30px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-weight: 500;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .form-control {
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

    .classes-selector {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      max-height: 200px;
      overflow-y: auto;
      padding: 15px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .classe-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .classe-checkbox {
      width: 18px;
      height: 18px;
    }

    .classe-label {
      font-size: 0.9rem;
      color: #2c3e50;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #f5c6cb;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 20px;
    }

    .error-icon {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-bar {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-section {
        max-width: none;
      }
      
      .matieres-grid {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        margin: 10px;
        max-height: 95vh;
      }
    }
  `]
})
export class MatieresComponent implements OnInit {
  matieres: any[] = [];
  filteredMatieres: any[] = [];
  classes: any[] = [];
  searchTerm = '';
  showForm = false;
  loading = false;
  errorMessage = '';
  editingMatiere: any = null;
  matiereFormData = {
    nom: '',
    code: '',
    coefficient: '',
    niveau: '',
    classe_id: [] as number[]
  };

  constructor(
    private matiereService: MatiereService,
    private classeService: ClasseService
  ) {}

  ngOnInit(): void {
    this.loadMatieres();
    this.loadClasses();
  }

  loadMatieres(): void {
    this.matiereService.getMatieres().subscribe({
      next: (matieres) => {
        this.matieres = matieres;
        this.filterMatieres();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des matières:', err);
        this.matieres = [];
        this.filteredMatieres = [];
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

  filterMatieres(): void {
    if (!this.searchTerm.trim()) {
      this.filteredMatieres = this.matieres;
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredMatieres = this.matieres.filter(matiere =>
        matiere.nom?.toLowerCase().includes(term) ||
        matiere.code?.toLowerCase().includes(term) ||
        matiere.niveau?.toLowerCase().includes(term)
      );
    }
  }

  onSearchChange(): void {
    this.filterMatieres();
  }

  getMoyenneCoefficient(): number {
    if (this.matieres.length === 0) return 0;
    const total = this.matieres.reduce((sum, m) => sum + (m.coefficient || 0), 0);
    return total / this.matieres.length;
  }

  openForm(): void {
    this.showForm = true;
    this.editingMatiere = null;
    this.resetFormData();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingMatiere = null;
    this.resetFormData();
  }

  resetFormData(): void {
    this.matiereFormData = {
      nom: '',
      code: '',
      coefficient: '',
      niveau: '',
      classe_id: []
    };
    this.errorMessage = '';
  }

  editMatiere(matiere: any): void {
    this.editingMatiere = matiere;
    this.matiereFormData = {
      nom: matiere.nom || '',
      code: matiere.code || '',
      coefficient: matiere.coefficient || '',
      niveau: matiere.niveau || '',
      classe_id: matiere.classes ? matiere.classes.map((c: any) => c.id) : []
    };
    this.showForm = true;
    this.errorMessage = '';
  }

  toggleClasse(classeId: number): void {
    const index = this.matiereFormData.classe_id.indexOf(classeId);
    if (index > -1) {
      this.matiereFormData.classe_id.splice(index, 1);
    } else {
      this.matiereFormData.classe_id.push(classeId);
    }
  }

  onSubmit(): void {
    if (this.loading) return;

    // Validation
    if (!this.matiereFormData.nom.trim() || !this.matiereFormData.code.trim()) {
      this.errorMessage = 'Le nom et le code sont obligatoires.';
      return;
    }

    // Validation anti-doublon
    const nom = this.matiereFormData.nom.trim().toLowerCase();
    const code = this.matiereFormData.code.trim().toLowerCase();
    
    const doublon = this.matieres.some(matiere => {
      const sameName = matiere.nom?.toLowerCase() === nom;
      const sameCode = matiere.code?.toLowerCase() === code;
      const isDifferent = !this.editingMatiere || matiere.id !== this.editingMatiere.id;
      return sameName && sameCode && isDifferent;
    });

    if (doublon) {
      this.errorMessage = 'Une matière avec ce nom et ce code existe déjà.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const matiereToSend = {
      nom: this.matiereFormData.nom.trim(),
      code: this.matiereFormData.code.trim(),
      coefficient: parseFloat(this.matiereFormData.coefficient),
      niveau: this.matiereFormData.niveau,
      classe_id: this.matiereFormData.classe_id
    };

    if (this.editingMatiere) {
      this.matiereService.updateMatiere(this.editingMatiere.id, matiereToSend).subscribe({
        next: () => {
          this.loadMatieres();
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          console.error('Erreur modification:', err);
        }
      });
    } else {
      this.matiereService.createMatiere(matiereToSend).subscribe({
        next: () => {
          this.loadMatieres();
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout';
          console.error('Erreur ajout:', err);
        }
      });
    }
  }

  deleteMatiere(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ? Cette action est irréversible.')) {
      this.matiereService.deleteMatiere(id).subscribe({
        next: () => {
          this.loadMatieres();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('Erreur lors de la suppression de la matière');
        }
      });
    }
  }

  getClasseNoms(matiere: any): string {
    if (!matiere.classes || matiere.classes.length === 0) return '';
    return matiere.classes.map((c: any) => c.nom).join(', ');
  }
} 