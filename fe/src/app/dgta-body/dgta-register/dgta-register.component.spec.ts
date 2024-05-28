import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaRegisterComponent } from './dgta-register.component';

describe('DgtaRegisterComponent', () => {
  let component: DgtaRegisterComponent;
  let fixture: ComponentFixture<DgtaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
