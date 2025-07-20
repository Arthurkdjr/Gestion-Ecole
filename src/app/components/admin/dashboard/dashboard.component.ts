import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EleveService } from '../../../services/eleve.service';
import { BulletinService } from '../../../services/bulletin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Tableau de Bord</h1>
        <p>Vue d'ensemble de l'établissement</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ stats.totalEleves }}</h3>
            <p>Élèves inscrits</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🏫</div>
          <div class="stat-content">
            <h3>{{ stats.totalClasses }}</h3>
            <p>Classes</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👨‍🏫</div>
          <div class="stat-content">
            <h3>{{ stats.totalEnseignants }}</h3>
            <p>Enseignants</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ stats.totalMatieres }}</h3>
            <p>Matières</p>
          </div>
        </div>
      </div>
      
      <div class="dashboard-sections">
        <div class="section">
          <h2>Statistiques récentes</h2>
          <div class="recent-stats">
            <div class="stat-item">
              <span class="label">Bulletins générés ce mois:</span>
              <span class="value">{{ stats.bulletinsGeneres }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Notes saisies ce mois:</span>
              <span class="value">{{ stats.notesSaisies }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Moyenne générale:</span>
              <span class="value">{{ stats.moyenneGenerale | number:'1.2-2' }}/20</span>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>Actions rapides</h2>
          <div class="quick-actions">
            <button class="action-btn">
              <span class="icon">➕</span>
              Ajouter un élève
            </button>
            <button class="action-btn">
              <span class="icon">📋</span>
              Générer bulletins
            </button>
            <button class="action-btn">
              <span class="icon">📊</span>
              Voir statistiques
            </button>
            <button class="action-btn">
              <span class="icon">📧</span>
              Envoyer notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      margin-bottom: 30px;
    }
    
    .dashboard-header h1 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: 600;
    }
    
    .dashboard-header p {
      color: #7f8c8d;
      margin: 0;
      font-size: 16px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      transition: transform 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .stat-icon {
      font-size: 40px;
      margin-right: 20px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }
    
    .stat-content h3 {
      margin: 0 0 5px 0;
      font-size: 28px;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .stat-content p {
      margin: 0;
      color: #7f8c8d;
      font-size: 14px;
    }
    
    .dashboard-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    
    .section {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .section h2 {
      margin: 0 0 20px 0;
      color: #2c3e50;
      font-size: 20px;
      font-weight: 600;
    }
    
    .recent-stats {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .stat-item:last-child {
      border-bottom: none;
    }
    
    .stat-item .label {
      color: #7f8c8d;
      font-size: 14px;
    }
    
    .stat-item .value {
      font-weight: 600;
      color: #2c3e50;
      font-size: 16px;
    }
    
    .quick-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: transform 0.2s ease;
    }
    
    .action-btn:hover {
      transform: translateY(-2px);
    }
    
    .action-btn .icon {
      font-size: 16px;
    }
    
    @media (max-width: 768px) {
      .dashboard-sections {
        grid-template-columns: 1fr;
      }
      
      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    totalEleves: 0,
    totalClasses: 0,
    totalEnseignants: 0,
    totalMatieres: 0,
    bulletinsGeneres: 0,
    notesSaisies: 0,
    moyenneGenerale: 0
  };

  constructor(
    private eleveService: EleveService,
    private bulletinService: BulletinService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    // Charger les statistiques depuis l'API
    this.eleveService.getEleves().subscribe(eleves => {
      this.stats.totalEleves = eleves.length;
    });

    // Simuler d'autres données pour l'instant
    this.stats.totalClasses = 12;
    this.stats.totalEnseignants = 25;
    this.stats.totalMatieres = 15;
    this.stats.bulletinsGeneres = 45;
    this.stats.notesSaisies = 320;
    this.stats.moyenneGenerale = 14.5;
  }
} 