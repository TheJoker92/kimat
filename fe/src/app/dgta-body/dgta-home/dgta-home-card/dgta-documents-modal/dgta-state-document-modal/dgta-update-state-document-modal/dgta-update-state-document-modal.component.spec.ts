import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaUpdateStateDocumentModalComponent } from './dgta-update-state-document-modal.component';

describe('DgtaUpdateStateDocumentModalComponent', () => {
  let component: DgtaUpdateStateDocumentModalComponent;
  let fixture: ComponentFixture<DgtaUpdateStateDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaUpdateStateDocumentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaUpdateStateDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
