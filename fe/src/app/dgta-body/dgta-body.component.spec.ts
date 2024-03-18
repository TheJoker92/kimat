import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaBodyComponent } from './dgta-body.component';

describe('DgtaBodyComponent', () => {
  let component: DgtaBodyComponent;
  let fixture: ComponentFixture<DgtaBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaBodyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
