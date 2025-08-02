import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnseignantService } from '../../../services/enseignant.service';
import { ClasseService } from '../../../services/classe.service';
import { AffectationService } from '../../../services/affectation.service';
import { MatiereService } from '../../../services/matiere.service';

@Component({
  selector: 'app-enseignants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="enseignants-container">
      <!-- Header -->
      <div class="header">
        <h1>Gestion des Enseignants</h1>
        <p class="subtitle">Gérez le personnel enseignant et leurs affectations</p>
      </div>

      <!-- Statistiques -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">👨‍🏫</div>
          <div class="stat-content">
            <h3>{{ enseignants.length }}</h3>
            <p>Total enseignants</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏫</div>
          <div class="stat-content">
            <h3>{{ stats.classesAssignees }}</h3>
            <p>Classes assignées</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ stats.moyenneClasses | number:'1.1-1' }}</h3>
            <p>Classes/enseignant</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <h3>{{ stats.ancienneteMoyenne | number:'1.0-0' }}</h3>
            <p>Années d'expérience</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearchChange()" 
            placeholder="Rechercher un enseignant..." 
            class="search-input">
        </div>
        <div class="action-buttons">
          <button (click)="verifierAffectations()" class="btn btn-info">
            <span class="btn-icon">🔍</span>
            Vérifier affectations
          </button>
          <button (click)="diagnosticDonnees()" class="btn btn-warning">
            <span class="btn-icon">��</span>
            Diagnostic données
          </button>
          <button (click)="refreshData()" class="btn btn-secondary">
            <span class="btn-icon">🔄</span>
            Actualiser
          </button>
          <button (click)="openForm()" class="add-btn">
            <span class="btn-icon">➕</span>
            Ajouter un enseignant
          </button>
        </div>
      </div>

      <!-- Liste des enseignants -->
      <div class="enseignants-section">
        <div *ngIf="filteredEnseignants.length > 0; else noEnseignants" class="enseignants-grid">
          <div *ngFor="let enseignant of filteredEnseignants" class="enseignant-card">
            <div class="enseignant-header">
              <div class="enseignant-info">
                <h3>{{ enseignant.nom }} {{ enseignant.prenom }}</h3>
                <span class="enseignant-email">{{ enseignant.email }}</span>
              </div>
              <div class="enseignant-badges">
                <span class="badge badge-info">{{ enseignant.specialite }}</span>
                <span class="badge" 
                      [class.badge-success]="enseignant.statut === 'Actif' || enseignant.statut === 'Titulaire'"
                      [class.badge-warning]="enseignant.statut === 'Vacataire' || enseignant.statut === 'Contractuel'"
                      [class.badge-danger]="enseignant.statut === 'Inactif' || enseignant.statut === 'Retraité'">
                  {{ enseignant.statut }}
                </span>
              </div>
            </div>
            
            <div class="enseignant-details">
              <div class="detail-item">
                <span class="detail-label">Date d'embauche:</span>
                <span class="detail-value">{{ enseignant.date_embauche | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Ancienneté:</span>
                <span class="detail-value">{{ getAnciennete(enseignant.date_embauche) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Classes:</span>
                <span class="detail-value">
                  <span *ngIf="enseignant.classes && enseignant.classes.length > 0; else noClasse">
                    {{ getClassesNames(enseignant) }}
                  </span>
                  <ng-template #noClasse><em>Aucune classe</em></ng-template>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Matières:</span>
                <span class="detail-value">
                  <span *ngIf="enseignant.matieres && enseignant.matieres.length > 0; else noMatiere">
                    {{ getMatieresNames(enseignant) }}
                  </span>
                  <ng-template #noMatiere><em>Aucune matière</em></ng-template>
                </span>
              </div>
            </div>

            <div class="enseignant-actions">
              <button (click)="editEnseignant(enseignant)" class="btn btn-secondary">
                <span class="btn-icon">✏️</span>
                Modifier
              </button>
              <button (click)="affecterClasses(enseignant)" class="btn btn-primary">
                <span class="btn-icon">📚</span>
                Affecter matière/classe
              </button>
              <button (click)="deleteEnseignant(enseignant.id)" class="btn btn-danger">
                <span class="btn-icon">🗑️</span>
                Supprimer
              </button>
            </div>
          </div>
        </div>
        
        <ng-template #noEnseignants>
          <div class="no-data">
            <div class="no-data-icon">👨‍🏫</div>
            <h3>Aucun enseignant trouvé</h3>
            <p>{{ searchTerm ? 'Aucun enseignant ne correspond à votre recherche.' : 'Commencez par ajouter votre premier enseignant.' }}</p>
          </div>
        </ng-template>
      </div>

      <!-- Modal de formulaire enseignant -->
      <div class="modal-overlay" *ngIf="showForm" (click)="closeForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingEnseignant ? 'Modifier' : 'Ajouter' }} un enseignant</h2>
            <button (click)="closeForm()" class="close-btn">×</button>
          </div>
          
          <form (ngSubmit)="onSubmit()" #enseignantForm="ngForm" class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label for="nom">Nom *</label>
                <input 
                  type="text" 
                  id="nom" 
                  name="nom" 
                  [(ngModel)]="enseignantFormData.nom" 
                  required 
                  class="form-control"
                  placeholder="Ex: Dupont">
              </div>
              
              <div class="form-group">
                <label for="prenom">Prénom *</label>
                <input 
                  type="text" 
                  id="prenom" 
                  name="prenom" 
                  [(ngModel)]="enseignantFormData.prenom" 
                  required 
                  class="form-control"
                  placeholder="Ex: Jean">
              </div>
              
              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  [(ngModel)]="enseignantFormData.email" 
                  required 
                  class="form-control"
                  placeholder="Ex: jean.dupont@ecole.com">
              </div>
              
              <div class="form-group">
                <label for="specialite">Spécialité *</label>
                <input 
                  type="text" 
                  id="specialite" 
                  name="specialite" 
                  [(ngModel)]="enseignantFormData.specialite" 
                  required 
                  class="form-control"
                  placeholder="Ex: Mathématiques">
              </div>
              
              <div class="form-group">
                <label for="date_embauche">Date d'embauche *</label>
                <input 
                  type="date" 
                  id="date_embauche" 
                  name="date_embauche" 
                  [(ngModel)]="enseignantFormData.date_embauche" 
                  required 
                  class="form-control">
              </div>
              
              <div class="form-group">
                <label for="statut">Statut *</label>
                <select 
                  id="statut" 
                  name="statut" 
                  [(ngModel)]="enseignantFormData.statut" 
                  required 
                  class="form-control">
                  <option value="">Sélectionner un statut</option>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Retraité">Retraité</option>
                  <option value="Vacataire">Vacataire</option>
                  <option value="Titulaire">Titulaire</option>
                  <option value="Contractuel">Contractuel</option>
                </select>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" (click)="closeForm()" class="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" [disabled]="!enseignantForm.valid || loading" class="btn btn-primary">
                <span *ngIf="loading" class="loading-spinner"></span>
                <span *ngIf="!loading">{{ editingEnseignant ? 'Modifier' : 'Ajouter' }}</span>
              </button>
            </div>
            
            <div *ngIf="errorMessage" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>

      <!-- Modal d'affectation -->
      <div class="modal-overlay" *ngIf="showAffectationModal" (click)="closeAffectationModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Affecter matière/classe à {{ selectedEnseignant?.nom }} {{ selectedEnseignant?.prenom }}</h2>
            <button (click)="closeAffectationModal()" class="close-btn">×</button>
          </div>
          
          <div class="modal-body">
            <div class="affectation-section">
              <div class="affectation-form">
                <div class="form-group">
                  <label for="matiere_id">Matière *</label>
                  <select 
                    id="matiere_id" 
                    name="matiere_id" 
                    [(ngModel)]="affectationFormData.matiere_id" 
                    required 
                    class="form-control">
                    <option value="">Sélectionner une matière</option>
                    <option *ngFor="let matiere of matieres" [value]="matiere.id">
                      {{ matiere.nom }} ({{ matiere.niveau }}) [ID: {{ matiere.id }}]
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="classe_id">Classe *</label>
                  <select 
                    id="classe_id" 
                    name="classe_id" 
                    [(ngModel)]="affectationFormData.classe_id" 
                    required 
                    class="form-control">
                    <option value="">Sélectionner une classe</option>
                    <option *ngFor="let classe of classes" [value]="classe.id">
                      {{ classe.nom }} - {{ classe.niveau }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div *ngIf="affectationFormData.matiere_id && affectationFormData.classe_id" class="affectation-summary">
                <p><strong>Affectation:</strong> {{ getMatiereName(affectationFormData.matiere_id) }} → {{ getClasseName(affectationFormData.classe_id) }}</p>
              </div>
              
              <div class="existing-affectations" *ngIf="getAffectationsEnseignant(selectedEnseignant?.id).length > 0">
                <h4>Affectations existantes:</h4>
                <div *ngFor="let affectation of getAffectationsEnseignant(selectedEnseignant?.id)" class="affectation-item">
                  <div class="affectation-info">
                    <span>{{ getMatiereName(affectation.matiere_id) }} → {{ getClasseName(affectation.classe_id) }}</span>
                  </div>
                  <div class="affectation-actions">
                    <button (click)="supprimerAffectation(affectation.id)" class="btn btn-danger btn-sm">
                      <span class="btn-icon">🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" (click)="closeAffectationModal()" class="btn btn-secondary">
                Annuler
              </button>
              <button (click)="confirmerAffectation()" [disabled]="!affectationFormData.matiere_id || !affectationFormData.classe_id || savingAffectation" class="btn btn-primary">
                <span *ngIf="savingAffectation" class="loading-spinner"></span>
                <span *ngIf="!savingAffectation">Confirmer l'affectation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de diagnostic -->
      <div class="modal-overlay" *ngIf="showDiagnosticModal" (click)="showDiagnosticModal = false">
        <div class="modal-content diagnostic-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Diagnostic des Affectations</h2>
            <button (click)="showDiagnosticModal = false" class="close-btn">×</button>
          </div>
          
          <div class="modal-body">
            <div class="diagnostic-section">
              <h3>Statistiques générales</h3>
              <div class="diagnostic-stats">
                <div class="stat-item">
                  <span class="stat-label">Total affectations:</span>
                  <span class="stat-value">{{ affectations.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Enseignants affectés:</span>
                  <span class="stat-value">{{ getEnseignantsAffectesCount() }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Matières utilisées:</span>
                  <span class="stat-value">{{ getMatieresUniquesCount() }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Classes utilisées:</span>
                  <span class="stat-value">{{ getClassesUniquesCount() }}</span>
                </div>
              </div>
            </div>
            
            <div class="diagnostic-section">
              <h3>Liste des affectations</h3>
              <div class="affectations-list">
                <div *ngFor="let affectation of affectations" class="affectation-item">
                  <div class="affectation-header">
                    <span class="affectation-id">#{{ affectation.id }}</span>
                  </div>
                  <div class="affectation-details">
                    <div class="detail-row">
                      <span class="detail-label">Enseignant:</span>
                      <span class="detail-value">{{ getEnseignantName(affectation.enseignant_id) }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Matière:</span>
                      <span class="detail-value">{{ getMatiereName(affectation.matiere_id) }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Classe:</span>
                      <span class="detail-value">{{ getClasseName(affectation.classe_id) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="diagnostic-section">
              <h3>Statut des enseignants</h3>
              <div class="enseignants-status">
                <div *ngFor="let enseignant of enseignants" class="enseignant-status">
                  <div class="status-header">
                    <span class="enseignant-name">{{ enseignant.nom }} {{ enseignant.prenom }}</span>
                    <span class="status-badge" [class.has-affectations]="getAffectationsEnseignant(enseignant.id).length > 0">
                      {{ getAffectationsEnseignant(enseignant.id).length }} affectation(s)
                    </span>
                  </div>
                  <div *ngIf="getAffectationsEnseignant(enseignant.id).length > 0" class="affectations-details">
                    <div *ngFor="let affectation of getAffectationsEnseignant(enseignant.id)" class="affectation-detail">
                      • {{ getMatiereName(affectation.matiere_id) }} → {{ getClasseName(affectation.classe_id) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .enseignants-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 2.5rem;
    }

    .subtitle {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .stats {
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

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      gap: 20px;
      flex-wrap: wrap;
    }

    .search-box {
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

    .enseignants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
    }

    .enseignant-card {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 25px;
      transition: all 0.2s;
    }

    .enseignant-card:hover {
      border-color: #667eea;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      transform: translateY(-3px);
    }

    .enseignant-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .enseignant-info h3 {
      color: #2c3e50;
      margin: 0 0 8px 0;
      font-size: 1.3rem;
    }

    .enseignant-email {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-bottom: 10px;
    }

    .enseignant-details {
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

    .enseignant-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
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
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
      transform: translateY(-1px);
    }

    .btn-success {
      background: #27ae60;
      color: white;
    }

    .btn-success:hover {
      background: #229954;
      transform: translateY(-1px);
    }

    .btn-warning {
      background: #f39c12;
      color: white;
    }

    .btn-warning:hover {
      background: #e67e22;
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

    .btn-info {
      background: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background: #138496;
      transform: translateY(-1px);
    }

    .btn-icon {
      font-size: 1rem;
    }

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

    .modal-body {
      padding: 30px;
    }

    .modal-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      padding: 25px 30px;
      border-top: 1px solid #e1e5e9;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .badge-success {
      background: #27ae60;
      color: white;
    }

    .badge-warning {
      background: #f39c12;
      color: white;
    }

    .badge-danger {
      background: #e74c3c;
      color: white;
    }

    .badge-info {
      background: #17a2b8;
      color: white;
    }

    .badge-secondary {
      background: #95a5a6;
      color: white;
    }

    .affectation-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .affectation-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }

    .affectation-summary {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      border: 1px solid #e1e5e9;
    }

    .existing-affectations {
      margin-top: 20px;
    }

    .affectation-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 8px;
      border: 1px solid #e1e5e9;
    }

    .affectation-info {
      display: flex;
      gap: 15px;
    }

    .affectation-actions {
      display: flex;
      gap: 5px;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
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

    .action-buttons {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
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

    .diagnostic-modal {
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .diagnostic-section {
      margin-bottom: 25px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e1e5e9;
    }

    .diagnostic-section h3 {
      margin: 0 0 15px 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .diagnostic-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e1e5e9;
    }

    .stat-label {
      font-weight: 600;
      color: #2c3e50;
    }

    .stat-value {
      font-weight: bold;
      color: #667eea;
      font-size: 1.1rem;
    }

    .affectations-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .affectation-item {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      padding: 15px;
    }

    .affectation-header {
      margin-bottom: 10px;
    }

    .affectation-id {
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: bold;
    }

    .affectation-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
    }

    .detail-label {
      font-weight: 600;
      color: #2c3e50;
    }

    .detail-value {
      color: #7f8c8d;
    }

    .enseignants-status {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .enseignant-status {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      padding: 15px;
    }

    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .enseignant-name {
      font-weight: 600;
      color: #2c3e50;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: bold;
      background: #e74c3c;
      color: white;
    }

    .status-badge.has-affectations {
      background: #27ae60;
    }

    .affectations-details {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #e1e5e9;
    }

    .affectation-detail {
      padding: 5px 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }

      .actions {
        flex-direction: column;
      }

      .search-box {
        max-width: none;
      }

      .enseignants-grid {
        grid-template-columns: 1fr;
      }

      .affectation-form {
        grid-template-columns: 1fr;
      }

      .enseignant-actions {
        justify-content: center;
      }

      .modal-content {
        margin: 10px;
        max-height: 95vh;
      }
    }
  `]
})
export class EnseignantsComponent implements OnInit {
  enseignants: any[] = [];
  filteredEnseignants: any[] = [];
  classes: any[] = [];
  matieres: any[] = [];
  affectations: any[] = [];
  searchTerm = '';
  showForm = false;
  showAffectationModal = false;
  showDiagnosticModal = false;
  loading = false;
  savingAffectation = false;
  errorMessage = '';
  editingEnseignant: any = null;
  selectedEnseignant: any = null;
  selectedClasses: number[] = [];
  affectationFormData = {
    enseignant_id: 0,
    matiere_id: 0,
    classe_id: 0
  };
  
  enseignantFormData = {
    nom: '',
    prenom: '',
    email: '',
    specialite: '',
    date_embauche: '',
    statut: '',
    mot_de_passe: ''
  };

  stats = {
    classesAssignees: 0,
    moyenneClasses: 0,
    ancienneteMoyenne: 0
  };

  constructor(
    private enseignantService: EnseignantService,
    private classeService: ClasseService,
    private affectationService: AffectationService,
    private matiereService: MatiereService
  ) {}

  ngOnInit(): void {
    // Charger les données dans l'ordre pour éviter les problèmes de dépendances
    this.loadClasses();
    this.loadMatieres();
    this.loadEnseignants();
    
    // Charger les affectations après un délai pour s'assurer que les autres données sont chargées
    setTimeout(() => {
      this.loadAffectations();
      // Vérifier les affectations après le chargement complet
      setTimeout(() => {
        this.verifierAffectations();
      }, 1000);
    }, 500);
  }

  loadEnseignants(): void {
    this.enseignantService.getEnseignants().subscribe({
      next: (enseignants) => {
        this.enseignants = enseignants;
        this.filterEnseignants();
        this.calculateStats();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des enseignants:', err);
        this.enseignants = [];
        this.filteredEnseignants = [];
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

  loadMatieres(): void {
    this.matiereService.getMatieres().subscribe({
      next: (matieres: any[]) => {
        this.matieres = matieres;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des matières:', err);
        this.matieres = [];
      }
    });
  }

  loadAffectations(): void {
    this.affectationService.getAffectations().subscribe({
      next: (affectations) => {
        this.affectations = affectations;
        console.log('Affectations chargées:', affectations);
        
        // Mettre à jour les enseignants avec leurs affectations
        this.updateEnseignantAffectations();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des affectations:', err);
        this.affectations = [];
      }
    });
  }

  calculateStats(): void {
    // Calculer les statistiques
    this.stats.classesAssignees = this.enseignants.reduce((total, e) => 
      total + (e.classes?.length || 0), 0);
    
    this.stats.moyenneClasses = this.enseignants.length > 0 
      ? this.stats.classesAssignees / this.enseignants.length 
      : 0;

    // Calculer l'ancienneté moyenne
    const totalAnciennete = this.enseignants.reduce((total, e) => {
      if (e.date_embauche) {
        const embauche = new Date(e.date_embauche);
        const maintenant = new Date();
        const annees = maintenant.getFullYear() - embauche.getFullYear();
        return total + annees;
      }
      return total;
    }, 0);
    
    this.stats.ancienneteMoyenne = this.enseignants.length > 0 
      ? totalAnciennete / this.enseignants.length 
      : 0;
  }

  filterEnseignants(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEnseignants = this.enseignants;
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredEnseignants = this.enseignants.filter(enseignant =>
        enseignant.nom?.toLowerCase().includes(term) ||
        enseignant.prenom?.toLowerCase().includes(term) ||
        enseignant.email?.toLowerCase().includes(term) ||
        enseignant.specialite?.toLowerCase().includes(term)
      );
    }
  }

  onSearchChange(): void {
    this.filterEnseignants();
  }

  getInitials(enseignant: any): string {
    const nom = enseignant.nom?.charAt(0) || '';
    const prenom = enseignant.prenom?.charAt(0) || '';
    return (nom + prenom).toUpperCase();
  }

  getAnciennete(dateEmbauche: string): string {
    if (!dateEmbauche) return 'Non spécifiée';
    
    const embauche = new Date(dateEmbauche);
    const maintenant = new Date();
    const annees = maintenant.getFullYear() - embauche.getFullYear();
    
    if (annees === 0) return 'Moins d\'un an';
    if (annees === 1) return '1 an';
    return `${annees} ans`;
  }

  getClassesNames(enseignant: any): string {
    if (!enseignant.classes || enseignant.classes.length === 0) return '';
    return enseignant.classes.map((c: any) => c.nom).join(', ');
  }

  getMatieresNames(enseignant: any): string {
    if (!enseignant.matieres || enseignant.matieres.length === 0) return '';
    return enseignant.matieres.map((m: any) => m.nom).join(', ');
  }

  getMatiereName(matiereId: number): string {
    if (!this.matieres || this.matieres.length === 0) {
      console.warn('Aucune matière disponible pour rechercher ID:', matiereId);
      return 'Matière inconnue';
    }
    
    const matiere = this.matieres.find(m => m.id === matiereId);
    if (!matiere) {
      console.warn(`Matière avec ID ${matiereId} non trouvée. Matières disponibles:`, this.matieres.map(m => ({ id: m.id, nom: m.nom })));
      return 'Matière inconnue';
    }
    
    return matiere.nom;
  }

  getClasseName(classeId: number): string {
    if (!this.classes || this.classes.length === 0) {
      console.warn('Aucune classe disponible pour rechercher ID:', classeId);
      return 'Classe inconnue';
    }
    
    const classe = this.classes.find(c => c.id === classeId);
    if (!classe) {
      console.warn(`Classe avec ID ${classeId} non trouvée. Classes disponibles:`, this.classes.map(c => ({ id: c.id, nom: c.nom })));
      return 'Classe inconnue';
    }
    
    return classe.nom;
  }

  getEnseignantName(enseignantId: number): string {
    const enseignant = this.enseignants.find(e => e.id === enseignantId);
    return enseignant ? `${enseignant.nom} ${enseignant.prenom}` : 'Enseignant inconnu';
  }

  getAffectationsEnseignant(enseignantId: number): any[] {
    return this.affectations.filter(a => a.enseignant_id === enseignantId);
  }

  supprimerAffectation(affectationId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette affectation ?')) {
      this.affectationService.deleteAffectation(affectationId).subscribe({
        next: () => {
          console.log('Affectation supprimée avec succès');
          this.loadAffectations(); // Recharger les affectations
          this.updateEnseignantAffectations(); // Mettre à jour l'affichage
          this.calculateStats(); // Recalculer les statistiques
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression de l\'affectation');
        }
      });
    }
  }

  updateEnseignantAffectations(): void {
    console.log('Mise à jour des affectations des enseignants...');
    console.log('Affectations disponibles:', this.affectations);
    console.log('Classes disponibles:', this.classes);
    console.log('Matières disponibles:', this.matieres);
    
    // Mettre à jour tous les enseignants avec leurs affectations
    this.enseignants.forEach(enseignant => {
      const affectationsEnseignant = this.getAffectationsEnseignant(enseignant.id);
      console.log(`Affectations pour ${enseignant.nom} ${enseignant.prenom}:`, affectationsEnseignant);
      
      // Extraire les classes et matières des affectations
      const classesEnseignant = affectationsEnseignant.map(aff => {
        const classe = this.classes.find(c => c.id === aff.classe_id);
        return classe;
      }).filter(Boolean);
      
      const matieresEnseignant = affectationsEnseignant.map(aff => {
        const matiere = this.matieres.find(m => m.id === aff.matiere_id);
        return matiere;
      }).filter(Boolean);
      
      console.log(`Classes pour ${enseignant.nom}:`, classesEnseignant);
      console.log(`Matières pour ${enseignant.nom}:`, matieresEnseignant);
      
      // Mettre à jour l'enseignant avec ses classes et matières
      enseignant.classes = classesEnseignant;
      enseignant.matieres = matieresEnseignant;
    });
    
    // Mettre à jour la liste filtrée
    this.filterEnseignants();
    console.log('Mise à jour terminée');
  }

  refreshData(): void {
    console.log('Actualisation des données...');
    this.loadClasses();
    this.loadMatieres();
    this.loadEnseignants();
    
    setTimeout(() => {
      this.loadAffectations();
    }, 500);
  }

  verifierAffectations(): void {
    console.log('=== DIAGNOSTIC DES AFFECTATIONS ===');
    console.log('📊 Données disponibles:');
    console.log('- Enseignants:', this.enseignants.length);
    console.log('- Classes:', this.classes.length);
    console.log('- Matières:', this.matieres.length);
    console.log('- Affectations:', this.affectations.length);
    
    console.log('\n📋 Liste des affectations:');
    this.affectations.forEach((affectation, index) => {
      const enseignant = this.enseignants.find(e => e.id === affectation.enseignant_id);
      const classe = this.classes.find(c => c.id === affectation.classe_id);
      const matiere = this.matieres.find(m => m.id === affectation.matiere_id);
      
      console.log(`${index + 1}. ID: ${affectation.id}`);
      console.log(`   Enseignant: ${enseignant ? enseignant.nom + ' ' + enseignant.prenom : 'Non trouvé'} (ID: ${affectation.enseignant_id})`);
      console.log(`   Matière: ${matiere ? matiere.nom : 'Non trouvée'} (ID: ${affectation.matiere_id})`);
      console.log(`   Classe: ${classe ? classe.nom : 'Non trouvée'} (ID: ${affectation.classe_id})`);
      console.log('   ---');
    });
    
    console.log('\n👨‍🏫 Enseignants avec affectations:');
    this.enseignants.forEach(enseignant => {
      const affectationsEnseignant = this.getAffectationsEnseignant(enseignant.id);
      if (affectationsEnseignant.length > 0) {
        console.log(`✅ ${enseignant.nom} ${enseignant.prenom} (ID: ${enseignant.id})`);
        console.log(`   Affectations: ${affectationsEnseignant.length}`);
        affectationsEnseignant.forEach(aff => {
          const classe = this.classes.find(c => c.id === aff.classe_id);
          const matiere = this.matieres.find(m => m.id === aff.matiere_id);
          console.log(`   - ${matiere ? matiere.nom : 'Matière inconnue'} → ${classe ? classe.nom : 'Classe inconnue'}`);
        });
      } else {
        console.log(`❌ ${enseignant.nom} ${enseignant.prenom} (ID: ${enseignant.id}) - Aucune affectation`);
      }
    });
    
    console.log('\n📈 Statistiques:');
    const enseignantsAvecAffectations = this.enseignants.filter(e => this.getAffectationsEnseignant(e.id).length > 0);
    console.log(`- Enseignants avec affectations: ${enseignantsAvecAffectations.length}/${this.enseignants.length}`);
    console.log(`- Total affectations: ${this.affectations.length}`);
    
    console.log('=== FIN DU DIAGNOSTIC ===');
    
    // Ouvrir le modal de diagnostic
    this.showDiagnosticModal = true;
  }

  diagnosticDonnees(): void {
    console.log('=== DIAGNOSTIC COMPLET DES DONNÉES ===');
    console.log('📊 État des données:');
    console.log('- Enseignants:', this.enseignants.length);
    console.log('- Classes:', this.classes.length);
    console.log('- Matières:', this.matieres.length);
    console.log('- Affectations:', this.affectations.length);
    
    console.log('\n📋 Détail des matières:');
    this.matieres.forEach((matiere, index) => {
      console.log(`${index + 1}. ID: ${matiere.id}, Nom: ${matiere.nom}, Code: ${matiere.code}`);
    });
    
    console.log('\n📋 Détail des classes:');
    this.classes.forEach((classe, index) => {
      console.log(`${index + 1}. ID: ${classe.id}, Nom: ${classe.nom}, Niveau: ${classe.niveau}`);
    });
    
    console.log('\n📋 Détail des affectations:');
    this.affectations.forEach((affectation, index) => {
      const enseignant = this.enseignants.find(e => e.id === affectation.enseignant_id);
      const matiere = this.matieres.find(m => m.id === affectation.matiere_id);
      const classe = this.classes.find(c => c.id === affectation.classe_id);
      
      console.log(`${index + 1}. ID: ${affectation.id}`);
      console.log(`   Enseignant: ${enseignant ? enseignant.nom + ' ' + enseignant.prenom : 'Non trouvé'} (ID: ${affectation.enseignant_id})`);
      console.log(`   Matière: ${matiere ? matiere.nom : 'Non trouvée'} (ID: ${affectation.matiere_id})`);
      console.log(`   Classe: ${classe ? classe.nom : 'Non trouvée'} (ID: ${affectation.classe_id})`);
    });
    
    // Afficher un résumé dans une alerte
    const message = `
DIAGNOSTIC DES DONNÉES:

📊 État des données:
- Enseignants: ${this.enseignants.length}
- Classes: ${this.classes.length}
- Matières: ${this.matieres.length}
- Affectations: ${this.affectations.length}

🔍 Vérifications:
- Matières chargées: ${this.matieres.length > 0 ? '✅' : '❌'}
- Classes chargées: ${this.classes.length > 0 ? '✅' : '❌'}
- Enseignants chargés: ${this.enseignants.length > 0 ? '✅' : '❌'}

📋 Matières disponibles:
${this.matieres.map(m => `- ID ${m.id}: ${m.nom}`).join('\n')}

📋 Classes disponibles:
${this.classes.map(c => `- ID ${c.id}: ${c.nom}`).join('\n')}
    `;
    
    alert(message);
  }

  openForm(): void {
    this.showForm = true;
    this.editingEnseignant = null;
    this.resetFormData();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingEnseignant = null;
    this.resetFormData();
  }

  resetFormData(): void {
    this.enseignantFormData = {
      nom: '',
      prenom: '',
      email: '',
      specialite: '',
      date_embauche: '',
      statut: '',
      mot_de_passe: ''
    };
    this.errorMessage = '';
  }

  editEnseignant(enseignant: any): void {
    this.editingEnseignant = enseignant;
    this.enseignantFormData = {
      nom: enseignant.nom || '',
      prenom: enseignant.prenom || '',
      email: enseignant.email || '',
      specialite: enseignant.specialite || '',
      date_embauche: enseignant.date_embauche || '',
      statut: enseignant.statut || '',
      mot_de_passe: ''
    };
    this.showForm = true;
    this.errorMessage = '';
  }

  affecterClasses(enseignant: any): void {
    console.log('=== OUVERTURE MODAL D\'AFFECTATION ===');
    console.log('Enseignant sélectionné pour affectation:', enseignant);
    console.log('ID de l\'enseignant:', enseignant.id);
    console.log('Matières disponibles:', this.matieres.length);
    console.log('Classes disponibles:', this.classes.length);
    
    // Vérifier que les données sont chargées
    if (this.matieres.length === 0) {
      console.log('Rechargement des matières...');
      this.loadMatieres();
      setTimeout(() => {
        if (this.matieres.length === 0) {
          alert('Aucune matière disponible. Veuillez d\'abord créer des matières.');
          return;
        }
        this.ouvrirModalAffectation(enseignant);
      }, 1000);
      return;
    }
    
    if (this.classes.length === 0) {
      console.log('Rechargement des classes...');
      this.loadClasses();
      setTimeout(() => {
        if (this.classes.length === 0) {
          alert('Aucune classe disponible. Veuillez d\'abord créer des classes.');
          return;
        }
        this.ouvrirModalAffectation(enseignant);
      }, 1000);
      return;
    }
    
    this.ouvrirModalAffectation(enseignant);
  }

  private ouvrirModalAffectation(enseignant: any): void {
    console.log('Ouverture du modal avec données chargées:');
    console.log('Matières:', this.matieres.map(m => ({ id: m.id, nom: m.nom })));
    console.log('Classes:', this.classes.map(c => ({ id: c.id, nom: c.nom })));
    
    this.selectedEnseignant = enseignant;
    this.affectationFormData.enseignant_id = enseignant.id;
    this.affectationFormData.matiere_id = 0;
    this.affectationFormData.classe_id = 0;
    this.showAffectationModal = true;
    
    // Forcer la synchronisation des données dans le modal
    this.synchroniserDonneesModal();
    
    // Charger les affectations actuelles de l'enseignant
    this.affectationService.getAffectationsByEnseignant(enseignant.id).subscribe({
      next: (affectations) => {
        console.log('Affectations actuelles de l\'enseignant:', affectations);
        // Pré-remplir le formulaire avec la première affectation si elle existe
        if (affectations.length > 0) {
          const premiereAffectation = affectations[0];
          this.affectationFormData.matiere_id = premiereAffectation.matiere_id;
          this.affectationFormData.classe_id = premiereAffectation.classe_id;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des affectations:', err);
      }
    });
  }

  private synchroniserDonneesModal(): void {
    console.log('Synchronisation des données pour le modal...');
    
    // Recharger les matières et classes pour s'assurer qu'elles sont à jour
    this.matiereService.getMatieres().subscribe({
      next: (matieres) => {
        this.matieres = matieres;
        console.log('Matières synchronisées pour le modal:', this.matieres.map(m => ({ id: m.id, nom: m.nom })));
      },
      error: (err) => {
        console.error('Erreur lors de la synchronisation des matières:', err);
      }
    });
    
    this.classeService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        console.log('Classes synchronisées pour le modal:', this.classes.map(c => ({ id: c.id, nom: c.nom })));
      },
      error: (err) => {
        console.error('Erreur lors de la synchronisation des classes:', err);
      }
    });
  }

  closeAffectationModal(): void {
    this.showAffectationModal = false;
    this.selectedEnseignant = null;
    this.selectedClasses = [];
  }

  toggleClasse(classeId: number): void {
    const index = this.selectedClasses.indexOf(classeId);
    if (index > -1) {
      this.selectedClasses.splice(index, 1);
    } else {
      this.selectedClasses.push(classeId);
    }
  }

  confirmerAffectation(): void {
    if (!this.selectedEnseignant) {
      alert('Aucun enseignant sélectionné.');
      return;
    }

    // Validation
    if (!this.affectationFormData.matiere_id || !this.affectationFormData.classe_id) {
      alert('Veuillez sélectionner une matière et une classe.');
      return;
    }

    console.log('=== CONFIRMATION D\'AFFECTATION ===');
    console.log('Données d\'affectation:', this.affectationFormData);
    console.log('Matières disponibles:', this.matieres.map(m => ({ id: m.id, nom: m.nom })));
    console.log('Classes disponibles:', this.classes.map(c => ({ id: c.id, nom: c.nom })));

    // Vérification en temps réel - recharger les données avant de vérifier
    this.verifierEtConfirmerAffectation();
  }

  private verifierEtConfirmerAffectation(): void {
    // Recharger les données avant de vérifier
    console.log('Rechargement des données avant vérification...');
    
    // Recharger les matières
    this.matiereService.getMatieres().subscribe({
      next: (matieres) => {
        this.matieres = matieres;
        console.log('Matières rechargées:', this.matieres.map(m => ({ id: m.id, nom: m.nom })));
        
        // Recharger les classes
        this.classeService.getClasses().subscribe({
          next: (classes) => {
            this.classes = classes;
            console.log('Classes rechargées:', this.classes.map(c => ({ id: c.id, nom: c.nom })));
            
            // Maintenant vérifier avec les données fraîches
            this.verifierAffectationAvecDonneesFraiches();
          },
          error: (err) => {
            console.error('Erreur lors du rechargement des classes:', err);
            this.verifierAffectationAvecDonneesFraiches();
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors du rechargement des matières:', err);
        this.verifierAffectationAvecDonneesFraiches();
      }
    });
  }

  private verifierAffectationAvecDonneesFraiches(): void {
    console.log('=== VÉRIFICATION AVEC DONNÉES FRAÎCHES ===');
    console.log('Matière ID recherchée:', this.affectationFormData.matiere_id);
    console.log('Classe ID recherchée:', this.affectationFormData.classe_id);
    console.log('Matières disponibles après rechargement:', this.matieres.map(m => ({ id: m.id, nom: m.nom })));
    console.log('Classes disponibles après rechargement:', this.classes.map(c => ({ id: c.id, nom: c.nom })));

    // Vérifier que les données existent avec les données fraîches
    const matiere = this.matieres.find(m => m.id === this.affectationFormData.matiere_id);
    const classe = this.classes.find(c => c.id === this.affectationFormData.classe_id);
    
    if (!matiere) {
      console.error(`❌ Matière avec ID ${this.affectationFormData.matiere_id} non trouvée après rechargement.`);
      console.log('Matières disponibles:', this.matieres);
      
      const message = `
Matière avec ID ${this.affectationFormData.matiere_id} non trouvée.

Matières disponibles:
${this.matieres.map(m => `- ID ${m.id}: ${m.nom}`).join('\n')}

Veuillez:
1. Vérifier que la matière existe dans votre base de données
2. Actualiser la page et réessayer
3. Ou sélectionner une autre matière
      `;
      
      alert(message);
      return;
    }
    
    if (!classe) {
      console.error(`❌ Classe avec ID ${this.affectationFormData.classe_id} non trouvée après rechargement.`);
      console.log('Classes disponibles:', this.classes);
      
      const message = `
Classe avec ID ${this.affectationFormData.classe_id} non trouvée.

Classes disponibles:
${this.classes.map(c => `- ID ${c.id}: ${c.nom}`).join('\n')}

Veuillez:
1. Vérifier que la classe existe dans votre base de données
2. Actualiser la page et réessayer
3. Ou sélectionner une autre classe
      `;
      
      alert(message);
      return;
    }

    console.log('✅ Matière trouvée:', matiere);
    console.log('✅ Classe trouvée:', classe);
    console.log('Enseignant sélectionné:', this.selectedEnseignant);

    // Procéder à l'affectation
    this.procederAffectation(matiere, classe);
  }

  private procederAffectation(matiere: any, classe: any): void {
    this.savingAffectation = true;
    
    console.log('Envoi de l\'affectation:', this.affectationFormData);
    
    // Utiliser le service d'affectation avec votre endpoint
    this.affectationService.createAffectation(this.affectationFormData).subscribe({
      next: (response) => {
        console.log('Affectation créée avec succès:', response);
        
        // Recharger les affectations et mettre à jour l'affichage
        this.loadAffectations();
        
        // Forcer le rechargement complet après un délai
        setTimeout(() => {
          this.updateEnseignantAffectations();
          this.calculateStats();
        }, 1000);
        
        this.closeAffectationModal();
        this.savingAffectation = false;
        alert(`✅ Affectation créée avec succès!\n${matiere.nom} → ${classe.nom} pour ${this.selectedEnseignant.nom} ${this.selectedEnseignant.prenom}`);
      },
      error: (err) => {
        console.error('Erreur lors de l\'affectation:', err);
        console.log('Détails complets de l\'erreur:', {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
          message: err.error?.message,
          errors: err.error?.errors
        });
        this.savingAffectation = false;
        
        // Gestion des erreurs spécifiques
        if (err.status === 404) {
          alert('Enseignant, matière ou classe non trouvé.');
        } else if (err.status === 422) {
          alert('Données invalides pour l\'affectation: ' + (err.error?.message || ''));
        } else if (err.status === 500) {
          alert('Erreur serveur lors de l\'affectation');
        } else {
          alert('Erreur lors de l\'affectation: ' + (err.error?.message || 'Erreur inconnue'));
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loading) return;

    // Validation
    if (!this.enseignantFormData.nom.trim() || !this.enseignantFormData.prenom.trim() || !this.enseignantFormData.email.trim()) {
      this.errorMessage = 'Le nom, prénom et email sont obligatoires.';
      return;
    }

    if (!this.enseignantFormData.specialite.trim()) {
      this.errorMessage = 'La spécialité est obligatoire.';
      return;
    }

    if (!this.enseignantFormData.date_embauche) {
      this.errorMessage = 'La date d\'embauche est obligatoire.';
      return;
    }

    if (!this.enseignantFormData.statut) {
      this.errorMessage = 'Le statut est obligatoire.';
      return;
    }

    // Validation anti-doublon
    const nom = this.enseignantFormData.nom.trim().toLowerCase();
    const prenom = this.enseignantFormData.prenom.trim().toLowerCase();
    const email = this.enseignantFormData.email.trim().toLowerCase();
    
    const doublon = this.enseignants.some(enseignant => {
      const sameName = enseignant.nom?.toLowerCase() === nom;
      const samePrenom = enseignant.prenom?.toLowerCase() === prenom;
      const sameEmail = enseignant.email?.toLowerCase() === email;
      const isDifferent = !this.editingEnseignant || enseignant.id !== this.editingEnseignant.id;
      return sameName && samePrenom && sameEmail && isDifferent;
    });

    if (doublon) {
      this.errorMessage = 'Un enseignant avec ce nom, prénom et email existe déjà.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const enseignantToSend: any = {
      nom: this.enseignantFormData.nom.trim(),
      prenom: this.enseignantFormData.prenom.trim(),
      email: this.enseignantFormData.email.trim(),
      specialite: this.enseignantFormData.specialite.trim(),
      date_embauche: this.enseignantFormData.date_embauche,
      statut: this.enseignantFormData.statut
    };

    // Ajouter le mot de passe seulement s'il est fourni
    if (this.enseignantFormData.mot_de_passe.trim()) {
      enseignantToSend.mot_de_passe = this.enseignantFormData.mot_de_passe;
    }

    console.log('Données à envoyer:', enseignantToSend);

    if (this.editingEnseignant) {
      this.enseignantService.updateEnseignant(this.editingEnseignant.id, enseignantToSend).subscribe({
        next: () => {
          this.loadEnseignants();
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.error('Erreur modification:', err);
          
          if (err.error?.errors) {
            // Erreurs de validation Laravel
            const errors = err.error.errors;
            const errorMessages = Object.keys(errors).map(key => 
              `${key}: ${errors[key].join(', ')}`
            ).join('\n');
            this.errorMessage = `Erreurs de validation:\n${errorMessages}`;
          } else if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Erreur lors de la modification';
          }
        }
      });
    } else {
      this.enseignantService.createEnseignant(enseignantToSend).subscribe({
        next: () => {
          this.loadEnseignants();
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          console.error('Erreur ajout:', err);
          
          if (err.error?.errors) {
            // Erreurs de validation Laravel
            const errors = err.error.errors;
            const errorMessages = Object.keys(errors).map(key => 
              `${key}: ${errors[key].join(', ')}`
            ).join('\n');
            this.errorMessage = `Erreurs de validation:\n${errorMessages}`;
          } else if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Erreur lors de l\'ajout';
          }
        }
      });
    }
  }

  deleteEnseignant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ? Cette action est irréversible.')) {
      this.enseignantService.deleteEnseignant(id).subscribe({
        next: () => {
          this.loadEnseignants();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          alert('Erreur lors de la suppression de l\'enseignant');
        }
      });
    }
  }

  getEnseignantsAffectesCount(): number {
    return this.enseignants.filter(e => this.getAffectationsEnseignant(e.id).length > 0).length;
  }

  getMatieresUniquesCount(): number {
    return [...new Set(this.affectations.map(a => a.matiere_id))].length;
  }

  getClassesUniquesCount(): number {
    return [...new Set(this.affectations.map(a => a.classe_id))].length;
  }
} 