import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaOwnersDocumentModalComponent } from './dgta-owners-document-modal.component';

describe('DgtaOwnersDocumentModalComponent', () => {
  let component: DgtaOwnersDocumentModalComponent;
  let fixture: ComponentFixture<DgtaOwnersDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaOwnersDocumentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaOwnersDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
