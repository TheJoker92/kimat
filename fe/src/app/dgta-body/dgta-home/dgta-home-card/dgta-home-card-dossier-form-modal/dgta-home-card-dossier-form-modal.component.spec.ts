import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaHomeCardDossierFormModalComponent } from './dgta-home-card-dossier-form-modal.component';

describe('DgtaHomeCardDossierFormModalComponent', () => {
  let component: DgtaHomeCardDossierFormModalComponent;
  let fixture: ComponentFixture<DgtaHomeCardDossierFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaHomeCardDossierFormModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaHomeCardDossierFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
