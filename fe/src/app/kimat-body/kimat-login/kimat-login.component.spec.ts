import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KimatLoginComponent } from './kimat-login.component';

describe('KimatLoginComponent', () => {
  let component: KimatLoginComponent;
  let fixture: ComponentFixture<KimatLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KimatLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KimatLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
