import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaHistoryModalComponent } from './dgta-history-modal.component';

describe('DgtaHistoryModalComponent', () => {
  let component: DgtaHistoryModalComponent;
  let fixture: ComponentFixture<DgtaHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaHistoryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
