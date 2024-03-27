import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaInfoCatalogueModalComponent } from './dgta-info-catalogue-modal.component';

describe('DgtaInfoCatalogueModalComponent', () => {
  let component: DgtaInfoCatalogueModalComponent;
  let fixture: ComponentFixture<DgtaInfoCatalogueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaInfoCatalogueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaInfoCatalogueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
