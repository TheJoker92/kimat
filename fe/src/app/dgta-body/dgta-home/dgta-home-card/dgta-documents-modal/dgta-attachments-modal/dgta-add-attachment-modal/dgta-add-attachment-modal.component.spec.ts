import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaAddAttachmentModalComponent } from './dgta-add-attachment-modal.component';

describe('DgtaAddAttachmentModalComponent', () => {
  let component: DgtaAddAttachmentModalComponent;
  let fixture: ComponentFixture<DgtaAddAttachmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaAddAttachmentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaAddAttachmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
