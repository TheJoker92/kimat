import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaDeleteMassiveDocumentComponent } from './dgta-delete-massive-document.component';

describe('DgtaDeleteMassiveDocumentComponent', () => {
  let component: DgtaDeleteMassiveDocumentComponent;
  let fixture: ComponentFixture<DgtaDeleteMassiveDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaDeleteMassiveDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaDeleteMassiveDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
