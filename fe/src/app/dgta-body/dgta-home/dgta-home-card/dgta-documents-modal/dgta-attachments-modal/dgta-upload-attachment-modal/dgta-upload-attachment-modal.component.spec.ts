import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaUploadAttachmentModalComponent } from './dgta-upload-attachment-modal.component';

describe('DgtaUploadAttachmentModalComponent', () => {
  let component: DgtaUploadAttachmentModalComponent;
  let fixture: ComponentFixture<DgtaUploadAttachmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaUploadAttachmentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaUploadAttachmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
