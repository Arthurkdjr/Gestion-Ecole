import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AffectationService } from '../../../services/affectation.service';
import { EnseignantService } from '../../../services/enseignant.service';
import { MatiereService } from '../../../services/matiere.service';
import { ClasseService } from '../../../services/classe.service';

@Component({
  selector: 'app-affectations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="affectations-container">
      <h1>Gestion des Affectations</h1>
      <div class="affectation-form">
        <select [(ngModel)]="form.enseignant_id" class="form-control">
          <option value="">Sélectionner un enseignant</option>
          <option *ngFor="let enseignant of enseignants" [value]="enseignant.id">
            {{ enseignant.nom }} {{ enseignant.prenom }} [ID: {{ enseignant.id }}]
          </option>
        </select>
        <select [(ngModel)]="form.matiere_id" class="form-control">
          <option value="">Sélectionner une matière</option>
          <option *ngFor="let matiere of matieres" [value]="matiere.id">
            {{ matiere.nom }} ({{ matiere.niveau }}) [ID: {{ matiere.id }}]
          </option>
        </select>
        <select [(ngModel)]="form.classe_id" class="form-control">
          <option value="">Sélectionner une classe</option>
          <option *ngFor="let classe of classes" [value]="classe.id">
            {{ classe.nom }} - {{ classe.niveau }} [ID: {{ classe.id }}]
          </option>
        </select>
        <button (click)="affecter()" [disabled]="!form.enseignant_id || !form.matiere_id || !form.classe_id || loading" class="btn btn-primary">
          Affecter
        </button>
      </div>
      <div class="affectations-list">
        <h2>Affectations existantes</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Enseignant</th>
              <th>Matière</th>
              <th>Classe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let aff of affectations">
              <td>{{ getEnseignantName(aff.enseignant_id) }}</td>
              <td>{{ getMatiereName(aff.matiere_id) }}</td>
              <td>{{ getClasseName(aff.classe_id) }}</td>
              <td>
                <button (click)="supprimer(aff.id)" class="btn btn-danger btn-sm">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .affectations-container { max-width: 900px; margin: 0 auto; padding: 30px; }
    .affectation-form { display: flex; gap: 15px; margin-bottom: 30px; }
    .form-control { padding: 10px; border-radius: 6px; border: 1px solid #ccc; min-width: 180px; }
    .btn-primary { background: #667eea; color: white; border: none; border-radius: 6px; padding: 10px 20px; cursor: pointer; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .affectations-list { margin-top: 40px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; }
    .btn-danger { background: #e74c3c; color: white; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer; }
    .btn-danger:hover { background: #c0392b; }
  `]
})
export class AffectationsComponent implements OnInit {
  enseignants: any[] = [];
  matieres: any[] = [];
  classes: any[] = [];
  affectations: any[] = [];
  form = { enseignant_id: '', matiere_id: '', classe_id: '' };
  loading = false;

  constructor(
    private affectationService: AffectationService,
    private enseignantService: EnseignantService,
    private matiereService: MatiereService,
    private classeService: ClasseService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.enseignantService.getEnseignants().subscribe(e => this.enseignants = e);
    this.matiereService.getMatieres().subscribe(m => this.matieres = m);
    this.classeService.getClasses().subscribe(c => this.classes = c);
    this.affectationService.getAffectations().subscribe(a => this.affectations = a);
  }

  affecter(): void {
    if (!this.form.enseignant_id || !this.form.matiere_id || !this.form.classe_id) return;
    this.loading = true;
    this.affectationService.createAffectation({
      enseignant_id: Number(this.form.enseignant_id),
      matiere_id: Number(this.form.matiere_id),
      classe_id: Number(this.form.classe_id)
    }).subscribe({
      next: () => {
        this.loadAll();
        this.loading = false;
        this.form = { enseignant_id: '', matiere_id: '', classe_id: '' };
        alert('Affectation créée avec succès !');
      },
      error: (err) => {
        this.loading = false;
        alert('Erreur lors de la création de l\'affectation.');
        console.error(err);
      }
    });
  }

  supprimer(id: number): void {
    if (!confirm('Supprimer cette affectation ?')) return;
    this.affectationService.deleteAffectation(id).subscribe({
      next: () => {
        this.loadAll();
        alert('Affectation supprimée.');
      },
      error: (err) => {
        alert('Erreur lors de la suppression.');
        console.error(err);
      }
    });
  }

  getEnseignantName(id: number): string {
    const e = this.enseignants.find(x => x.id === id);
    return e ? `${e.nom} ${e.prenom}` : 'Inconnu';
  }
  getMatiereName(id: number): string {
    const m = this.matieres.find(x => x.id === id);
    return m ? `${m.nom} (${m.niveau})` : 'Inconnue';
  }
  getClasseName(id: number): string {
    const c = this.classes.find(x => x.id === id);
    return c ? `${c.nom} - ${c.niveau}` : 'Inconnue';
  }
} 