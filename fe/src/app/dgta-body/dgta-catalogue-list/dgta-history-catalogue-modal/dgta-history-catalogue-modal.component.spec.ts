import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaHistoryCatalogueModalComponent } from './dgta-history-catalogue-modal.component';

describe('DgtaHistoryCatalogueModalComponent', () => {
  let component: DgtaHistoryCatalogueModalComponent;
  let fixture: ComponentFixture<DgtaHistoryCatalogueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaHistoryCatalogueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaHistoryCatalogueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
