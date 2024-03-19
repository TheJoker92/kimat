import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaHomeCardComponent } from './dgta-home-card.component';

describe('DgtaHomeCardComponent', () => {
  let component: DgtaHomeCardComponent;
  let fixture: ComponentFixture<DgtaHomeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaHomeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaHomeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
