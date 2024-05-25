import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaCollocationCatalogueModalComponent } from './dgta-collocation-catalogue-modal.component';

describe('DgtaCollocationCatalogueModalComponent', () => {
  let component: DgtaCollocationCatalogueModalComponent;
  let fixture: ComponentFixture<DgtaCollocationCatalogueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaCollocationCatalogueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaCollocationCatalogueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
