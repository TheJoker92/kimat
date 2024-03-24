import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaCollocationUpdateDocumentComponent } from './dgta-collocation-update-document.component';

describe('DgtaCollocationUpdateDocumentComponent', () => {
  let component: DgtaCollocationUpdateDocumentComponent;
  let fixture: ComponentFixture<DgtaCollocationUpdateDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaCollocationUpdateDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaCollocationUpdateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
