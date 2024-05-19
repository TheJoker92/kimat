import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaFilterDocumentsComponent } from './dgta-filter-documents.component';

describe('DgtaFilterDocumentsComponent', () => {
  let component: DgtaFilterDocumentsComponent;
  let fixture: ComponentFixture<DgtaFilterDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaFilterDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaFilterDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
