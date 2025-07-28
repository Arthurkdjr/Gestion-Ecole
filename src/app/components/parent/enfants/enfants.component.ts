import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enfants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="enfants-container">
      <div class="page-header">
        <h1>Mes Enfants</h1>
        <p>Suivez la progression scolaire de vos enfants</p>
      </div>
      
      <div class="enfants-grid">
        <div class="enfant-card" *ngFor="let enfant of enfants">
          <div class="enfant-header">
            <div class="enfant-avatar">
              {{ getInitials(enfant.prenom, enfant.nom) }}
            </div>
            <div class="enfant-info">
              <h3>{{ enfant.prenom }} {{ enfant.nom }}</h3>
              <p class="classe">{{ enfant.classe }}</p>
              <p class="age">{{ enfant.age }} ans</p>
            </div>
            <div class="enfant-status" [class]="enfant.status">
              {{ enfant.status }}
            </div>
          </div>
          
          <div class="enfant-stats">
            <div class="stat">
              <span class="stat-value">{{ enfant.moyenne }}</span>
              <span class="stat-label">Moyenne</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ enfant.rang }}</span>
              <span class="stat-label">Rang</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ enfant.absences }}</span>
              <span class="stat-label">Absences</span>
            </div>
          </div>
          
          <div class="enfant-actions">
            <button class="btn btn-primary">Voir Bulletin</button>
            <button class="btn btn-secondary">Voir Notes</button>
          </div>
        </div>
      </div>
      
      <div class="add-enfant">
        <button class="btn-add">
          <span class="icon">+</span>
          Ajouter un enfant
        </button>
      </div>
    </div>
  `,
  styles: [`
    .enfants-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .page-header h1 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 2.5rem;
      font-weight: 700;
    }
    
    .page-header p {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.1rem;
    }
    
    .enfants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }
    
    .enfant-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #e9ecef;
    }
    
    .enfant-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
    
    .enfant-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .enfant-avatar {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      margin-right: 15px;
    }
    
    .enfant-info {
      flex: 1;
    }
    
    .enfant-info h3 {
      margin: 0 0 5px 0;
      color: #2c3e50;
      font-size: 1.3rem;
      font-weight: 600;
    }
    
    .enfant-info .classe {
      margin: 0 0 3px 0;
      color: #3498db;
      font-weight: 500;
      font-size: 0.95rem;
    }
    
    .enfant-info .age {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .enfant-status {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .enfant-status.actif {
      background: #d4edda;
      color: #155724;
    }
    
    .enfant-status.inactif {
      background: #f8d7da;
      color: #721c24;
    }
    
    .enfant-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      padding: 15px 0;
      border-top: 1px solid #e9ecef;
      border-bottom: 1px solid #e9ecef;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 0.8rem;
      color: #7f8c8d;
      text-transform: uppercase;
      font-weight: 500;
    }
    
    .enfant-actions {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
      color: white;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
    }
    
    .btn-secondary {
      background: #ecf0f1;
      color: #2c3e50;
    }
    
    .btn-secondary:hover {
      background: #d5dbdb;
      transform: translateY(-2px);
    }
    
    .add-enfant {
      text-align: center;
    }
    
    .btn-add {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
    }
    
    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
    }
    
    .btn-add .icon {
      font-size: 1.2rem;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .enfants-container {
        padding: 20px;
      }
      
      .enfants-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .enfant-actions {
        flex-direction: column;
      }
      
      .page-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class EnfantsComponent {
  enfants = [
    {
      prenom: 'Marie',
      nom: 'Dupont',
      classe: '6ème A',
      age: 12,
      status: 'actif',
      moyenne: 15.8,
      rang: 3,
      absences: 2
    },
    {
      prenom: 'Thomas',
      nom: 'Dupont',
      classe: '4ème B',
      age: 14,
      status: 'actif',
      moyenne: 14.2,
      rang: 8,
      absences: 1
    },
    {
      prenom: 'Emma',
      nom: 'Dupont',
      classe: '2nde',
      age: 16,
      status: 'actif',
      moyenne: 16.5,
      rang: 1,
      absences: 0
    }
  ];

  getInitials(prenom: string, nom: string): string {
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  }
} 