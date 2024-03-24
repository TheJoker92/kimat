import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaHistoryDocumentModalComponent } from './dgta-history-document-modal.component';

describe('DgtaHistoryDocumentModalComponent', () => {
  let component: DgtaHistoryDocumentModalComponent;
  let fixture: ComponentFixture<DgtaHistoryDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaHistoryDocumentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaHistoryDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
