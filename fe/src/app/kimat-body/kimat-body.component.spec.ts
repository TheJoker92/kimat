import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KimatBodyComponent } from './kimat-body.component';

describe('KimatBodyComponent', () => {
  let component: KimatBodyComponent;
  let fixture: ComponentFixture<KimatBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KimatBodyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KimatBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
