import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentJustificatif } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Upload d'un document
  uploadDocument(eleveId: number, file: File, type: string, nom: string): Observable<any> {
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('type', type);
    formData.append('nom', nom);
    formData.append('eleve_id', eleveId.toString());

    return this.http.post(`${this.apiUrl}/documents/upload`, formData);
  }

  // Récupérer les documents d'un élève
  getDocumentsByEleve(eleveId: number): Observable<DocumentJustificatif[]> {
    return this.http.get<DocumentJustificatif[]>(`${this.apiUrl}/eleves/${eleveId}/documents`);
  }

  // Valider un document
  validerDocument(documentId: number, commentaire?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/documents/${documentId}/valider`, {
      statut: 'valide',
      commentaire: commentaire
    });
  }

  // Rejeter un document
  rejeterDocument(documentId: number, commentaire: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/documents/${documentId}/rejeter`, {
      statut: 'rejete',
      commentaire: commentaire
    });
  }

  // Supprimer un document
  supprimerDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documents/${documentId}`);
  }

  // Télécharger un document
  telechargerDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${documentId}/download`, {
      responseType: 'blob'
    });
  }

  // Récupérer tous les documents en attente
  getDocumentsEnAttente(): Observable<DocumentJustificatif[]> {
    return this.http.get<DocumentJustificatif[]>(`${this.apiUrl}/documents/en-attente`);
  }

  // Récupérer tous les documents
  getAllDocuments(): Observable<DocumentJustificatif[]> {
    return this.http.get<DocumentJustificatif[]>(`${this.apiUrl}/documents`);
  }
} 