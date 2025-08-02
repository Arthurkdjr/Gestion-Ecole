import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PdfService, BulletinData } from './pdf.service';
import { EmailService, BulletinEmailData } from './email.service';

@Injectable({
  providedIn: 'root'
})
export class BulletinService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private pdfService: PdfService,
    private emailService: EmailService
  ) { }

  // Récupérer les bulletins par classe
  getBulletinsByClasse(classeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bulletins/classe/${classeId}`);
  }

  // Récupérer les bulletins d'un élève
  getBulletinsByEleve(eleveId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bulletins/eleve/${eleveId}`);
  }

  // Générer un bulletin
  genererBulletin(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bulletins/generer`, data);
  }

  // Exporter un bulletin en PDF
  exporterBulletinPdf(bulletinId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/bulletins/${bulletinId}/pdf`, { responseType: 'blob' });
  }

  // Obtenir les statistiques des bulletins
  getBulletinStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bulletins/stats`);
  }

  // Générer un PDF de bulletin côté client
  async genererBulletinPdfClient(bulletinData: any): Promise<Blob> {
    // Transformer les données du bulletin au format attendu par le service PDF
    const pdfData: BulletinData = {
      eleve: {
        nom: bulletinData.eleve.nom,
        prenom: bulletinData.eleve.prenom,
        numero_etudiant: bulletinData.eleve.numero_etudiant,
        classe: bulletinData.classe.nom
      },
      periode: bulletinData.periode,
      annee_scolaire: bulletinData.annee_scolaire,
      notes: bulletinData.notes.map((note: any) => ({
        matiere: note.matiere.nom,
        coefficient: note.matiere.coefficient,
        note: note.note,
        appreciation: note.appreciation || 'Aucune appréciation'
      })),
      moyenne_generale: bulletinData.moyenne_generale,
      rang: bulletinData.rang,
      effectif: bulletinData.effectif,
      appreciation_generale: bulletinData.appreciation_generale || 'Aucune appréciation générale'
    };

    return await this.pdfService.genererBulletinPdf(pdfData);
  }

  // Télécharger un PDF
  telechargerPdf(blob: Blob, nomFichier: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomFichier;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Imprimer un PDF
  imprimerPdf(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.contentWindow?.print();
    document.body.removeChild(iframe);
    window.URL.revokeObjectURL(url);
  }

  // Envoyer un bulletin par email
  async envoyerBulletinParEmail(bulletinData: any, options: {
    envoyerAuxEleves?: boolean;
    envoyerAuxParents?: boolean;
    inclurePdf?: boolean;
  } = {}): Promise<any> {
    try {
      const { envoyerAuxEleves = true, envoyerAuxParents = true, inclurePdf = true } = options;
      
      // Préparer les données pour l'email
      const emailData: BulletinEmailData = {
        eleve: {
          nom: bulletinData.eleve.nom,
          prenom: bulletinData.eleve.prenom,
          email: bulletinData.eleve.email
        },
        parent: bulletinData.eleve.parent ? {
          nom: bulletinData.eleve.parent.nom,
          prenom: bulletinData.eleve.parent.prenom,
          email: bulletinData.eleve.parent.email
        } : undefined,
        bulletin: {
          periode: bulletinData.periode,
          annee_scolaire: bulletinData.annee_scolaire,
          moyenne_generale: bulletinData.moyenne_generale,
          rang: bulletinData.rang,
          effectif: bulletinData.effectif
        }
      };

      // Inclure le PDF si demandé
      if (inclurePdf) {
        const pdfBlob = await this.genererBulletinPdfClient(bulletinData);
        emailData.pdfContent = await this.emailService.blobToBase64(pdfBlob);
      }

      const results: any[] = [];

      // Envoyer à l'élève
      if (envoyerAuxEleves && emailData.eleve.email) {
        try {
          const result = await this.emailService.sendBulletinToEleve(emailData).toPromise();
          results.push({ type: 'eleve', success: true, result });
        } catch (error) {
          results.push({ type: 'eleve', success: false, error });
        }
      }

      // Envoyer au parent
      if (envoyerAuxParents && emailData.parent?.email) {
        try {
          const result = await this.emailService.sendBulletinToParent(emailData).toPromise();
          results.push({ type: 'parent', success: true, result });
        } catch (error) {
          results.push({ type: 'parent', success: false, error });
        }
      }

      return results;
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails:', error);
      throw error;
    }
  }

  // Envoyer des bulletins en lot
  async envoyerBulletinsEnLot(bulletinsData: any[], options: {
    envoyerAuxEleves?: boolean;
    envoyerAuxParents?: boolean;
    inclurePdf?: boolean;
  } = {}): Promise<any> {
    try {
      const emailDataArray: BulletinEmailData[] = [];

      for (const bulletinData of bulletinsData) {
        const emailData: BulletinEmailData = {
          eleve: {
            nom: bulletinData.eleve.nom,
            prenom: bulletinData.eleve.prenom,
            email: bulletinData.eleve.email
          },
          parent: bulletinData.eleve.parent ? {
            nom: bulletinData.eleve.parent.nom,
            prenom: bulletinData.eleve.parent.prenom,
            email: bulletinData.eleve.parent.email
          } : undefined,
          bulletin: {
            periode: bulletinData.periode,
            annee_scolaire: bulletinData.annee_scolaire,
            moyenne_generale: bulletinData.moyenne_generale,
            rang: bulletinData.rang,
            effectif: bulletinData.effectif
          }
        };

        if (options.inclurePdf) {
          const pdfBlob = await this.genererBulletinPdfClient(bulletinData);
          emailData.pdfContent = await this.emailService.blobToBase64(pdfBlob);
        }

        emailDataArray.push(emailData);
      }

      return await this.emailService.sendBulletinsBatch(emailDataArray).toPromise();
    } catch (error) {
      console.error('Erreur lors de l\'envoi des bulletins en lot:', error);
      throw error;
    }
  }
} 