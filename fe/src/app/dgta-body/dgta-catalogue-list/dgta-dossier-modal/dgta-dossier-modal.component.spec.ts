import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaDossierModalComponent } from './dgta-dossier-modal.component';

describe('DgtaDossierModalComponent', () => {
  let component: DgtaDossierModalComponent;
  let fixture: ComponentFixture<DgtaDossierModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaDossierModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaDossierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
