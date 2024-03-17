import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KimatHeaderComponent } from './kimat-header.component';

describe('KimatHeaderComponent', () => {
  let component: KimatHeaderComponent;
  let fixture: ComponentFixture<KimatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KimatHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KimatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
