import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaCatalogueCardComponent } from './dgta-catalogue-card.component';

describe('DgtaCatalogueCardComponent', () => {
  let component: DgtaCatalogueCardComponent;
  let fixture: ComponentFixture<DgtaCatalogueCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaCatalogueCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaCatalogueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
