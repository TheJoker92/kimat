import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaCollocationDocumentModalComponent } from './dgta-collocation-document-modal.component';

describe('DgtaCollocationDocumentModalComponent', () => {
  let component: DgtaCollocationDocumentModalComponent;
  let fixture: ComponentFixture<DgtaCollocationDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaCollocationDocumentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaCollocationDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
