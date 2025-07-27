import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EleveService } from '../../../services/eleve.service';
import { Eleve } from '../../../models/utilisateur';
import { ClasseService } from '../../../services/classe.service';

@Component({
  selector: 'app-eleves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="eleves-container">
      <div class="header">
        <h1>Gestion des Élèves</h1>
        <button (click)="showAddForm = true" class="add-btn">
          <span class="icon">➕</span>
          Ajouter un élève
        </button>
      </div>

      <!-- Formulaire d'ajout/modification -->
      <div class="form-overlay" *ngIf="showAddForm || editingEleve">
        <div class="form-modal">
          <div class="form-header">
            <h2>{{ editingEleve ? 'Modifier' : 'Ajouter' }} un élève</h2>
            <button (click)="closeForm()" class="close-btn">✕</button>
          </div>
          
          <form (ngSubmit)="onSubmit()" #eleveForm="ngForm" class="eleve-form">
            <div class="form-row">
              <div class="form-group">
                <label for="nom">Nom *</label>
                <input 
                  type="text" 
                  id="nom" 
                  name="nom" 
                  [(ngModel)]="eleveFormData.nom" 
                  required 
                  class="form-control">
              </div>
              
              <div class="form-group">
                <label for="prenom">Prénom *</label>
                <input 
                  type="text" 
                  id="prenom" 
                  name="prenom" 
                  [(ngModel)]="eleveFormData.prenom" 
                  required 
                  class="form-control">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  [(ngModel)]="eleveFormData.email" 
                  required 
                  class="form-control">
              </div>
              
              <div class="form-group">
                <label for="dateNaissance">Date de naissance *</label>
                <input 
                  type="date" 
                  id="dateNaissance" 
                  name="dateNaissance" 
                  [(ngModel)]="eleveFormData.dateNaissance" 
                  required 
                  class="form-control">
              </div>
            </div>
            
            <div class="form-group">
              <label for="classe">Classe</label>
              <select 
                id="classe" 
                name="classe" 
                [(ngModel)]="eleveFormData.classeId" 
                class="form-control"
                required>
                <option value="">Sélectionner une classe</option>
                <option *ngFor="let classe of classes" [value]="classe.id">
                  {{ classe.nom }} - {{ classe.niveau }}
                </option>
              </select>
            </div>
            
            <div class="form-actions">
              <button type="button" (click)="closeForm()" class="btn-secondary">
                Annuler
              </button>
              <button 
                type="submit" 
                [disabled]="!eleveForm.valid || loading" 
                class="btn-primary">
                <span *ngIf="loading">Enregistrement...</span>
                <span *ngIf="!loading">{{ editingEleve ? 'Modifier' : 'Ajouter' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Liste des élèves -->
      <div class="eleves-list">
        <div class="search-bar">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            placeholder="Rechercher un élève..."
            class="search-input">
        </div>
        
        <div class="table-container">
          <table class="eleves-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Classe</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let eleve of filteredEleves">
                <td>{{ eleve.numeroEtudiant }}</td>
                <td>{{ eleve.nom }}</td>
                <td>{{ eleve.prenom }}</td>
                <td>{{ eleve.email }}</td>
                <td>{{ eleve.classe.nom || 'Non assigné' }}</td>
                <td class="actions">
                  <button (click)="editEleve(eleve)" class="action-btn edit">
                    ✏️
                  </button>
                  <button (click)="deleteEleve(eleve.id)" class="action-btn delete">
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eleves-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .header h1 {
      color: #2c3e50;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .add-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: transform 0.2s ease;
    }
    
    .add-btn:hover {
      transform: translateY(-2px);
    }
    
    .form-overlay {
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
    }
    
    .form-modal {
      background: white;
      border-radius: 12px;
      padding: 30px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }
    
    .form-header h2 {
      margin: 0;
      color: #2c3e50;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #7f8c8d;
    }
    
    .eleve-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group label {
      font-weight: 500;
      color: #333;
    }
    
    .form-control {
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    .btn-primary, .btn-secondary {
      padding: 12px 24px;
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
    
    .search-bar {
      margin-bottom: 20px;
    }
    
    .search-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 16px;
    }
    
    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .eleves-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .eleves-table th,
    .eleves-table td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .eleves-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .eleves-table tr:hover {
      background: #f8f9fa;
    }
    
    .actions {
      display: flex;
      gap: 8px;
    }
    
    .action-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 5px;
      border-radius: 4px;
      transition: background 0.2s ease;
    }
    
    .action-btn.edit:hover {
      background: #e8f5e8;
    }
    
    .action-btn.delete:hover {
      background: #ffeaea;
    }
    
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .eleves-table {
        font-size: 14px;
      }
      
      .eleves-table th,
      .eleves-table td {
        padding: 10px;
      }
    }
  `]
})
export class ElevesComponent implements OnInit {
  eleves: Eleve[] = [];
  filteredEleves: Eleve[] = [];
  searchTerm = '';
  showAddForm = false;
  editingEleve: Eleve | null = null;
  loading = false;
  errorMessage: string = '';
  
  eleveFormData = {
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    classeId: ''
  };
  
  classes: any[] = [];

  constructor(private eleveService: EleveService, private classeService: ClasseService) {}

  ngOnInit(): void {
    this.loadEleves();
    this.classeService.getClasses().subscribe({
      next: (classes) => this.classes = classes,
      error: (err) => {
        this.classes = [];
        console.error('Erreur lors du chargement des classes:', err);
      }
    });
  }

  loadEleves(): void {
    this.eleveService.getEleves().subscribe({
      next: (eleves) => {
        this.eleves = eleves;
        this.filterEleves();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des élèves:', error);
      }
    });
  }

  filterEleves(): void {
    if (!this.searchTerm) {
      this.filteredEleves = this.eleves;
    } else {
      this.filteredEleves = this.eleves.filter(eleve =>
        eleve.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        eleve.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        eleve.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  editEleve(eleve: Eleve): void {
    this.editingEleve = eleve;
    this.eleveFormData = {
      nom: eleve.nom,
      prenom: eleve.prenom,
      email: eleve.email,
      dateNaissance: eleve.dateNaissance ? new Date(eleve.dateNaissance).toISOString().split('T')[0] : '',
      classeId: eleve.classe?.id?.toString() || ''
    };
  }

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    const eleveData = {
      nom: this.eleveFormData.nom,
      prenom: this.eleveFormData.prenom,
      email: this.eleveFormData.email,
      date_naissance: this.eleveFormData.dateNaissance, // déjà au format YYYY-MM-DD grâce à input type="date"
      classe_id: this.eleveFormData.classeId && !isNaN(parseInt(this.eleveFormData.classeId))
        ? parseInt(this.eleveFormData.classeId)
        : undefined
    };

    if (this.editingEleve) {
      this.eleveService.updateEleve(this.editingEleve.id, eleveData).subscribe({
        next: () => {
          this.loadEleves();
          this.closeForm();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.loading = false;
        }
      });
    } else {
      console.log('Objet envoyé à l’API:', eleveData);
      this.eleveService.createEleve(eleveData).subscribe({
        next: () => {
          this.loadEleves();
          this.closeForm();
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de la création';
          console.error('Erreur lors de la création:', error);
          if (error.error && error.error.errors) {
            console.log('Détails validation:', error.error.errors);
          }
        }
      });
    }
  }

  deleteEleve(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      this.eleveService.deleteEleve(id).subscribe({
        next: () => {
          this.loadEleves();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  closeForm(): void {
    this.showAddForm = false;
    this.editingEleve = null;
    this.eleveFormData = {
      nom: '',
      prenom: '',
      email: '',
      dateNaissance: '',
      classeId: ''
    };
  }
} 