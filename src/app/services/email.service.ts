import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

export interface BulletinEmailData {
  eleve: {
    nom: string;
    prenom: string;
    email: string;
  };
  parent?: {
    nom: string;
    prenom: string;
    email: string;
  };
  bulletin: {
    periode: string;
    annee_scolaire: string;
    moyenne_generale: number;
    rang: number;
    effectif: number;
  };
  pdfContent?: string; // Base64 encoded PDF
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /**
   * Envoyer une notification email simple
   */
  sendEmail(notification: EmailNotification): Observable<any> {
    return this.http.post(`${this.apiUrl}/emails/send`, notification);
  }

  /**
   * Envoyer un bulletin par email à l'élève
   */
  sendBulletinToEleve(data: BulletinEmailData): Observable<any> {
    const emailData = {
      to: data.eleve.email,
      subject: `Bulletin scolaire - ${data.bulletin.periode} ${data.bulletin.annee_scolaire}`,
      message: this.generateEleveEmailMessage(data),
      attachments: data.pdfContent ? [{
        filename: `Bulletin_${data.eleve.nom}_${data.eleve.prenom}_${data.bulletin.periode}.pdf`,
        content: data.pdfContent,
        contentType: 'application/pdf'
      }] : undefined
    };

    return this.sendEmail(emailData);
  }

  /**
   * Envoyer un bulletin par email au parent
   */
  sendBulletinToParent(data: BulletinEmailData): Observable<any> {
    if (!data.parent) {
      throw new Error('Données parent manquantes');
    }

    const emailData = {
      to: data.parent.email,
      subject: `Bulletin scolaire de ${data.eleve.prenom} ${data.eleve.nom} - ${data.bulletin.periode} ${data.bulletin.annee_scolaire}`,
      message: this.generateParentEmailMessage(data),
      attachments: data.pdfContent ? [{
        filename: `Bulletin_${data.eleve.nom}_${data.eleve.prenom}_${data.bulletin.periode}.pdf`,
        content: data.pdfContent,
        contentType: 'application/pdf'
      }] : undefined
    };

    return this.sendEmail(emailData);
  }

  /**
   * Envoyer des bulletins en lot pour une classe
   */
  sendBulletinsBatch(bulletinsData: BulletinEmailData[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/emails/bulletins-batch`, {
      bulletins: bulletinsData
    });
  }

  /**
   * Générer le message email pour l'élève
   */
  private generateEleveEmailMessage(data: BulletinEmailData): string {
    const appreciation = this.getAppreciation(data.bulletin.moyenne_generale);
    
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Institut Supérieur d'Informatique</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Bulletin Scolaire</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2c3e50; margin-bottom: 20px;">Bonjour ${data.eleve.prenom} ${data.eleve.nom},</h2>
        
        <p style="color: #34495e; line-height: 1.6;">
          Votre bulletin scolaire pour la période <strong>${data.bulletin.periode}</strong> 
          de l'année scolaire <strong>${data.bulletin.annee_scolaire}</strong> est maintenant disponible.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="color: #2c3e50; margin-top: 0;">Résultats de la période :</h3>
          <ul style="color: #34495e; line-height: 1.8;">
            <li><strong>Moyenne générale :</strong> ${data.bulletin.moyenne_generale.toFixed(2)}/20</li>
            <li><strong>Rang :</strong> ${data.bulletin.rang}/${data.bulletin.effectif}</li>
            <li><strong>Appréciation :</strong> ${appreciation}</li>
          </ul>
        </div>
        
        <p style="color: #34495e; line-height: 1.6;">
          Vous trouverez votre bulletin en pièce jointe. Nous vous encourageons à le consulter 
          attentivement et à discuter de vos résultats avec vos enseignants si nécessaire.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:4200/eleve/bulletins" 
             style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Consulter mes bulletins en ligne
          </a>
        </div>
        
        <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
          Cordialement,<br>
          L'équipe pédagogique de l'ISI
        </p>
      </div>
    </div>
    `;
  }

  /**
   * Générer le message email pour le parent
   */
  private generateParentEmailMessage(data: BulletinEmailData): string {
    const appreciation = this.getAppreciation(data.bulletin.moyenne_generale);
    
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Institut Supérieur d'Informatique</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Bulletin Scolaire</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2c3e50; margin-bottom: 20px;">Bonjour ${data.parent?.prenom} ${data.parent?.nom},</h2>
        
        <p style="color: #34495e; line-height: 1.6;">
          Le bulletin scolaire de votre enfant <strong>${data.eleve.prenom} ${data.eleve.nom}</strong> 
          pour la période <strong>${data.bulletin.periode}</strong> de l'année scolaire 
          <strong>${data.bulletin.annee_scolaire}</strong> est maintenant disponible.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="color: #2c3e50; margin-top: 0;">Résultats de ${data.eleve.prenom} :</h3>
          <ul style="color: #34495e; line-height: 1.8;">
            <li><strong>Moyenne générale :</strong> ${data.bulletin.moyenne_generale.toFixed(2)}/20</li>
            <li><strong>Rang :</strong> ${data.bulletin.rang}/${data.bulletin.effectif}</li>
            <li><strong>Appréciation :</strong> ${appreciation}</li>
          </ul>
        </div>
        
        <p style="color: #34495e; line-height: 1.6;">
          Vous trouverez le bulletin complet en pièce jointe. Nous vous invitons à le consulter 
          et à échanger avec votre enfant sur ses résultats et ses progrès.
        </p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>💡 Conseil :</strong> Prenez le temps de discuter avec votre enfant de ses résultats, 
            félicitez ses efforts et encouragez-le dans ses points d'amélioration.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:4200/parent/enfants" 
             style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Consulter les bulletins en ligne
          </a>
        </div>
        
        <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
          Cordialement,<br>
          L'équipe pédagogique de l'ISI
        </p>
      </div>
    </div>
    `;
  }

  /**
   * Obtenir l'appréciation basée sur la moyenne
   */
  private getAppreciation(moyenne: number): string {
    if (moyenne >= 16) return 'Excellent';
    if (moyenne >= 14) return 'Très bien';
    if (moyenne >= 12) return 'Bien';
    if (moyenne >= 10) return 'Assez bien';
    return 'Insuffisant';
  }

  /**
   * Convertir un Blob en Base64
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Enlever le préfixe data:application/pdf;base64,
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
} 