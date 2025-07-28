import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-eleve-emploi-temps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="emploi-temps-container">
      <div class="header">
        <h1>📅 Mon Emploi du Temps</h1>
        <p class="subtitle">Planning de la semaine</p>
      </div>

      <div class="week-selector">
        <button class="btn-nav" (click)="previousWeek()">
          ◀ Semaine précédente
        </button>
        <div class="current-week">
          <h3>Semaine du {{ currentWeekStart | date:'dd/MM/yyyy' }} au {{ currentWeekEnd | date:'dd/MM/yyyy' }}</h3>
        </div>
        <button class="btn-nav" (click)="nextWeek()">
          Semaine suivante ▶
        </button>
      </div>

      <div class="schedule-container">
        <div class="time-column">
          <div class="time-header">Heures</div>
          <div class="time-slot" *ngFor="let time of timeSlots">
            {{ time }}
          </div>
        </div>

        <div class="days-container">
          <div class="day-column" *ngFor="let day of days; let i = index">
            <div class="day-header" [class.today]="isToday(i)">
              <h3>{{ day.name }}</h3>
              <p>{{ day.date | date:'dd/MM' }}</p>
            </div>
            
            <div class="day-slots">
              <div 
                *ngFor="let slot of day.slots; let j = index" 
                class="schedule-slot"
                [class.has-class]="slot.cours"
                [class.break]="slot.break"
                [class.empty]="!slot.cours && !slot.break"
                (click)="showCourseDetails(slot)"
              >
                <div *ngIf="slot.cours" class="course-info">
                  <div class="course-name">{{ slot.cours.matiere }}</div>
                  <div class="course-teacher">{{ slot.cours.enseignant }}</div>
                  <div class="course-room">{{ slot.cours.salle }}</div>
                </div>
                <div *ngIf="slot.break" class="break-info">
                  {{ slot.break }}
                </div>
                <div *ngIf="!slot.cours && !slot.break" class="empty-slot">
                  -
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="legend">
        <div class="legend-item">
          <div class="legend-color cours"></div>
          <span>Cours</span>
        </div>
        <div class="legend-item">
          <div class="legend-color pause"></div>
          <span>Pause</span>
        </div>
        <div class="legend-item">
          <div class="legend-color libre"></div>
          <span>Libre</span>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" (click)="telechargerEmploiTemps()">
          📥 Télécharger l'emploi du temps
        </button>
        <button class="btn-secondary" (click)="imprimerEmploiTemps()">
          🖨️ Imprimer
        </button>
      </div>
    </div>
  `,
  styles: [`
    .emploi-temps-container {
      padding: 30px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      color: #2c3e50;
      margin: 0 0 10px 0;
      font-size: 2.5rem;
      font-weight: 700;
    }

    .subtitle {
      color: #7f8c8d;
      font-size: 1.1rem;
      margin: 0;
    }

    .week-selector {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .btn-nav {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-nav:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    }

    .current-week h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .schedule-container {
      display: flex;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 30px;
    }

    .time-column {
      min-width: 80px;
      background: #f8f9fa;
      border-right: 2px solid #ecf0f1;
    }

    .time-header {
      padding: 20px 10px;
      background: #3498db;
      color: white;
      font-weight: 600;
      text-align: center;
      font-size: 0.9rem;
    }

    .time-slot {
      padding: 15px 10px;
      text-align: center;
      font-size: 0.8rem;
      color: #7f8c8d;
      border-bottom: 1px solid #ecf0f1;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .days-container {
      display: flex;
      flex: 1;
    }

    .day-column {
      flex: 1;
      border-right: 1px solid #ecf0f1;
    }

    .day-column:last-child {
      border-right: none;
    }

    .day-header {
      padding: 20px 15px;
      background: #ecf0f1;
      text-align: center;
      border-bottom: 2px solid #ecf0f1;
    }

    .day-header.today {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
    }

    .day-header h3 {
      margin: 0 0 5px 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .day-header p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .day-slots {
      display: flex;
      flex-direction: column;
    }

    .schedule-slot {
      height: 80px;
      border-bottom: 1px solid #ecf0f1;
      padding: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .schedule-slot:hover {
      background: #f8f9fa;
      transform: scale(1.02);
    }

    .schedule-slot.has-class {
      background: linear-gradient(135deg, #d6eaf8 0%, #ebf3fd 100%);
      border-left: 4px solid #3498db;
    }

    .schedule-slot.break {
      background: linear-gradient(135deg, #fdeaa7 0%, #fef9e7 100%);
      border-left: 4px solid #f39c12;
    }

    .schedule-slot.empty {
      background: #f8f9fa;
      color: #bdc3c7;
    }

    .course-info {
      text-align: center;
      width: 100%;
    }

    .course-name {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
      margin-bottom: 3px;
    }

    .course-teacher {
      color: #7f8c8d;
      font-size: 0.8rem;
      margin-bottom: 2px;
    }

    .course-room {
      color: #3498db;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .break-info {
      color: #f39c12;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .empty-slot {
      color: #bdc3c7;
      font-size: 0.9rem;
    }

    .legend {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 30px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }

    .legend-color.cours {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    }

    .legend-color.pause {
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    }

    .legend-color.libre {
      background: #ecf0f1;
    }

    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
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
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
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
      .emploi-temps-container {
        padding: 20px;
      }

      .week-selector {
        flex-direction: column;
        gap: 15px;
      }

      .schedule-container {
        flex-direction: column;
      }

      .time-column {
        min-width: auto;
        display: flex;
        border-right: none;
        border-bottom: 2px solid #ecf0f1;
      }

      .time-header {
        min-width: 80px;
      }

      .time-slot {
        min-width: 80px;
      }

      .days-container {
        flex-direction: column;
      }

      .day-column {
        border-right: none;
        border-bottom: 1px solid #ecf0f1;
      }

      .legend {
        flex-direction: column;
        align-items: center;
        gap: 15px;
      }

      .actions {
        flex-direction: column;
      }

      .header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class EmploiTempsComponent implements OnInit {
  currentUser: any;
  currentWeekStart: Date = new Date();
  currentWeekEnd: Date = new Date();
  timeSlots: string[] = [
    '8h-9h', '9h-10h', '10h-11h', '11h-12h',
    '12h-13h', '13h-14h', '14h-15h', '15h-16h', '16h-17h'
  ];
  days: any[] = [];

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.initializeWeek();
    this.loadEmploiTemps();
  }

  initializeWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    this.currentWeekStart = new Date(today.setDate(diff));
    this.currentWeekEnd = new Date(this.currentWeekStart);
    this.currentWeekEnd.setDate(this.currentWeekStart.getDate() + 6);
  }

  loadEmploiTemps(): void {
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    this.days = dayNames.map((name, index) => {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + index);
      
      return {
        name: name,
        date: date,
        slots: this.generateSlotsForDay(index)
      };
    });
  }

  generateSlotsForDay(dayIndex: number): any[] {
    const slots = [];
    
    for (let i = 0; i < 9; i++) {
      if (i === 4) { // Pause déjeuner
        slots.push({ break: 'Pause déjeuner' });
      } else if (dayIndex >= 5) { // Weekend
        slots.push({});
      } else {
        // Cours simulés
        const courses = [
          { matiere: 'Mathématiques', enseignant: 'M. Dupont', salle: 'Salle 101' },
          { matiere: 'Français', enseignant: 'Mme Martin', salle: 'Salle 102' },
          { matiere: 'Histoire', enseignant: 'M. Durand', salle: 'Salle 103' },
          { matiere: 'Sciences', enseignant: 'Mme Bernard', salle: 'Labo 1' },
          { matiere: 'Anglais', enseignant: 'M. Wilson', salle: 'Salle 104' },
          { matiere: 'Sport', enseignant: 'M. Garcia', salle: 'Gymnase' }
        ];
        
        if (Math.random() > 0.3) { // 70% de chance d'avoir un cours
          slots.push({ cours: courses[Math.floor(Math.random() * courses.length)] });
        } else {
          slots.push({});
        }
      }
    }
    
    return slots;
  }

  isToday(dayIndex: number): boolean {
    const today = new Date();
    const dayDate = new Date(this.currentWeekStart);
    dayDate.setDate(this.currentWeekStart.getDate() + dayIndex);
    
    return today.toDateString() === dayDate.toDateString();
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() - 7);
    this.loadEmploiTemps();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 7);
    this.loadEmploiTemps();
  }

  showCourseDetails(slot: any): void {
    if (slot.cours) {
      alert(`Cours: ${slot.cours.matiere}\nEnseignant: ${slot.cours.enseignant}\nSalle: ${slot.cours.salle}`);
    }
  }

  telechargerEmploiTemps(): void {
    alert('Fonctionnalité de téléchargement en cours de développement...');
  }

  imprimerEmploiTemps(): void {
    window.print();
  }
} 