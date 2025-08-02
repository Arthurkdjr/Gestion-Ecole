import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignantFormComponent } from './enseignant-form.component';

describe('EnseignantFormComponent', () => {
  let component: EnseignantFormComponent;
  let fixture: ComponentFixture<EnseignantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnseignantFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnseignantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
