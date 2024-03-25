import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaAttachmentsModalComponent } from './dgta-attachments-modal.component';

describe('DgtaAttachmentsModalComponent', () => {
  let component: DgtaAttachmentsModalComponent;
  let fixture: ComponentFixture<DgtaAttachmentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaAttachmentsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaAttachmentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
