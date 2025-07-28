import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../../services/document.service';
import { EleveService } from '../../../services/eleve.service';
import { DocumentJustificatif, Eleve } from '../../../models/utilisateur';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="documents-container">
      <div class="page-header">
        <h1>📋 Gestion des Documents Justificatifs</h1>
        <p>Validez et gérez les documents soumis par les élèves</p>
      </div>

      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <span class="stat-number">{{ stats.enAttente }}</span>
            <span class="stat-label">En attente</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-number">{{ stats.valides }}</span>
            <span class="stat-label">Validés</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">❌</div>
          <div class="stat-info">
            <span class="stat-number">{{ stats.rejetes }}</span>
            <span class="stat-label">Rejetés</span>
          </div>
        </div>
      </div>

      <div class="filters">
        <select [(ngModel)]="filterStatut" (change)="filtrerDocuments()" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="valide">Validés</option>
          <option value="rejete">Rejetés</option>
        </select>
        <select [(ngModel)]="filterType" (change)="filtrerDocuments()" class="filter-select">
          <option value="">Tous les types</option>
          <option value="certificat_naissance">Certificat de naissance</option>
          <option value="bulletin_anterieur">Bulletin antérieur</option>
          <option value="certificat_medical">Certificat médical</option>
          <option value="piece_identite">Pièce d'identité</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div class="documents-list">
        <div class="document-card" *ngFor="let doc of documentsFiltres">
          <div class="document-header">
            <div class="document-info">
              <h3>{{ doc.nom }}</h3>
              <p class="eleve-name">{{ getEleveName(doc.eleve_id) }}</p>
              <span class="document-type">{{ getTypeLabel(doc.type) }}</span>
            </div>
            <div class="document-status" [class]="doc.statut">
              {{ getStatutLabel(doc.statut) }}
            </div>
          </div>

          <div class="document-details">
            <p class="upload-date">Uploadé le {{ formatDate(doc.date_upload) }}</p>
            <div class="document-actions">
              <button (click)="telechargerDocument(doc.id)" class="btn btn-secondary">
                📥 Télécharger
              </button>
              
              <div class="action-buttons" *ngIf="doc.statut === 'en_attente'">
                <button (click)="validerDocument(doc.id)" class="btn btn-success">
                  ✅ Valider
                </button>
                <button (click)="rejeterDocument(doc.id)" class="btn btn-danger">
                  ❌ Rejeter
                </button>
              </div>

              <div class="commentaire" *ngIf="doc.commentaire">
                <strong>Commentaire :</strong> {{ doc.commentaire }}
              </div>
            </div>
          </div>
        </div>

        <div class="no-documents" *ngIf="documentsFiltres.length === 0">
          <p>Aucun document trouvé</p>
        </div>
      </div>
    </div>

    <!-- Modal pour rejeter un document -->
    <div class="modal" *ngIf="showRejectModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>Rejeter le document</h3>
        <textarea 
          [(ngModel)]="rejectComment" 
          placeholder="Raison du rejet..."
          rows="4"
          class="reject-textarea">
        </textarea>
        <div class="modal-actions">
          <button (click)="confirmReject()" class="btn btn-danger">Confirmer le rejet</button>
          <button (click)="closeModal()" class="btn btn-secondary">Annuler</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .documents-container {
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

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stat-icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: #f8f9fa;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      display: block;
      font-size: 1.8rem;
      font-weight: 700;
      color: #2c3e50;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #7f8c8d;
      text-transform: uppercase;
      font-weight: 500;
    }

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
    }

    .filter-select {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      font-size: 0.9rem;
    }

    .documents-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .document-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      border: 1px solid #e9ecef;
    }

    .document-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .document-info h3 {
      margin: 0 0 5px 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .eleve-name {
      margin: 0 0 8px 0;
      color: #3498db;
      font-weight: 500;
    }

    .document-type {
      background: #ecf0f1;
      color: #2c3e50;
      padding: 4px 8px;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .document-status {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .document-status.en_attente {
      background: #fff3cd;
      color: #856404;
    }

    .document-status.valide {
      background: #d4edda;
      color: #155724;
    }

    .document-status.rejete {
      background: #f8d7da;
      color: #721c24;
    }

    .document-details {
      border-top: 1px solid #e9ecef;
      padding-top: 15px;
    }

    .upload-date {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin: 0 0 15px 0;
    }

    .document-actions {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-secondary {
      background: #ecf0f1;
      color: #2c3e50;
    }

    .btn-secondary:hover {
      background: #d5dbdb;
    }

    .btn-success {
      background: #27ae60;
      color: white;
    }

    .btn-success:hover {
      background: #229954;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-danger:hover {
      background: #c0392b;
    }

    .commentaire {
      margin-top: 10px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .no-documents {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
    }

    .modal-content h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
    }

    .reject-textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      resize: vertical;
      margin-bottom: 20px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .documents-container {
        padding: 20px;
      }

      .stats-cards {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
      }

      .document-header {
        flex-direction: column;
        gap: 10px;
      }

      .document-actions {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class DocumentsComponent implements OnInit {
  documents: DocumentJustificatif[] = [];
  documentsFiltres: DocumentJustificatif[] = [];
  filterStatut: string = '';
  filterType: string = '';
  stats = {
    enAttente: 0,
    valides: 0,
    rejetes: 0
  };

  // Modal
  showRejectModal = false;
  rejectComment = '';
  documentToReject: number | null = null;
  eleves: Eleve[] = [];

  constructor(
    private documentService: DocumentService,
    private eleveService: EleveService
  ) {}

  ngOnInit(): void {
    this.chargerDocuments();
    this.chargerEleves();
  }

  chargerEleves(): void {
    this.eleveService.getEleves().subscribe({
      next: (eleves) => {
        this.eleves = eleves;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des élèves:', error);
      }
    });
  }

  chargerDocuments(): void {
    // Récupérer tous les documents depuis l'API
    this.documentService.getAllDocuments().subscribe({
      next: (documents) => {
        this.documents = documents;
        this.calculerStats();
        this.filtrerDocuments();
        console.log('Documents chargés:', documents);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des documents:', error);
        // En cas d'erreur, on peut afficher un message à l'utilisateur
      }
    });
  }

  calculerStats(): void {
    this.stats.enAttente = this.documents.filter(d => d.statut === 'en_attente').length;
    this.stats.valides = this.documents.filter(d => d.statut === 'valide').length;
    this.stats.rejetes = this.documents.filter(d => d.statut === 'rejete').length;
  }

  filtrerDocuments(): void {
    this.documentsFiltres = this.documents.filter(doc => {
      const matchStatut = !this.filterStatut || doc.statut === this.filterStatut;
      const matchType = !this.filterType || doc.type === this.filterType;
      return matchStatut && matchType;
    });
  }

  getTypeLabel(type: string): string {
    const types = {
      'certificat_naissance': 'Certificat de naissance',
      'bulletin_anterieur': 'Bulletin antérieur',
      'certificat_medical': 'Certificat médical',
      'piece_identite': 'Pièce d\'identité',
      'autre': 'Autre'
    };
    return types[type as keyof typeof types] || type;
  }

  getStatutLabel(statut: string): string {
    const statuts = {
      'en_attente': 'En attente',
      'valide': 'Validé',
      'rejete': 'Rejeté'
    };
    return statuts[statut as keyof typeof statuts] || statut;
  }

  getEleveName(eleveId: number): string {
    const eleve = this.eleves.find(e => e.id === eleveId);
    return eleve ? `${eleve.prenom} ${eleve.nom}` : 'Élève inconnu';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  telechargerDocument(documentId: number): void {
    this.documentService.telechargerDocument(documentId).subscribe({
      next: (blob) => {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `document_${documentId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement:', error);
        alert('Erreur lors du téléchargement du document');
      }
    });
  }

  validerDocument(documentId: number): void {
    this.documentService.validerDocument(documentId).subscribe({
      next: () => {
        console.log('Document validé avec succès');
        this.chargerDocuments(); // Recharger la liste
      },
      error: (error) => {
        console.error('Erreur lors de la validation:', error);
        alert('Erreur lors de la validation du document');
      }
    });
  }

  rejeterDocument(documentId: number): void {
    this.documentToReject = documentId;
    this.showRejectModal = true;
  }

  confirmReject(): void {
    if (this.documentToReject && this.rejectComment.trim()) {
      this.documentService.rejeterDocument(this.documentToReject, this.rejectComment).subscribe({
        next: () => {
          console.log('Document rejeté avec succès');
          this.chargerDocuments(); // Recharger la liste
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors du rejet:', error);
          alert('Erreur lors du rejet du document');
        }
      });
    }
  }

  closeModal(): void {
    this.showRejectModal = false;
    this.rejectComment = '';
    this.documentToReject = null;
  }
} 