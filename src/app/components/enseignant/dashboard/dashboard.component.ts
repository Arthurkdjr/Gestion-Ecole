import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enseignant-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de Bord Enseignant</h1>
      <p>Module en cours de développement...</p>
    </div>
  `,
  styles: [`
    .dashboard-container {
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
export class DashboardComponent {} 