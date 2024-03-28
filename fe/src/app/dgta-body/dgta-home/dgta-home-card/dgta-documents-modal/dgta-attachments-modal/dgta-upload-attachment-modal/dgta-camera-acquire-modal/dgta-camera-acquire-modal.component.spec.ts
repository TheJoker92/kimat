import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaCameraAcquireModalComponent } from './dgta-camera-acquire-modal.component';

describe('DgtaCameraAcquireModalComponent', () => {
  let component: DgtaCameraAcquireModalComponent;
  let fixture: ComponentFixture<DgtaCameraAcquireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaCameraAcquireModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaCameraAcquireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
