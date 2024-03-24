import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaStateDocumentModalComponent } from './dgta-state-document-modal.component';

describe('DgtaStateDocumentModalComponent', () => {
  let component: DgtaStateDocumentModalComponent;
  let fixture: ComponentFixture<DgtaStateDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaStateDocumentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaStateDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
