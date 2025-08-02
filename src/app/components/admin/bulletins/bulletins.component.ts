import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BulletinService } from '../../../services/bulletin.service';
import { ClasseService } from '../../../services/classe.service';
import { EleveService } from '../../../services/eleve.service';

@Component({
  selector: 'app-bulletins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulletins.component.html',
  styleUrls: ['./bulletins.component.css']
})
export class BulletinsComponent implements OnInit {
  bulletins: any[] = [];
  filteredBulletins: any[] = [];
  classes: any[] = [];
  elevesClasse: any[] = [];
  searchTerm = '';
  selectedClasseId = '';
  selectedPeriode = '';
  periodeGeneration = 'trimestre1';
  showGenerationModal = false;
  generating = false;
  
  stats = {
    totalBulletins: 0,
    totalEleves: 0,
    moyenneGenerale: 0,
    meilleurEleve: 'N/A'
  };

  constructor(
    private bulletinService: BulletinService,
    private classeService: ClasseService,
    private eleveService: EleveService
  ) {}

  ngOnInit(): void {
    this.loadBulletins();
    this.loadClasses();
    this.loadStats();
  }

  loadBulletins(): void {
    this.bulletinService.getBulletinsByClasse(parseInt(this.selectedClasseId)).subscribe({
      next: (bulletins: any[]) => {
        this.bulletins = bulletins;
        this.filterBulletins();
        this.updateStats();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des bulletins:', err);
      }
    });
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe({
      next: (classes) => this.classes = classes,
      error: (err) => {
        console.error('Erreur lors du chargement des classes:', err);
        this.classes = [];
      }
    });
  }

