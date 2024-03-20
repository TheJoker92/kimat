import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaOwnersModalComponent } from './dgta-owners-modal.component';

describe('DgtaOwnersModalComponent', () => {
  let component: DgtaOwnersModalComponent;
  let fixture: ComponentFixture<DgtaOwnersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaOwnersModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaOwnersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
