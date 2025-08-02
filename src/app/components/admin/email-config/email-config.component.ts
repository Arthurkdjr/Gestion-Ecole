import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../../services/email.service';

@Component({
  selector: 'app-email-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="email-config-container">
      <div class="header">
        <h1>📧 Configuration des Notifications Email</h1>
        <p class="subtitle">Configurez les paramètres d'envoi des bulletins par email</p>
      </div>

      <div class="config-sections">
        <!-- Configuration générale -->
        <div class="config-section">
          <h2>⚙️ Configuration Générale</h2>
          <div class="config-grid">
            <div class="config-item">
              <label>
                <input type="checkbox" [(ngModel)]="config.envoiAutomatique" />
                Envoi automatique lors de la génération
              </label>
              <p class="help-text">Envoie automatiquement les bulletins par email quand ils sont générés</p>
            </div>
            
            <div class="config-item">
              <label>
                <input type="checkbox" [(ngModel)]="config.inclurePdf" />
                Inclure le PDF en pièce jointe
              </label>
              <p class="help-text">Attache le bulletin PDF à l'email</p>
            </div>
            
            <div class="config-item">
              <label>
                <input type="checkbox" [(ngModel)]="config.envoiAuxEleves" />
                Envoyer aux élèves
              </label>
              <p class="help-text">Envoie les bulletins aux adresses email des élèves</p>
            </div>
            
            <div class="config-item">
              <label>
                <input type="checkbox" [(ngModel)]="config.envoiAuxParents" />
                Envoyer aux parents
              </label>
              <p class="help-text">Envoie les bulletins aux adresses email des parents</p>
            </div>
          </div>
        </div>

        <!-- Template d'email -->
        <div class="config-section">
          <h2>📝 Template d'Email</h2>
          <div class="template-config">
            <div class="form-group">
              <label for="emailSubject">Objet de l'email</label>
              <input 
                type="text" 
                id="emailSubject" 
                [(ngModel)]="config.emailSubject" 
                class="form-control"
                placeholder="Bulletin scolaire - {periode} {annee_scolaire}">
            </div>
            
            <div class="form-group">
              <label for="emailSignature">Signature de l'email</label>
              <textarea 
                id="emailSignature" 
                [(ngModel)]="config.emailSignature" 
                class="form-control"
                rows="4"
                placeholder="Cordialement,&#10;L'équipe pédagogique de l'ISI"></textarea>
            </div>
          </div>
        </div>

        <!-- Paramètres avancés -->
        <div class="config-section">
          <h2>🔧 Paramètres Avancés</h2>
          <div class="advanced-config">
            <div class="form-group">
              <label for="delayEnvoi">Délai d'envoi (minutes)</label>
              <input 
                type="number" 
                id="delayEnvoi" 
                [(ngModel)]="config.delayEnvoi" 
                class="form-control"
                min="0"
                max="60">
              <p class="help-text">Délai avant l'envoi automatique (0 = immédiat)</p>
            </div>
            
            <div class="form-group">
              <label for="maxRetries">Nombre de tentatives</label>
              <input 
                type="number" 
                id="maxRetries" 
                [(ngModel)]="config.maxRetries" 
                class="form-control"
                min="1"
                max="5">
              <p class="help-text">Nombre de tentatives en cas d'échec d'envoi</p>
            </div>
            
            <div class="form-group">
              <label for="batchSize">Taille du lot</label>
              <input 
                type="number" 
                id="batchSize" 
                [(ngModel)]="config.batchSize" 
                class="form-control"
                min="1"
                max="50">
              <p class="help-text">Nombre d'emails envoyés simultanément</p>
            </div>
          </div>
        </div>

        <!-- Test d'envoi -->
        <div class="config-section">
          <h2>🧪 Test d'Envoi</h2>
          <div class="test-config">
            <div class="form-group">
              <label for="testEmail">Email de test</label>
              <input 
                type="email" 
                id="testEmail" 
                [(ngModel)]="testEmail" 
                class="form-control"
                placeholder="test@example.com">
            </div>
            
            <button (click)="envoyerEmailTest()" class="btn-primary" [disabled]="sending">
              <span *ngIf="!sending">📧 Envoyer un email de test</span>
              <span *ngIf="sending">⏳ Envoi...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button (click)="sauvegarderConfig()" class="btn-primary" [disabled]="saving">
          <span *ngIf="!saving">💾 Sauvegarder la configuration</span>
          <span *ngIf="saving">⏳ Sauvegarde...</span>
        </button>
        <button (click)="reinitialiserConfig()" class="btn-secondary">
          🔄 Réinitialiser
        </button>
      </div>
    </div>
  `,
  styles: [`
    .email-config-container {
      padding: 30px;
      max-width: 1000px;
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

    .subtitle {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.1rem;
    }

    .config-sections {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .config-section {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 25px;
    }

    .config-section h2 {
      color: #2c3e50;
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .config-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .config-item label {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #2c3e50;
      font-weight: 500;
      cursor: pointer;
    }

    .config-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #667eea;
    }

    .help-text {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.4;
    }

    .template-config, .advanced-config, .test-config {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      color: #2c3e50;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .form-control {
      padding: 12px 15px;
      border: 1px solid #bdc3c7;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }

    .form-control[type="email"] {
      font-family: inherit;
    }

    .form-control[type="number"] {
      width: 120px;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 40px;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 25px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: #ecf0f1;
      color: #2c3e50;
    }

    .btn-secondary:hover {
      background: #d5dbdb;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .email-config-container {
        padding: 15px;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .config-grid {
        grid-template-columns: 1fr;
      }
      
      .actions {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class EmailConfigComponent implements OnInit {
  config = {
    envoiAutomatique: true,
    inclurePdf: true,
    envoiAuxEleves: true,
    envoiAuxParents: true,
    emailSubject: 'Bulletin scolaire - {periode} {annee_scolaire}',
    emailSignature: 'Cordialement,\nL\'équipe pédagogique de l\'ISI',
    delayEnvoi: 0,
    maxRetries: 3,
    batchSize: 10
  };

  testEmail = '';
  saving = false;
  sending = false;

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.chargerConfig();
  }

  chargerConfig(): void {
    // Charger la configuration depuis le localStorage ou l'API
    const savedConfig = localStorage.getItem('emailConfig');
    if (savedConfig) {
      this.config = { ...this.config, ...JSON.parse(savedConfig) };
    }
  }

  async sauvegarderConfig(): Promise<void> {
    try {
      this.saving = true;
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('emailConfig', JSON.stringify(this.config));
      
      // Sauvegarder sur le serveur si nécessaire
      // await this.emailService.saveConfig(this.config).toPromise();
      
      alert('✅ Configuration sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la configuration');
    } finally {
      this.saving = false;
    }
  }

  reinitialiserConfig(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser la configuration ?')) {
      this.config = {
        envoiAutomatique: true,
        inclurePdf: true,
        envoiAuxEleves: true,
        envoiAuxParents: true,
        emailSubject: 'Bulletin scolaire - {periode} {annee_scolaire}',
        emailSignature: 'Cordialement,\nL\'équipe pédagogique de l\'ISI',
        delayEnvoi: 0,
        maxRetries: 3,
        batchSize: 10
      };
      
      localStorage.removeItem('emailConfig');
      alert('✅ Configuration réinitialisée');
    }
  }

  async envoyerEmailTest(): Promise<void> {
    if (!this.testEmail) {
      alert('Veuillez saisir une adresse email de test');
      return;
    }

    try {
      this.sending = true;
      
      const testNotification = {
        to: this.testEmail,
        subject: 'Test - Configuration Email ISI',
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Institut Supérieur d'Informatique</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Test de Configuration Email</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #2c3e50; margin-bottom: 20px;">Test de configuration réussi !</h2>
              
              <p style="color: #34495e; line-height: 1.6;">
                Cet email confirme que la configuration des notifications email est correctement configurée.
                Les bulletins scolaires seront envoyés automatiquement selon vos paramètres.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #2c3e50; margin-top: 0;">Configuration actuelle :</h3>
                <ul style="color: #34495e; line-height: 1.8;">
                  <li><strong>Envoi automatique :</strong> ${this.config.envoiAutomatique ? 'Activé' : 'Désactivé'}</li>
                  <li><strong>PDF inclus :</strong> ${this.config.inclurePdf ? 'Oui' : 'Non'}</li>
                  <li><strong>Envoi aux élèves :</strong> ${this.config.envoiAuxEleves ? 'Activé' : 'Désactivé'}</li>
                  <li><strong>Envoi aux parents :</strong> ${this.config.envoiAuxParents ? 'Activé' : 'Désactivé'}</li>
                </ul>
              </div>
              
              <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
                ${this.config.emailSignature}
              </p>
            </div>
          </div>
        `
      };
      
      await this.emailService.sendEmail(testNotification).toPromise();
      alert('✅ Email de test envoyé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du test:', error);
      alert('Erreur lors de l\'envoi de l\'email de test');
    } finally {
      this.sending = false;
    }
  }
} 