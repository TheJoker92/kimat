import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaSearchDocumentComponent } from './dgta-search-document.component';

describe('DgtaSearchDocumentComponent', () => {
  let component: DgtaSearchDocumentComponent;
  let fixture: ComponentFixture<DgtaSearchDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaSearchDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaSearchDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
