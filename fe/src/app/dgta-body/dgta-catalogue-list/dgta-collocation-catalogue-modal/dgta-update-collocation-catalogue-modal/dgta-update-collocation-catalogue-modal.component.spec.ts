import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaUpdateCollocationCatalogueModalComponent } from './dgta-update-collocation-catalogue-modal.component';

describe('DgtaUpdateCollocationCatalogueModalComponent', () => {
  let component: DgtaUpdateCollocationCatalogueModalComponent;
  let fixture: ComponentFixture<DgtaUpdateCollocationCatalogueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaUpdateCollocationCatalogueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaUpdateCollocationCatalogueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
