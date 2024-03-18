import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaHeaderComponent } from './dgta-header.component';

describe('DgtaHeaderComponent', () => {
  let component: DgtaHeaderComponent;
  let fixture: ComponentFixture<DgtaHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
