import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaBarcodeModalComponent } from './dgta-barcode-modal.component';

describe('DgtaBarcodeModalComponent', () => {
  let component: DgtaBarcodeModalComponent;
  let fixture: ComponentFixture<DgtaBarcodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaBarcodeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaBarcodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
