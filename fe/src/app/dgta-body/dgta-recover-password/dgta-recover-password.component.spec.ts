import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaRecoverPasswordComponent } from './dgta-recover-password.component';

describe('DgtaRecoverPasswordComponent', () => {
  let component: DgtaRecoverPasswordComponent;
  let fixture: ComponentFixture<DgtaRecoverPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaRecoverPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaRecoverPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
