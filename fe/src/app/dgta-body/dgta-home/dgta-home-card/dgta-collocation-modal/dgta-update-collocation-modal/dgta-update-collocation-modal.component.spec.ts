import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaUpdateCollocationModalComponent } from './dgta-update-collocation-modal.component';

describe('DgtaUpdateCollocationModalComponent', () => {
  let component: DgtaUpdateCollocationModalComponent;
  let fixture: ComponentFixture<DgtaUpdateCollocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaUpdateCollocationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaUpdateCollocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
