import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaScannerlistModalComponent } from './dgta-scannerlist-modal.component';

describe('DgtaScannerlistModalComponent', () => {
  let component: DgtaScannerlistModalComponent;
  let fixture: ComponentFixture<DgtaScannerlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaScannerlistModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaScannerlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
