import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../../services/note.service';
import { MatiereService } from '../../../services/matiere.service';
import { EleveService } from '../../../services/eleve.service';

@Component({
  selector: 'app-notes-saisie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="notes-container">
      <div class="header">
        <button (click)="retour()" class="btn-back">
          <span class="btn-icon">←</span>
          Retour
        </button>
        <h1>Saisie des notes</h1>
        <div class="eleve-info" *ngIf="eleve">
          <h2>{{ eleve.nom }} {{ eleve.prenom }}</h2>
          <p class="eleve-details">
            <span class="detail-item">Classe: {{ eleve.classe?.nom || 'Non assignée' }}</span>
            <span class="detail-item">Email: {{ eleve.email }}</span>
          </p>
        </div>
      </div>

      <div class="notes-content">
        <div class="notes-form" *ngIf="matieres.length > 0; else noMatieres">
          <div class="form-header">
            <h3>Notes par matière</h3>
            <p class="form-subtitle">Saisissez les notes sur 20 pour chaque matière</p>
          </div>

          <form (ngSubmit)="onSubmit()" #notesForm="ngForm">
            <div class="matieres-grid">
              <div *ngFor="let matiere of matieres" class="matiere-card">
                <div class="matiere-header">
                  <h4>{{ matiere.nom }}</h4>
                  <span class="matiere-code">{{ matiere.code }}</span>
                  <span class="coefficient-badge">Coef: {{ matiere.coefficient }}</span>
                </div>
                
                <div class="note-input-group">
                  <label [for]="'note_' + matiere.id">Note sur 20</label>
                  <div class="input-wrapper">
                    <input 
                      type="number" 
                      [id]="'note_' + matiere.id"
                      min="0" 
                      max="20" 
                      step="0.01" 
                      [(ngModel)]="notes[matiere.id]" 
                      [name]="'note_' + matiere.id"
                      class="note-input"
                      [class.invalid]="isInvalidNote(matiere.id)"
                      (blur)="validateNote(matiere.id)"
                      placeholder="0.00"
                      required>
                    <span class="input-suffix">/20</span>
                  </div>
                  <div class="note-validation" *ngIf="noteErrors[matiere.id]">
                    <span class="error-text">{{ noteErrors[matiere.id] }}</span>
                  </div>
                </div>

                <div class="matiere-footer">
                  <div class="note-preview" *ngIf="notes[matiere.id]">
                    <span class="preview-label">Note saisie:</span>
                    <span class="preview-value" [class.excellent]="notes[matiere.id] >= 16" 
                          [class.bon]="notes[matiere.id] >= 14 && notes[matiere.id] < 16"
                          [class.moyen]="notes[matiere.id] >= 10 && notes[matiere.id] < 14"
                          [class.insuffisant]="notes[matiere.id] < 10">
                      {{ notes[matiere.id] }}/20
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-summary">
              <div class="summary-stats">
                <div class="stat-item">
                  <span class="stat-label">Matières:</span>
                  <span class="stat-value">{{ matieres.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Notes saisies:</span>
                  <span class="stat-value">{{ getNotesSaisies() }}/{{ matieres.length }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Moyenne:</span>
                  <span class="stat-value">{{ getMoyenne() | number:'1.2-2' }}/20</span>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" (click)="resetForm()" class="btn-secondary">
                <span class="btn-icon">🔄</span>
                Réinitialiser
              </button>
              <button type="submit" [disabled]="!isFormValid() || loading" class="btn-primary">
                <span class="btn-icon" *ngIf="!loading">💾</span>
                <span class="loading-spinner" *ngIf="loading"></span>
                {{ loading ? 'Enregistrement...' : 'Enregistrer les notes' }}
              </button>
            </div>
          </form>
        </div>

        <ng-template #noMatieres>
          <div class="no-data">
            <div class="no-data-icon">📚</div>
            <h3>Aucune matière disponible</h3>
            <p>Il n'y a pas de matières assignées pour la saisie de notes.</p>
          </div>
        </ng-template>
      </div>

      <!-- Messages de feedback -->
      <div class="feedback-messages">
        <div *ngIf="successMessage" class="success-message">
          <span class="message-icon">✅</span>
          {{ successMessage }}
        </div>
        <div *ngIf="errorMessage" class="error-message">
          <span class="message-icon">❌</span>
          {{ errorMessage }}
        </div>
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
      margin-bottom: 30px;
    }

    .btn-back {
      background: transparent;
      border: 1px solid #e1e5e9;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 20px;
      transition: all 0.2s;
    }

    .btn-back:hover {
      background: #f8f9fa;
      border-color: #667eea;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 15px;
      font-size: 2rem;
    }

    .eleve-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .eleve-info h2 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 1.5rem;
    }

    .eleve-details {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin: 0;
    }

    .detail-item {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .notes-content {
      margin-bottom: 30px;
    }

    .form-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .form-header h3 {
      color: #2c3e50;
      margin-bottom: 8px;
      font-size: 1.3rem;
    }

    .form-subtitle {
      color: #7f8c8d;
      margin: 0;
    }

    .matieres-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .matiere-card {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 10px;
      padding: 20px;
      transition: all 0.2s;
    }

    .matiere-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .matiere-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .matiere-header h4 {
      color: #2c3e50;
      margin: 0;
      font-size: 1.1rem;
    }

    .matiere-code {
      background: #667eea;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .coefficient-badge {
      background: #27ae60;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .note-input-group {
      margin-bottom: 15px;
    }

    .note-input-group label {
      display: block;
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-bottom: 5px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .note-input {
      flex: 1;
      padding: 10px 40px 10px 12px;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .note-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .note-input.invalid {
      border-color: #e74c3c;
    }

    .input-suffix {
      position: absolute;
      right: 12px;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .note-validation {
      margin-top: 5px;
    }

    .error-text {
      color: #e74c3c;
      font-size: 0.8rem;
    }

    .matiere-footer {
      margin-top: 15px;
    }

    .note-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .preview-label {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .preview-value {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .preview-value.excellent { color: #27ae60; }
    .preview-value.bon { color: #f39c12; }
    .preview-value.moyen { color: #e67e22; }
    .preview-value.insuffisant { color: #e74c3c; }

    .form-summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-label {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .stat-value {
      color: #2c3e50;
      font-weight: 500;
      font-size: 1.1rem;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }

    .btn-icon {
      font-size: 1rem;
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

    .feedback-messages {
      margin-top: 20px;
    }

    .success-message, .error-message {
      padding: 15px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .message-icon {
      font-size: 1.2rem;
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

    @media (max-width: 768px) {
      .matieres-grid {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .eleve-details {
        flex-direction: column;
        gap: 5px;
      }
    }
  `]
})
export class NotesComponent implements OnInit {
  eleveId: number | null = null;
  eleve: any = null;
  matieres: any[] = [];
  notes: { [matiereId: number]: number } = {};
  noteErrors: { [matiereId: number]: string } = {};
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private matiereService: MatiereService,
    private eleveService: EleveService
  ) {}

  ngOnInit(): void {
    this.eleveId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eleveId) {
      this.loadEleve();
      this.loadMatieres();
    }
  }

  loadEleve(): void {
    this.eleveService.getEleve(this.eleveId!).subscribe({
      next: (eleve) => this.eleve = eleve,
      error: (err) => {
        console.error('Erreur lors du chargement de l\'élève:', err);
        this.errorMessage = 'Impossible de charger les informations de l\'élève';
      }
    });
  }

  loadMatieres(): void {
    this.matiereService.getMatieres().subscribe({
      next: (matieres) => {
        this.matieres = matieres;
        // Initialiser les notes vides
        matieres.forEach(matiere => {
          this.notes[matiere.id] = 0;
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des matières:', err);
        this.matieres = [];
        this.errorMessage = 'Impossible de charger les matières';
      }
    });
  }

  validateNote(matiereId: number): void {
    const note = this.notes[matiereId];
    delete this.noteErrors[matiereId];

    if (note === null || note === undefined || note === 0) {
      this.noteErrors[matiereId] = 'La note est requise';
      return;
    }

    if (note < 0 || note > 20) {
      this.noteErrors[matiereId] = 'La note doit être comprise entre 0 et 20';
      return;
    }

    if (note % 0.25 !== 0) {
      this.noteErrors[matiereId] = 'La note doit être un multiple de 0.25';
      return;
    }
  }

  isInvalidNote(matiereId: number): boolean {
    return !!this.noteErrors[matiereId];
  }

  isFormValid(): boolean {
    return this.matieres.length > 0 && 
           this.matieres.every(matiere => 
             this.notes[matiere.id] > 0 && 
             this.notes[matiere.id] <= 20 && 
             !this.noteErrors[matiere.id]
           );
  }

  getNotesSaisies(): number {
    return this.matieres.filter(matiere => 
      this.notes[matiere.id] > 0 && this.notes[matiere.id] <= 20
    ).length;
  }

  getMoyenne(): number {
    const notesValides = this.matieres
      .filter(matiere => this.notes[matiere.id] > 0 && this.notes[matiere.id] <= 20)
      .map(matiere => this.notes[matiere.id]);
    
    if (notesValides.length === 0) return 0;
    return notesValides.reduce((sum, note) => sum + note, 0) / notesValides.length;
  }

  resetForm(): void {
    this.matieres.forEach(matiere => {
      this.notes[matiere.id] = 0;
    });
    this.noteErrors = {};
    this.successMessage = '';
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.eleveId || !this.isFormValid()) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const notesArray = this.matieres
      .filter(matiere => this.notes[matiere.id] > 0 && this.notes[matiere.id] <= 20)
      .map(matiere => ({
        matiere_id: matiere.id,
        note: this.notes[matiere.id]
      }));

    this.noteService.saveNotes(this.eleveId, notesArray).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Notes enregistrées avec succès !';
        this.errorMessage = '';
      },
      error: (err: any) => {
        this.loading = false;
        this.successMessage = '';
        this.errorMessage = err.error?.message || 'Erreur lors de l\'enregistrement des notes';
        console.error('Erreur lors de l\'enregistrement:', err);
      }
    });
  }

  retour(): void {
    this.router.navigate(['/enseignant/classes']);
  }
}