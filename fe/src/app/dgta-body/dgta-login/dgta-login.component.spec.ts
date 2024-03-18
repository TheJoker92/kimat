import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaLoginComponent } from './dgta-login.component';

describe('DgtaLoginComponent', () => {
  let component: DgtaLoginComponent;
  let fixture: ComponentFixture<DgtaLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
