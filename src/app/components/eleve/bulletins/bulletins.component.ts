import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BulletinService } from '../../../services/bulletin.service';

@Component({
  selector: 'app-eleve-bulletins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulletins.component.html',
  styleUrls: ['./bulletins.component.css']
})
export class BulletinsComponent implements OnInit {
  currentUser: any;
  moyenneGenerale: number = 0;
  rang: number = 0;
  totalEleves: number = 0;
  matieres: any[] = [];
  bulletins: any[] = [];
  loading = false;
  selectedPeriode = '';

  constructor(
    private authService: AuthService,
    private bulletinService: BulletinService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadBulletinData();
    this.loadBulletins();
  }

  loadBulletinData(): void {
    // Données simulées pour le bulletin
    this.matieres = [
      {
        nom: 'Mathématiques',
        coefficient: 4,
        moyenne: 16.5,
        notes: [
          { type: 'Devoir 1', valeur: 17 },
          { type: 'Devoir 2', valeur: 16 },
          { type: 'Examen', valeur: 16.5 }
        ]
      },
      {
        nom: 'Français',
        coefficient: 3,
        moyenne: 14.2,
        notes: [
          { type: 'Rédaction', valeur: 15 },
          { type: 'Grammaire', valeur: 13 },
          { type: 'Examen', valeur: 14.5 }
        ]
      },
      {
        nom: 'Histoire-Géographie',
        coefficient: 2,
        moyenne: 15.8,
        notes: [
          { type: 'Contrôle Histoire', valeur: 16 },
          { type: 'Contrôle Géographie', valeur: 15.5 }
        ]
      },
      {
        nom: 'Sciences',
        coefficient: 3,
        moyenne: 17.1,
        notes: [
          { type: 'TP Physique', valeur: 18 },
          { type: 'Contrôle SVT', valeur: 16.5 },
          { type: 'Examen', valeur: 16.8 }
        ]
      },
      {
        nom: 'Anglais',
        coefficient: 2,
        moyenne: 13.5,
        notes: [
          { type: 'Oral', valeur: 14 },
          { type: 'Écrit', valeur: 13 }
        ]
      },
      {
        nom: 'Sport',
        coefficient: 1,
        moyenne: 18.0,
        notes: [
          { type: 'Athlétisme', valeur: 18 },
          { type: 'Collectif', valeur: 18 }
        ]
      }
    ];

    // Calculer la moyenne générale
    const totalPoints = this.matieres.reduce((sum, matiere) => 
      sum + (matiere.moyenne * matiere.coefficient), 0);
    const totalCoeffs = this.matieres.reduce((sum, matiere) => 
      sum + matiere.coefficient, 0);
    
    this.moyenneGenerale = Math.round((totalPoints / totalCoeffs) * 10) / 10;
    this.rang = 5;
    this.totalEleves = 28;
  }

  loadBulletins(): void {
    if (this.currentUser && this.currentUser.id) {
      this.bulletinService.getBulletinsByEleve(this.currentUser.id).subscribe({
        next: (bulletins: any[]) => {
          this.bulletins = bulletins;
          if (bulletins.length > 0) {
            this.selectedPeriode = bulletins[0].periode;
          }
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des bulletins:', error);
        }
      });
    }
  }

  getNoteClass(note: number): string {
    if (note >= 16) return 'excellent';
    if (note >= 14) return 'bon';
    if (note >= 10) return 'moyen';
    return 'insuffisant';
  }

  getAppreciation(moyenne: number): string {
    if (moyenne >= 16) return 'Excellent';
    if (moyenne >= 14) return 'Bon';
    if (moyenne >= 10) return 'Moyen';
    return 'Insuffisant';
  }

  getAppreciationClass(moyenne: number): string {
    if (moyenne >= 16) return 'excellent';
    if (moyenne >= 14) return 'bon';
    if (moyenne >= 10) return 'moyen';
    return 'insuffisant';
  }

  // Générer et télécharger un PDF de bulletin
  async telechargerBulletin(): Promise<void> {
    if (!this.currentUser || !this.currentUser.id) {
      alert('Utilisateur non connecté');
      return;
    }

    try {
      this.loading = true;
      
      // Trouver le bulletin de la période sélectionnée
      const bulletin = this.bulletins.find(b => b.periode === this.selectedPeriode);
      
      if (!bulletin) {
        alert('Aucun bulletin disponible pour cette période');
        return;
      }

      // Générer le PDF
      const pdfBlob = await this.bulletinService.genererBulletinPdfClient(bulletin);
      
      // Créer le nom du fichier
      const nomFichier = `Bulletin_${this.currentUser.nom}_${this.currentUser.prenom}_${this.selectedPeriode}.pdf`;
      
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

  // Imprimer un bulletin
  async imprimerBulletin(): Promise<void> {
    if (!this.currentUser || !this.currentUser.id) {
      alert('Utilisateur non connecté');
      return;
    }

    try {
      this.loading = true;
      
      // Trouver le bulletin de la période sélectionnée
      const bulletin = this.bulletins.find(b => b.periode === this.selectedPeriode);
      
      if (!bulletin) {
        alert('Aucun bulletin disponible pour cette période');
        return;
      }

      // Générer le PDF
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
} 