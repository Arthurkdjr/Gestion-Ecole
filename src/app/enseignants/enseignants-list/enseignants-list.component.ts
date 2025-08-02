import { Component } from '@angular/core';

@Component({
  selector: 'app-enseignants-list',
  templateUrl: './enseignants-list.component.html',
  styleUrls: ['./enseignants-list.component.css']
})
export class EnseignantsListComponent {
  enseignants = [
    { nom: 'Fall', prenom: 'Aminata', email: 'aminata.fall@example.com', matiere: 'Mathématiques', classe: '6eA' },
    { nom: 'Diop', prenom: 'Moussa', email: 'moussa.diop@example.com', matiere: 'Physique', classe: '4eC' },
    { nom: 'Ngom', prenom: 'Fatou', email: 'fatou.ngom@example.com', matiere: 'Français', classe: '5eB' }
  ];
}
