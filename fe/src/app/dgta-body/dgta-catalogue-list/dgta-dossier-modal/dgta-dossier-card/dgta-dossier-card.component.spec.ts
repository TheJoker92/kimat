import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaDossierCardComponent } from './dgta-dossier-card.component';

describe('DgtaDossierCardComponent', () => {
  let component: DgtaDossierCardComponent;
  let fixture: ComponentFixture<DgtaDossierCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaDossierCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaDossierCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
