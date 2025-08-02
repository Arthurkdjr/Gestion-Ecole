import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export interface BulletinData {
  eleve: {
    nom: string;
    prenom: string;
    numero_etudiant: string;
    classe: string;
  };
  periode: string;
  annee_scolaire: string;
  notes: Array<{
    matiere: string;
    coefficient: number;
    note: number;
    appreciation: string;
  }>;
  moyenne_generale: number;
  rang: number;
  effectif: number;
  appreciation_generale: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  /**
   * Génère un PDF de bulletin scolaire
   */
  async genererBulletinPdf(bulletinData: BulletinData): Promise<Blob> {
    const doc = new jsPDF();
    
    // Configuration du document
    doc.setFont('helvetica');
    doc.setFontSize(20);
    
    // En-tête avec logo ISI
    this.ajouterEnTete(doc, bulletinData);
    
    // Informations de l'élève
    this.ajouterInformationsEleve(doc, bulletinData);
    
    // Tableau des notes
    this.ajouterTableauNotes(doc, bulletinData);
    
    // Résultats et moyennes
    this.ajouterResultats(doc, bulletinData);
    
    // Appréciation générale
    this.ajouterAppreciation(doc, bulletinData);
    
    // Pied de page
    this.ajouterPiedDePage(doc);
    
    // Retourner le PDF comme Blob
    return doc.output('blob');
  }

  /**
   * Ajoute l'en-tête du bulletin
   */
  private ajouterEnTete(doc: jsPDF, data: BulletinData): void {
    // Titre principal
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80); // Bleu foncé ISI
    doc.text('INSTITUT SUPÉRIEUR D\'INFORMATIQUE', 105, 30, { align: 'center' });
    
    // Sous-titre
    doc.setFontSize(16);
    doc.setTextColor(102, 126, 234); // Bleu ISI
    doc.text('BULLETIN SCOLAIRE', 105, 45, { align: 'center' });
    
    // Période et année
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141); // Gris
    doc.text(`Période : ${data.periode}`, 105, 55, { align: 'center' });
    doc.text(`Année scolaire : ${data.annee_scolaire}`, 105, 65, { align: 'center' });
    
    // Ligne de séparation
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);
  }

  /**
   * Ajoute les informations de l'élève
   */
  private ajouterInformationsEleve(doc: jsPDF, data: BulletinData): void {
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('INFORMATIONS DE L\'ÉLÈVE', 20, 90);
    
    doc.setFontSize(11);
    doc.setTextColor(52, 73, 94);
    
    const startY = 105;
    const lineHeight = 8;
    
    doc.text(`Nom et Prénom : ${data.eleve.nom} ${data.eleve.prenom}`, 20, startY);
    doc.text(`Numéro d'étudiant : ${data.eleve.numero_etudiant}`, 20, startY + lineHeight);
    doc.text(`Classe : ${data.eleve.classe}`, 20, startY + lineHeight * 2);
    
    // Ligne de séparation
    doc.setDrawColor(189, 195, 199);
    doc.setLineWidth(0.2);
    doc.line(20, startY + lineHeight * 3 + 5, 190, startY + lineHeight * 3 + 5);
  }

  /**
   * Ajoute le tableau des notes
   */
  private ajouterTableauNotes(doc: jsPDF, data: BulletinData): void {
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('RÉSULTATS PAR MATIÈRE', 20, 140);
    
    // Préparer les données du tableau
    const tableData = data.notes.map(note => [
      note.matiere,
      note.coefficient.toString(),
      note.note.toString() + '/20',
      note.appreciation
    ]);
    
    // Ajouter le tableau avec autoTable
    autoTable(doc, {
      head: [['Matière', 'Coefficient', 'Note', 'Appréciation']],
      body: tableData,
      startY: 150,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 60 }
      }
    });
  }

  /**
   * Ajoute les résultats généraux
   */
  private ajouterResultats(doc: jsPDF, data: BulletinData): void {
    const currentY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('RÉSULTATS GÉNÉRAUX', 20, currentY);
    
    doc.setFontSize(11);
    doc.setTextColor(52, 73, 94);
    
    const startY = currentY + 15;
    const lineHeight = 8;
    
    doc.text(`Moyenne générale : ${data.moyenne_generale.toFixed(2)}/20`, 20, startY);
    doc.text(`Rang : ${data.rang}/${data.effectif}`, 20, startY + lineHeight);
    
    // Barre de progression visuelle
    const barWidth = 100;
    const barHeight = 8;
    const barX = 20;
    const barY = startY + lineHeight * 2 + 5;
    
    // Fond de la barre
    doc.setFillColor(236, 240, 241);
    doc.rect(barX, barY, barWidth, barHeight, 'F');
    
    // Progression basée sur la moyenne
    const progress = (data.moyenne_generale / 20) * barWidth;
    let fillColor = [231, 76, 60]; // Rouge si < 10
    if (data.moyenne_generale >= 16) fillColor = [46, 204, 113]; // Vert si >= 16
    else if (data.moyenne_generale >= 12) fillColor = [241, 196, 15]; // Jaune si >= 12
    else if (data.moyenne_generale >= 10) fillColor = [230, 126, 34]; // Orange si >= 10
    
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.rect(barX, barY, progress, barHeight, 'F');
    
    // Texte de la moyenne sur la barre
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`${data.moyenne_generale.toFixed(2)}/20`, barX + barWidth/2, barY + 6, { align: 'center' });
  }

  /**
   * Ajoute l'appréciation générale
   */
  private ajouterAppreciation(doc: jsPDF, data: BulletinData): void {
    const currentY = (doc as any).lastAutoTable.finalY + 80;
    
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('APPRÉCIATION GÉNÉRALE', 20, currentY);
    
    doc.setFontSize(11);
    doc.setTextColor(52, 73, 94);
    
    // Encadré pour l'appréciation
    const boxX = 20;
    const boxY = currentY + 10;
    const boxWidth = 170;
    const boxHeight = 30;
    
    doc.setDrawColor(189, 195, 199);
    doc.setLineWidth(0.5);
    doc.rect(boxX, boxY, boxWidth, boxHeight);
    
    // Texte de l'appréciation
    doc.text(data.appreciation_generale, boxX + 5, boxY + 10, {
      maxWidth: boxWidth - 10,
      lineHeightFactor: 1.2
    });
  }

  /**
   * Ajoute le pied de page
   */
  private ajouterPiedDePage(doc: jsPDF): void {
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFontSize(10);
    doc.setTextColor(127, 140, 141);
    doc.text('Institut Supérieur d\'Informatique - Tous droits réservés', 105, pageHeight - 20, { align: 'center' });
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, pageHeight - 15, { align: 'center' });
  }

  /**
   * Convertit un élément HTML en PDF
   */
  async htmlToPdf(element: HTMLElement): Promise<Blob> {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    return doc.output('blob');
  }
} 