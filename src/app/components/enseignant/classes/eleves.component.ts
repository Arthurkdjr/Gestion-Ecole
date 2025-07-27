import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EleveService } from '../../../services/eleve.service';

@Component({
  selector: 'app-enseignant-classe-eleves',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="eleves-container">
      <h1>Élèves de la classe {{ classeId }}</h1>
      <table *ngIf="eleves.length > 0; else noEleves" class="eleves-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let eleve of eleves">
            <td>{{ eleve.id }}</td>
            <td>{{ eleve.nom }}</td>
            <td>{{ eleve.prenom }}</td>
            <td>{{ eleve.email }}</td>
            <td>
              <button (click)="saisirNotes(eleve.id)" class="action-btn">Saisir les notes</button>
            </td>
          </tr>
        </tbody>
      </table>
      <ng-template #noEleves>
        <p>Aucun élève trouvé pour cette classe.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .eleves-container {
      padding: 30px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
    }
    .eleves-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .eleves-table th, .eleves-table td {
      border: 1px solid #e1e5e9;
      padding: 10px;
      text-align: left;
    }
    .eleves-table th {
      background: #f8f9fa;
      color: #2c3e50;
    }
    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.2s;
    }
    .action-btn:hover {
      background: #667eea;
    }
  `]
})
export class ElevesComponent implements OnInit {
  classeId: number | null = null;
  eleves: any[] = [];

  constructor(private route: ActivatedRoute, private eleveService: EleveService, private router: Router) {}

  ngOnInit(): void {
    this.classeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.classeId) {
      this.eleveService.getElevesByClasse(this.classeId).subscribe({
        next: (eleves) => this.eleves = eleves,
        error: (err) => {
          this.eleves = [];
          console.error('Erreur lors du chargement des élèves:', err);
        }
      });
    }
  }

  saisirNotes(eleveId: number): void {
    this.router.navigate([`/enseignant/eleves/${eleveId}/notes`]);
  }
} 