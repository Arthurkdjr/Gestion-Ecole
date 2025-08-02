import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BulletinService } from '../../../services/bulletin.service';

@Component({
  selector: 'app-enfants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="enfants-container">
      <div class="header">
        <h1>👨‍👩‍👧‍👦 Mes Enfants</h1>
        <p class="subtitle">Suivez la scolarité de vos enfants</p>
      </div>

      <div class="enfants-grid" *ngIf="enfants.length > 0; else noEnfants">
        <div *ngFor="let enfant of enfants" class="enfant-card">
          <div class="enfant-header">
            <div class="enfant-info">
              <h3>{{ enfant.nom }} {{ enfant.prenom }}</h3>
              <p class="enfant-details">
                <span class="detail-item">Classe: {{ enfant.classe?.nom || 'Non assignée' }}</span>
                <span class="detail-item">Niveau: {{ enfant.classe?.niveau || 'Non spécifié' }}</span>
              </p>
            </div>
            <div class="enfant-avatar">
              <span class="avatar-text">{{ enfant.nom.charAt(0) }}{{ enfant.prenom.charAt(0) }}</span>
            </div>
          </div>

          <div class="enfant-stats">
            <div class="stat-item">
              <span class="stat-label">Moyenne Générale</span>
              <span class="stat-value" [class]="getMoyenneClass(enfant.moyenne_generale)">
                {{ enfant.moyenne_generale | number:'1.2-2' }}/20
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Rang</span>
              <span class="stat-value">{{ enfant.rang || 'N/A' }}/{{ enfant.effectif || 'N/A' }}</span>
            </div>
          </div>

          <div class="enfant-bulletins" *ngIf="enfant.bulletins && enfant.bulletins.length > 0">
            <h4>📋 Bulletins disponibles</h4>
            <div class="bulletins-list">
              <div *ngFor="let bulletin of enfant.bulletins" class="bulletin-item">
                <div class="bulletin-info">
                  <span class="periode">{{ bulletin.periode }}</span>
                  <span class="moyenne">{{ bulletin.moyenne_generale | number:'1.2-2' }}/20</span>
                </div>
                <div class="bulletin-actions">
                  <button (click)="telechargerBulletin(enfant, bulletin)" class="btn-small" [disabled]="loading">
                    <span *ngIf="!loading">📥</span>
                    <span *ngIf="loading">⏳</span>
                  </button>
                  <button (click)="imprimerBulletin(enfant, bulletin)" class="btn-small" [disabled]="loading">
                    <span *ngIf="!loading">🖨️</span>
                    <span *ngIf="loading">⏳</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="enfant-actions">
            <button (click)="voirDetailEnfant(enfant)" class="btn-primary">
              👁️ Voir détails
            </button>
            <button (click)="telechargerTousBulletins(enfant)" class="btn-secondary" [disabled]="loading || !enfant.bulletins || enfant.bulletins.length === 0">
              <span *ngIf="!loading">📄 Tous les bulletins</span>
              <span *ngIf="loading">⏳ Export...</span>
            </button>
          </div>
        </div>
      </div>

      <ng-template #noEnfants>
        <div class="no-data">
          <div class="no-data-icon">👨‍👩‍👧‍👦</div>
          <h3>Aucun enfant enregistré</h3>
          <p>Vos enfants n'apparaissent pas encore dans le système. Contactez l'administration.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .enfants-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .header h1 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 2.5rem;
      font-weight: 700;
    }
    
    .header p {
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
    
    .enfant-info {
      flex: 1;
    }
    
    .enfant-info h3 {
      margin: 0 0 5px 0;
      color: #2c3e50;
      font-size: 1.3rem;
      font-weight: 600;
    }
    
    .enfant-info .enfant-details {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .enfant-info .detail-item {
      margin-right: 15px;
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
      margin-left: 15px;
    }
    
    .enfant-avatar .avatar-text {
      font-size: 1.2rem;
    }
    
    .enfant-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      padding: 15px 0;
      border-top: 1px solid #e9ecef;
      border-bottom: 1px solid #e9ecef;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-label {
      font-size: 0.8rem;
      color: #7f8c8d;
      text-transform: uppercase;
      font-weight: 500;
    }
    
    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 5px;
    }
    
    .stat-value.excellent {
      color: #27ae60;
    }
    
    .stat-value.bien {
      color: #2980b9;
    }
    
    .stat-value.assez_bien {
      color: #f39c12;
    }
    
    .stat-value.insuffisant {
      color: #e74c3c;
    }
    
    .enfant-bulletins h4 {
      margin-top: 20px;
      margin-bottom: 10px;
      color: #34495e;
      font-size: 1.1rem;
    }
    
    .bulletins-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .bulletin-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    
    .bulletin-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .bulletin-info .periode {
      font-weight: 500;
      color: #34495e;
    }
    
    .bulletin-info .moyenne {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .bulletin-actions {
      display: flex;
      gap: 10px;
    }
    
    .btn-small {
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #ecf0f1;
      color: #2c3e50;
    }
    
    .btn-small:hover {
      background: #d5dbdb;
      transform: translateY(-2px);
    }
    
    .btn-small:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .btn-small span {
      font-size: 1rem;
    }
    
    .enfant-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
      color: white;
      padding: 12px 25px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
    }
    
    .btn-secondary {
      background: #ecf0f1;
      color: #2c3e50;
      padding: 12px 25px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }
    
    .btn-secondary:hover {
      background: #d5dbdb;
      transform: translateY(-2px);
    }
    
    .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .no-data {
      text-align: center;
      padding: 50px 20px;
      color: #7f8c8d;
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
      font-size: 1rem;
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
      
      .header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class EnfantsComponent implements OnInit {
  enfants: any[] = [
    {
      id: 1,
      prenom: 'Marie',
      nom: 'Dupont',
      classe: { nom: '6ème A', niveau: 'CM2' },
      age: 12,
      status: 'actif',
      moyenne_generale: 15.8,
      rang: 3,
      effectif: 25,
      absences: 2,
      bulletins: [
        { periode: '2023-2024', moyenne_generale: 15.8 },
        { periode: '2022-2023', moyenne_generale: 14.5 }
      ]
    },
    {
      id: 2,
      prenom: 'Thomas',
      nom: 'Dupont',
      classe: { nom: '4ème B', niveau: 'CM1' },
      age: 14,
      status: 'actif',
      moyenne_generale: 14.2,
      rang: 8,
      effectif: 28,
      absences: 1,
      bulletins: [
        { periode: '2023-2024', moyenne_generale: 14.2 },
        { periode: '2022-2023', moyenne_generale: 13.0 }
      ]
    },
    {
      id: 3,
      prenom: 'Emma',
      nom: 'Dupont',
      classe: { nom: '2nde', niveau: 'Seconde' },
      age: 16,
      status: 'actif',
      moyenne_generale: 16.5,
      rang: 1,
      effectif: 30,
      absences: 0,
      bulletins: [
        { periode: '2023-2024', moyenne_generale: 16.5 },
        { periode: '2022-2023', moyenne_generale: 15.0 }
      ]
    }
  ];

  loading = false;

  constructor(private authService: AuthService, private bulletinService: BulletinService) {}

  ngOnInit(): void {
    this.loadEnfants();
  }

  loadEnfants(): void {
    // Pour l'instant, on utilise les données statiques
    // Plus tard, on appellera l'API
    this.loading = false;
  }

  getInitials(prenom: string, nom: string): string {
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  }

  getMoyenneClass(moyenne: number): string {
    if (moyenne >= 16) return 'excellent';
    if (moyenne >= 14) return 'bien';
    if (moyenne >= 12) return 'assez_bien';
    return 'insuffisant';
  }

  async telechargerBulletin(enfant: any, bulletin: any): Promise<void> {
    try {
      this.loading = true;
      
      // Générer le PDF côté client
      const pdfBlob = await this.bulletinService.genererBulletinPdfClient(bulletin);
      
      // Créer le nom du fichier
      const nomFichier = `Bulletin_${enfant.nom}_${enfant.prenom}_${bulletin.periode}.pdf`;
      
      // Télécharger le PDF
      this.bulletinService.telechargerPdf(pdfBlob, nomFichier);
      
      console.log('PDF généré et téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      this.loading = false;
    }
  }

  async imprimerBulletin(enfant: any, bulletin: any): Promise<void> {
    try {
      this.loading = true;
      
      // Générer le PDF côté client
      const pdfBlob = await this.bulletinService.genererBulletinPdfClient(bulletin);
      
      // Imprimer le PDF
      this.bulletinService.imprimerPdf(pdfBlob);
      
      console.log('Bulletin envoyé à l\'impression');
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      alert('Erreur lors de l\'impression');
    } finally {
      this.loading = false;
    }
  }

  async telechargerTousBulletins(enfant: any): Promise<void> {
    try {
      this.loading = true;
      
      if (!enfant.bulletins || enfant.bulletins.length === 0) {
        alert('Aucun bulletin disponible pour cet enfant');
        return;
      }
      
      // Générer un PDF pour chaque bulletin
      const pdfBlobs: Blob[] = [];
      const nomsFichiers: string[] = [];
      
      for (const bulletin of enfant.bulletins) {
        const pdfBlob = await this.bulletinService.genererBulletinPdfClient(bulletin);
        pdfBlobs.push(pdfBlob);
        nomsFichiers.push(`Bulletin_${enfant.nom}_${enfant.prenom}_${bulletin.periode}.pdf`);
      }
      
      // Télécharger chaque PDF
      pdfBlobs.forEach((blob, index) => {
        setTimeout(() => {
          this.bulletinService.telechargerPdf(blob, nomsFichiers[index]);
        }, index * 1000); // Délai d'1 seconde entre chaque téléchargement
      });
      
      console.log(`${enfant.bulletins.length} bulletins exportés avec succès`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export');
    } finally {
      this.loading = false;
    }
  }

  voirDetailEnfant(enfant: any): void {
    // Implement navigation or modal to show detailed information
    console.log('Voir détails de l\'enfant:', enfant);
    // Example: Navigate to a detail page
    // this.router.navigate(['/parent/enfants', enfant.id]);
  }
} 