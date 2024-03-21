import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaCollocationModalComponent } from './dgta-collocation-modal.component';

describe('DgtaCollocationModalComponent', () => {
  let component: DgtaCollocationModalComponent;
  let fixture: ComponentFixture<DgtaCollocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaCollocationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaCollocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
