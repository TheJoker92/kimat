import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaBarcodeCatalogueModalComponent } from './dgta-barcode-catalogue-modal.component';

describe('DgtaBarcodeCatalogueModalComponent', () => {
  let component: DgtaBarcodeCatalogueModalComponent;
  let fixture: ComponentFixture<DgtaBarcodeCatalogueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaBarcodeCatalogueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaBarcodeCatalogueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
