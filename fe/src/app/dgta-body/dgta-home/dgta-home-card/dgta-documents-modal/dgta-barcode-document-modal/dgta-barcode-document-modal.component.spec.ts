import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaBarcodeDocumentModalComponent } from './dgta-barcode-document-modal.component';

describe('DgtaBarcodeDocumentModalComponent', () => {
  let component: DgtaBarcodeDocumentModalComponent;
  let fixture: ComponentFixture<DgtaBarcodeDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaBarcodeDocumentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaBarcodeDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
