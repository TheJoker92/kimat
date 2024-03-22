import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaDocumentsModalComponent } from './dgta-documents-modal.component';

describe('DgtaDocumentsModalComponent', () => {
  let component: DgtaDocumentsModalComponent;
  let fixture: ComponentFixture<DgtaDocumentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaDocumentsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaDocumentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
