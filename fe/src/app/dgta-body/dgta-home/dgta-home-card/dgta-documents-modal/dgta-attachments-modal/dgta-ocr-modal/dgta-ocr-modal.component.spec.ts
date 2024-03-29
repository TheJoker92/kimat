import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaOcrModalComponent } from './dgta-ocr-modal.component';

describe('DgtaOcrModalComponent', () => {
  let component: DgtaOcrModalComponent;
  let fixture: ComponentFixture<DgtaOcrModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaOcrModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaOcrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
