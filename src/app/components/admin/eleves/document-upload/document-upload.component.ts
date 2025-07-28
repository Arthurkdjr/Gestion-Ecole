import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../../../services/document.service';
import { DocumentJustificatif } from '../../../../models/utilisateur';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="document-upload-section">
      <h3>📄 Documents Justificatifs</h3>
      <p class="section-description">
        Les documents suivants sont obligatoires pour l'inscription :
      </p>

      <div class="required-documents">
        <div class="document-item" *ngFor="let docType of requiredDocuments">
          <div class="document-info">
            <span class="document-icon">📋</span>
            <div class="document-details">
              <h4>{{ docType.label }}</h4>
              <p>{{ docType.description }}</p>
            </div>
          </div>
          
          <div class="upload-area" 
               [class.uploaded]="isDocumentUploaded(docType.type)"
               [class.required]="!isDocumentUploaded(docType.type)">
            
            <div *ngIf="!isDocumentUploaded(docType.type)" class="upload-placeholder">
              <input 
                type="file" 
                [id]="'file-' + docType.type"
                (change)="onFileSelected($event, docType.type)"
                accept=".pdf,.jpg,.jpeg,.png"
                class="file-input">
              <label [for]="'file-' + docType.type" class="upload-label">
                <span class="upload-icon">📁</span>
                <span>Choisir un fichier</span>
              </label>
            </div>

            <div *ngIf="isDocumentUploaded(docType.type)" class="uploaded-file">
              <span class="file-icon">✅</span>
              <span class="file-name">{{ getUploadedFileName(docType.type) }}</span>
              <button (click)="removeDocument(docType.type)" class="remove-btn">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="upload-progress" *ngIf="uploading">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="uploadProgress"></div>
        </div>
        <span class="progress-text">Upload en cours... {{ uploadProgress }}%</span>
      </div>

      <div class="upload-error" *ngIf="uploadError">
        <span class="error-icon">❌</span>
        <span>{{ uploadError }}</span>
      </div>
    </div>
  `,
  styles: [`
    .document-upload-section {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
      border: 2px solid #e9ecef;
    }

    .document-upload-section h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }

    .section-description {
      color: #7f8c8d;
      margin: 0 0 20px 0;
      font-size: 0.9rem;
    }

    .required-documents {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .document-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .document-info {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }

    .document-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ecf0f1;
      border-radius: 8px;
    }

    .document-details h4 {
      margin: 0 0 5px 0;
      color: #2c3e50;
      font-size: 1rem;
    }

    .document-details p {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.85rem;
    }

    .upload-area {
      min-width: 200px;
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .upload-area.required {
      border-color: #e74c3c;
      background: #fdf2f2;
    }

    .upload-area.uploaded {
      border-color: #27ae60;
      background: #f0f9f0;
    }

    .file-input {
      display: none;
    }

    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: #7f8c8d;
      transition: color 0.3s ease;
    }

    .upload-label:hover {
      color: #3498db;
    }

    .upload-icon {
      font-size: 2rem;
    }

    .uploaded-file {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #27ae60;
    }

    .file-icon {
      font-size: 1.2rem;
    }

    .file-name {
      flex: 1;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      color: #e74c3c;
      padding: 5px;
      border-radius: 4px;
      transition: background 0.3s ease;
    }

    .remove-btn:hover {
      background: #fdf2f2;
    }

    .upload-progress {
      margin-top: 15px;
      padding: 10px;
      background: white;
      border-radius: 6px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #ecf0f1;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 5px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2980b9);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.85rem;
      color: #7f8c8d;
    }

    .upload-error {
      margin-top: 15px;
      padding: 10px;
      background: #fdf2f2;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      color: #721c24;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }

    .error-icon {
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .document-item {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .upload-area {
        min-width: auto;
      }
    }
  `]
})
export class DocumentUploadComponent {
  @Input() eleveId: number | null = null;
  @Output() documentsUploaded = new EventEmitter<DocumentJustificatif[]>();

  requiredDocuments = [
    {
      type: 'certificat_naissance',
      label: 'Certificat de naissance',
      description: 'Document officiel attestant de la naissance'
    },
    {
      type: 'bulletin_anterieur',
      label: 'Bulletin scolaire antérieur',
      description: 'Dernier bulletin de l\'année précédente'
    },
    {
      type: 'certificat_medical',
      label: 'Certificat médical',
      description: 'Certificat médical pour l\'inscription'
    },
    {
      type: 'piece_identite',
      label: 'Pièce d\'identité',
      description: 'Carte d\'identité ou passeport'
    }
  ];

  uploadedDocuments: { [key: string]: File } = {};
  uploading = false;
  uploadProgress = 0;
  uploadError = '';

  constructor(private documentService: DocumentService) {}

  onFileSelected(event: any, docType: string): void {
    const file = event.target.files[0];
    if (file) {
      // Validation du fichier
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        this.uploadError = 'Le fichier est trop volumineux (max 5MB)';
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.uploadError = 'Type de fichier non autorisé (PDF, JPG, PNG uniquement)';
        return;
      }

      this.uploadedDocuments[docType] = file;
      this.uploadError = '';
    }
  }

  isDocumentUploaded(docType: string): boolean {
    return !!this.uploadedDocuments[docType];
  }

  getUploadedFileName(docType: string): string {
    const file = this.uploadedDocuments[docType];
    return file ? file.name : '';
  }

  removeDocument(docType: string): void {
    delete this.uploadedDocuments[docType];
  }

  async uploadDocuments(): Promise<boolean> {
    if (!this.eleveId) {
      this.uploadError = 'ID de l\'élève manquant';
      return false;
    }

    const documentsToUpload = Object.keys(this.uploadedDocuments);
    if (documentsToUpload.length === 0) {
      this.uploadError = 'Aucun document à uploader';
      return false;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.uploadError = '';

    try {
      const uploadedDocs: DocumentJustificatif[] = [];
      
      for (let i = 0; i < documentsToUpload.length; i++) {
        const docType = documentsToUpload[i];
        const file = this.uploadedDocuments[docType];
        
        // Simulation de l'upload (remplacer par l'appel réel au service)
        await this.simulateUpload(file, docType);
        
        uploadedDocs.push({
          id: Date.now() + i,
          nom: file.name,
          type: docType as any,
          fichier_url: `/uploads/${file.name}`,
          date_upload: new Date().toISOString(),
          statut: 'en_attente',
          eleve_id: this.eleveId
        });

        this.uploadProgress = ((i + 1) / documentsToUpload.length) * 100;
      }

      this.documentsUploaded.emit(uploadedDocs);
      this.uploading = false;
      return true;

    } catch (error) {
      this.uploadError = 'Erreur lors de l\'upload des documents';
      this.uploading = false;
      return false;
    }
  }

  private simulateUpload(file: File, docType: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Upload simulé: ${file.name} (${docType})`);
        resolve();
      }, 1000);
    });
  }

  getRequiredDocumentsCount(): number {
    return this.requiredDocuments.length;
  }

  getUploadedDocumentsCount(): number {
    return Object.keys(this.uploadedDocuments).length;
  }

  isAllDocumentsUploaded(): boolean {
    return this.getUploadedDocumentsCount() === this.getRequiredDocumentsCount();
  }
} 