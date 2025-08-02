import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enseignant-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './enseignant-form.component.html',
  styleUrls: ['./enseignant-form.component.css']
})
export class EnseignantFormComponent {
  enseignant = {
    nom: '',
    prenom: '',
    email: '',
    matiere: '',
    classe: ''
  };

  matieres = ['Mathématiques', 'Français', 'Histoire', 'Physique'];
  classes = ['6eA', '5eB', '4eC', '3eD'];

  onSubmit() {
    console.log('🧑‍🏫 Nouvel enseignant enregistré :', this.enseignant);

    this.enseignant = {
      nom: '',
      prenom: '',
      email: '',
      matiere: '',
      classe: ''
    };
  }
}
