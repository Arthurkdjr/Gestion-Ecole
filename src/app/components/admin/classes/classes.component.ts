import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasseService } from '../../../services/classe.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="classes-container">
      <h1>Gestion des Classes</h1>
      <button (click)="openForm()" class="add-btn">➕ Ajouter une classe</button>
      <div class="search-bar">
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" placeholder="Rechercher une classe..." class="search-input">
      </div>
      <!-- Formulaire d'ajout/modification -->
      <div class="form-overlay" *ngIf="showForm">
        <div class="form-modal">
          <h2>{{ editingClasse ? 'Modifier' : 'Ajouter' }} une classe</h2>
          <form (ngSubmit)="onSubmit()" #classeForm="ngForm" class="classe-form">
            <div class="form-group">
              <label for="nom">Nom *</label>
              <input type="text" id="nom" name="nom" [(ngModel)]="classeFormData.nom" required class="form-control">
            </div>
            <div class="form-group">
              <label for="niveau">Niveau *</label>
              <input type="text" id="niveau" name="niveau" [(ngModel)]="classeFormData.niveau" required class="form-control">
            </div>
            <div class="form-actions">
              <button type="button" (click)="closeForm()" class="btn-secondary">Annuler</button>
              <button type="submit" [disabled]="!classeForm.valid || loading" class="btn-primary">
                <span *ngIf="loading">Enregistrement...</span>
                <span *ngIf="!loading">{{ editingClasse ? 'Modifier' : 'Ajouter' }}</span>
              </button>
            </div>
            <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
          </form>
        </div>
      </div>

      <table *ngIf="filteredClasses.length > 0; else noClasses" class="classes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Niveau</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let classe of filteredClasses">
            <td>{{ classe.id }}</td>
            <td>{{ classe.nom }}</td>
            <td>{{ classe.niveau }}</td>
            <td>
              <button (click)="editClasse(classe)" class="action-btn edit">✏️</button>
              <button (click)="deleteClasse(classe.id)" class="action-btn delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <ng-template #noClasses>
        <p>Aucune classe trouvée.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .classes-container {
      padding: 30px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
    }
    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 20px;
      transition: transform 0.2s ease;
    }
    .add-btn:hover {
      transform: translateY(-2px);
    }
    .form-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .form-modal {
      background: white;
      border-radius: 12px;
      padding: 30px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    .classe-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-weight: 500;
      color: #333;
    }
    .form-control {
      padding: 10px;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 15px;
      transition: border-color 0.3s ease;
    }
    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 10px;
    }
    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-secondary {
      background: #ecf0f1;
      color: #7f8c8d;
    }
    .btn-secondary:hover {
      background: #d5dbdb;
    }
    .error-message {
      background: #fee;
      color: #c33;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #fcc;
      text-align: center;
      margin-top: 10px;
    }
    .classes-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .classes-table th, .classes-table td {
      border: 1px solid #e1e5e9;
      padding: 10px;
      text-align: left;
    }
    .classes-table th {
      background: #f8f9fa;
      color: #2c3e50;
    }
    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 5px;
      border-radius: 4px;
      transition: background 0.2s ease;
      margin-right: 4px;
    }
    .action-btn.edit:hover {
      background: #e8f5e8;
    }
    .action-btn.delete:hover {
      background: #ffeaea;
    }
  `]
})
export class ClassesComponent implements OnInit {
  classes: any[] = [];
  filteredClasses: any[] = [];
  searchTerm = '';
  showForm = false;
  loading = false;
  errorMessage = '';
  editingClasse: any = null;
  classeFormData = { nom: '', niveau: '' };

  constructor(private classeService: ClasseService) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.filterClasses();
      },
      error: (err) => {
        this.classes = [];
        this.filteredClasses = [];
        console.error('Erreur lors du chargement des classes:', err);
      }
    });
  }

  filterClasses(): void {
    if (!this.searchTerm) {
      this.filteredClasses = this.classes;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredClasses = this.classes.filter(classe =>
        classe.nom.toLowerCase().includes(term) ||
        classe.niveau.toLowerCase().includes(term)
      );
    }
  }

  onSearchChange(): void {
    this.filterClasses();
  }

  openForm(): void {
    this.showForm = true;
    this.editingClasse = null;
    this.classeFormData = { nom: '', niveau: '' };
    this.errorMessage = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.editingClasse = null;
    this.classeFormData = { nom: '', niveau: '' };
    this.errorMessage = '';
  }

  editClasse(classe: any): void {
    this.editingClasse = classe;
    this.classeFormData = { nom: classe.nom, niveau: classe.niveau };
    this.showForm = true;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.loading) return;
    this.loading = false;
    this.errorMessage = '';
    // Validation anti-doublon
    const nom = this.classeFormData.nom.trim().toLowerCase();
    const niveau = this.classeFormData.niveau.trim().toLowerCase();
    const doublon = this.classes.some(classe =>
      classe.nom.trim().toLowerCase() === nom &&
      classe.niveau.trim().toLowerCase() === niveau &&
      (!this.editingClasse || classe.id !== this.editingClasse.id)
    );
    if (doublon) {
      this.errorMessage = 'Une classe avec ce nom et ce niveau existe déjà.';
      return;
    }
    this.loading = true;
    if (this.editingClasse) {
      this.classeService.updateClasse(this.editingClasse.id, this.classeFormData).subscribe({
        next: () => {
          this.loadClasses();
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
        }
      });
    } else {
      this.classeService.createClasse(this.classeFormData).subscribe({
        next: () => {
          this.loadClasses();
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout';
        }
      });
    }
  }

  deleteClasse(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      this.classeService.deleteClasse(id).subscribe({
        next: () => this.loadClasses(),
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }
} 