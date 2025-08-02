import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EleveService } from '../../../services/eleve.service';
import { Eleve, DocumentJustificatif } from '../../../models/utilisateur';
import { ClasseService } from '../../../services/classe.service';
import { DocumentUploadComponent } from './document-upload/document-upload.component';

@Component({
  selector: 'app-eleves',
  standalone: true,
  imports: [CommonModule, FormsModule, DocumentUploadComponent],
  template: `
    <div class="eleves-container">
      <div class="header">
        <h1>Gestion des Élèves</h1>
        <button (click)="preparerNouvelEleve()" class="add-btn">
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
                [(ngModel)]="eleveFormData.date_naissance" 
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
            
            <div class="form-group">
              <label for="numeroEtudiant">Numéro d'étudiant</label>
              <input 
                type="text" 
                id="numeroEtudiant" 
                name="numeroEtudiant" 
                [(ngModel)]="eleveFormData.numero_etudiant" 
                readonly 
                class="form-control readonly"
                placeholder="Généré automatiquement">
              <small class="form-text">Numéro généré automatiquement par le système</small>
            </div>
            
            <div class="form-group" *ngIf="!editingEleve">
              <label for="motDePasse">Mot de passe temporaire</label>
              <div class="password-display">
                <input 
                  type="text" 
                  id="motDePasse" 
                  name="motDePasse" 
                  [value]="genererMotDePasseTemporaire()" 
                  readonly 
                  class="form-control readonly"
                  #motDePasseInput>
                <button 
                  type="button" 
                  (click)="motDePasseInput.value = genererMotDePasseTemporaire()" 
                  class="regenerate-btn">
                  🔄
                </button>
              </div>
              <small class="form-text">Mot de passe temporaire généré automatiquement. L'élève devra le changer à sa première connexion.</small>
            </div>
            
            <!-- Section Documents Justificatifs -->
            <app-document-upload 
              [eleveId]="editingEleve?.id || null"
              (documentsUploaded)="onDocumentsUploaded($event)">
            </app-document-upload>
            
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
                <td>{{ eleve.numero_etudiant }}</td>
                <td>{{ eleve.nom }}</td>
                <td>{{ eleve.prenom }}</td>
                <td>{{ eleve.email }}</td>
                <td>{{ eleve.classe?.nom || 'Non assigné' }}</td>
                <td class="actions">
                  <button (click)="editEleve(eleve)" class="action-btn edit">
                    ✏️
                  </button>
                  <button (click)="deleteEleve(eleve.id)" class="action-btn delete">
                    🗑️
                  </button>
                  <button *ngIf="eleve.classe" (click)="retirerClasse(eleve)" class="action-btn remove" title="Retirer de la classe">
                    🚫
                  </button>
                  <button (click)="changerClasse(eleve)" class="action-btn change" title="Changer de classe">
                    🔄
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

    .form-control.readonly {
      background-color: #f0f0f0;
      cursor: not-allowed;
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

    .form-text {
      font-size: 12px;
      color: #7f8c8d;
      margin-top: 5px;
    }
    
    .password-display {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .regenerate-btn {
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 14px;
      color: #333;
      transition: background 0.2s ease;
    }

    .regenerate-btn:hover {
      background: #e0e0e0;
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
    date_naissance: '',
    classeId: '',
    numero_etudiant: ''
  };

  classes: any[] = [];
  uploadedDocuments: DocumentJustificatif[] = [];

  constructor(private eleveService: EleveService, private classeService: ClasseService) {}

  ngOnInit(): void {
    this.loadEleves();
    this.loadClasses();
  }

  onDocumentsUploaded(documents: DocumentJustificatif[]): void {
    this.uploadedDocuments = documents;
    console.log('Documents uploadés:', documents);
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des classes:', error);
      }
    });
  }

  // Générer un mot de passe temporaire
  genererMotDePasseTemporaire(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let motDePasse = '';
    for (let i = 0; i < 8; i++) {
      motDePasse += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return motDePasse;
  }

  // Générer automatiquement un numéro d'étudiant unique
  genererNumeroEtudiant(): string {
    const annee = new Date().getFullYear();
    
    // Trouver le plus grand numéro existant pour cette année
    let maxNumero = 0;
    this.eleves.forEach(eleve => {
      if (eleve.numero_etudiant) {
        const match = eleve.numero_etudiant.match(new RegExp(`ISI${annee}(\\d{4})`));
        if (match) {
          const numero = parseInt(match[1]);
          if (numero > maxNumero) {
            maxNumero = numero;
          }
        }
      }
    });
    
    // Générer le prochain numéro
    const nextNumero = maxNumero + 1;
    const numeroStr = nextNumero.toString().padStart(4, '0');
    
    return `ISI${annee}${numeroStr}`;
  }

  // Pré-remplir le formulaire avec un numéro d'étudiant généré
  preparerNouvelEleve(): void {
    this.eleveFormData = {
      nom: '',
      prenom: '',
      email: '',
      date_naissance: '',
      classeId: '',
      numero_etudiant: this.genererNumeroEtudiant()
    };
    this.showAddForm = true;
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
      date_naissance: eleve.date_naissance ? new Date(eleve.date_naissance).toISOString().split('T')[0] : '',
      classeId: eleve.classe?.id?.toString() || '',
      numero_etudiant: eleve.numero_etudiant || ''
    };
  }

  onSubmit(): void {
    if (this.loading) return;
    
    this.loading = true;
    const eleveData = {
      nom: this.eleveFormData.nom,
      prenom: this.eleveFormData.prenom,
      email: this.eleveFormData.email,
      date_naissance: this.eleveFormData.date_naissance, // déjà au format YYYY-MM-DD grâce à input type="date"
      classe_id: this.eleveFormData.classeId && !isNaN(parseInt(this.eleveFormData.classeId))
        ? parseInt(this.eleveFormData.classeId)
        : undefined,
      numero_etudiant: this.eleveFormData.numero_etudiant || undefined,
      mot_de_passe: this.editingEleve ? undefined : this.genererMotDePasseTemporaire() // Mot de passe seulement pour les nouveaux élèves
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
      date_naissance: '',
      classeId: '',
      numero_etudiant: ''
    };
    this.uploadedDocuments = [];
  }

  retirerClasse(eleve: Eleve): void {
    if (!eleve || !eleve.id) return;
    if (!confirm(`Retirer ${eleve.prenom} ${eleve.nom} de la classe ${eleve.classe?.nom} ?`)) return;
    this.loading = true;
    this.eleveService.updateEleve(eleve.id, { classe_id: null }).subscribe({
      next: () => {
        this.loadEleves();
        this.loading = false;
        alert('Élève retiré de la classe avec succès.');
      },
      error: (error) => {
        this.loading = false;
        alert('Erreur lors du retrait de la classe.');
        console.error(error);
      }
    });
  }

  changerClasse(eleve: Eleve): void {
    this.editEleve(eleve);
    this.showAddForm = true;
  }
} 