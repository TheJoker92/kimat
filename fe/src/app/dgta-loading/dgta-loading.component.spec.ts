import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaLoadingComponent } from './dgta-loading.component';

describe('DgtaLoadingComponent', () => {
  let component: DgtaLoadingComponent;
  let fixture: ComponentFixture<DgtaLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaLoadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
