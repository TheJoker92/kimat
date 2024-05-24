import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaInfoDossierModalComponent } from './dgta-info-dossier-modal.component';

describe('DgtaInfoDossierModalComponent', () => {
  let component: DgtaInfoDossierModalComponent;
  let fixture: ComponentFixture<DgtaInfoDossierModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaInfoDossierModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaInfoDossierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