  loadStats(): void {
    this.bulletinService.getBulletinStats().subscribe({
      next: (stats: any) => this.stats = stats,
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques:', err);
      }
    });
  }

  updateStats(): void {
    this.stats.totalBulletins = this.bulletins.length;
    this.stats.totalEleves = new Set(this.bulletins.map(b => b.eleve?.id)).size;
    
    if (this.bulletins.length > 0) {
      const totalMoyenne = this.bulletins.reduce((sum, b) => sum + (b.moyenne || 0), 0);
      this.stats.moyenneGenerale = totalMoyenne / this.bulletins.length;
      
      const meilleurBulletin = this.bulletins.reduce((best, current) => 
        (current.moyenne || 0) > (best.moyenne || 0) ? current : best
      );
      this.stats.meilleurEleve = `${meilleurBulletin.eleve?.nom} ${meilleurBulletin.eleve?.prenom}`;
    }
  }

  filterBulletins(): void {
    let filtered = this.bulletins;

    // Filtre par classe
    if (this.selectedClasseId) {
      filtered = filtered.filter(b => b.eleve?.classe?.id == this.selectedClasseId);
    }

    // Filtre par période
    if (this.selectedPeriode) {
      filtered = filtered.filter(b => b.periode === this.selectedPeriode);
    }

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(b => 
        b.eleve?.nom?.toLowerCase().includes(term) ||
        b.eleve?.prenom?.toLowerCase().includes(term)
      );
    }

    this.filteredBulletins = filtered;
  }

  onClasseChange(): void {
    this.filterBulletins();
    if (this.selectedClasseId) {
      this.loadElevesClasse();
    }
  }

  onPeriodeChange(): void {
    this.filterBulletins();
  }

  onSearchChange(): void {
    this.filterBulletins();
  }

  loadElevesClasse(): void {
    if (!this.selectedClasseId) return;
    
    this.eleveService.getElevesByClasse(parseInt(this.selectedClasseId)).subscribe({
      next: (eleves) => this.elevesClasse = eleves,
      error: (err) => {
        console.error('Erreur lors du chargement des élèves:', err);
        this.elevesClasse = [];
      }
    });
  }

  getClasseName(): string {
    const classe = this.classes.find(c => c.id == this.selectedClasseId);
    return classe ? `${classe.nom} - ${classe.niveau}` : '';
  }

  genererBulletins(): void {
    if (!this.selectedClasseId) {
      alert('Veuillez sélectionner une classe');
      return;
    }
    this.showGenerationModal = true;
  }

  closeGenerationModal(): void {
    this.showGenerationModal = false;
    this.generating = false;
  }

  confirmerGeneration(): void {
    this.generating = true;
    this.bulletinService.genererBulletin({
      classe_id: parseInt(this.selectedClasseId),
      periode: this.periodeGeneration
    }).subscribe({
      next: () => {
        this.loadBulletins();
        this.closeGenerationModal();
        this.generating = false;
      },
      error: (err: any) => {
        console.error('Erreur lors de la génération:', err);
        this.generating = false;
      }
    });
  }

  exporterBulletins(): void {
    if (!this.selectedClasseId) return;
    
    this.bulletinService.exporterBulletinPdf(parseInt(this.selectedClasseId)).subscribe({
      next: (blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bulletins_classe_${this.selectedClasseId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'export:', err);
        alert('Erreur lors de l\'export des bulletins');
      }
    });
  }

  imprimerBulletins(): void {
    // Logique d'impression
    window.print();
  }

  voirDetailBulletin(bulletinId: number): void {
    // Navigation vers le détail du bulletin
    console.log('Voir détail bulletin:', bulletinId);
  }

  modifierBulletin(bulletinId: number): void {
    // Navigation vers la modification du bulletin
    console.log('Modifier bulletin:', bulletinId);
  }

  telechargerBulletin(bulletinId: number): void {
    // Téléchargement d'un bulletin individuel
    console.log('Télécharger bulletin:', bulletinId);
  }

  // Générer un PDF de bulletin
  async genererPdfBulletin(bulletin: any): Promise<void> {
    try {
      this.generating = true; // Use generating for modal state
      
      // Générer le PDF côté client
      const pdfBlob = await this.bulletinService.genererBulletinPdfClient(bulletin);
      
      // Créer le nom du fichier
      const nomFichier = `Bulletin_${bulletin.eleve.nom}_${bulletin.eleve.prenom}_${bulletin.periode}.pdf`;
      
      // Télécharger le PDF
      this.bulletinService.telechargerPdf(pdfBlob, nomFichier);
      
      console.log('PDF généré et téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      this.generating = false; // Reset modal state
    }
  }

  // Imprimer un bulletin
  async imprimerBulletin(bulletin: any): Promise<void> {
    try {
      this.generating = true; // Use generating for modal state
      
      // Générer le PDF côté client
      const pdfBlob = await this.bulletinService.genererBulletinPdfClient(bulletin);
      
      // Imprimer le PDF
      this.bulletinService.imprimerPdf(pdfBlob);
      
      console.log('Bulletin envoyé à l\'impression');
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      alert('Erreur lors de l\'impression');
    } finally {
      this.generating = false; // Reset modal state
    }
  }

  // Exporter tous les bulletins d'une classe
  async exporterBulletinsClasse(classeId: number): Promise<void> {
    try {
      this.generating = true; // Use generating for modal state
      
      // Récupérer les bulletins de la classe
      this.bulletinService.getBulletinsByClasse(classeId).subscribe({
        next: async (bulletins) => {
          if (bulletins.length === 0) {
            alert('Aucun bulletin à exporter pour cette classe');
            return;
          }
          
          // Générer un PDF pour chaque bulletin
          const pdfBlobs: Blob[] = [];
          const nomsFichiers: string[] = [];
          
          for (const bulletin of bulletins) {
            const pdfBlob = await this.bulletinService.genererBulletinPdfClient(bulletin);
            pdfBlobs.push(pdfBlob);
            nomsFichiers.push(`Bulletin_${bulletin.eleve.nom}_${bulletin.eleve.prenom}_${bulletin.periode}.pdf`);
          }
          
          // Télécharger chaque PDF
          pdfBlobs.forEach((blob, index) => {
            setTimeout(() => {
              this.bulletinService.telechargerPdf(blob, nomsFichiers[index]);
            }, index * 1000); // Délai d'1 seconde entre chaque téléchargement
          });
          
          console.log(`${bulletins.length} bulletins exportés avec succès`);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des bulletins:', error);
          alert('Erreur lors de l\'export des bulletins');
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export');
    } finally {
      this.generating = false; // Reset modal state
    }
  }

  // Envoyer un bulletin par email
  async envoyerBulletinParEmail(bulletin: any): Promise<void> {
    try {
      this.generating = true;
      
      const result = await this.bulletinService.envoyerBulletinParEmail(bulletin, {
        envoyerAuxEleves: true,
        envoyerAuxParents: true,
        inclurePdf: true
      });
      
      // Afficher les résultats
      const successCount = result.filter((r: any) => r.success).length;
      const totalCount = result.length;
      
      if (successCount === totalCount) {
        alert(`✅ Email envoyé avec succès à ${successCount} destinataire(s)`);
      } else {
        alert(`⚠️ ${successCount}/${totalCount} email(s) envoyé(s) avec succès`);
      }
      
      console.log('Résultats envoi email:', result);
    } catch (error) {
      console.error('Erreur lors de l\'envoi par email:', error);
      alert('Erreur lors de l\'envoi par email');
    } finally {
      this.generating = false;
    }
  }

  // Envoyer tous les bulletins par email
  async envoyerBulletinsParEmail(): Promise<void> {
    if (!this.selectedClasseId) {
      alert('Veuillez sélectionner une classe');
      return;
    }

    try {
      this.generating = true;
      
      // Récupérer les bulletins de la classe
      this.bulletinService.getBulletinsByClasse(parseInt(this.selectedClasseId)).subscribe({
        next: async (bulletins) => {
          if (bulletins.length === 0) {
            alert('Aucun bulletin à envoyer pour cette classe');
            return;
          }
          
          const result = await this.bulletinService.envoyerBulletinsEnLot(bulletins, {
            envoyerAuxEleves: true,
            envoyerAuxParents: true,
            inclurePdf: true
          });
          
          alert(`✅ ${bulletins.length} bulletin(s) envoyé(s) par email avec succès`);
          console.log('Résultats envoi en lot:', result);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des bulletins:', error);
          alert('Erreur lors de l\'envoi des bulletins');
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi en lot:', error);
      alert('Erreur lors de l\'envoi en lot');
    } finally {
      this.generating = false;
    }
  }
} 