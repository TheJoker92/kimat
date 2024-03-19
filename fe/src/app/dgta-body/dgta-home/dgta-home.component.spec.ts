import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaHomeComponent } from './dgta-home.component';

describe('DgtaHomeComponent', () => {
  let component: DgtaHomeComponent;
  let fixture: ComponentFixture<DgtaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
