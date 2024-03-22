import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaDocumentFormModalComponent } from './dgta-document-form-modal.component';

describe('DgtaDocumentFormModalComponent', () => {
  let component: DgtaDocumentFormModalComponent;
  let fixture: ComponentFixture<DgtaDocumentFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaDocumentFormModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaDocumentFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
