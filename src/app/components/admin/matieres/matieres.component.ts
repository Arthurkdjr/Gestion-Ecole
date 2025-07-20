import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="matieres-container">
      <h1>Gestion des Matières</h1>
      <p>Module en cours de développement...</p>
    </div>
  `,
  styles: [`
    .matieres-container {
      padding: 30px;
      text-align: center;
    }
    
    h1 {
      color: #2c3e50;
      margin-bottom: 20px;
    }
    
    p {
      color: #7f8c8d;
      font-size: 18px;
    }
  `]
})
export class MatieresComponent {} 