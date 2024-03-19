import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaHomeCardCatalogueFormModalComponent } from './dgta-home-card-catalogue-form-modal.component';

describe('DgtaHomeCardCatalogueFormModalComponent', () => {
  let component: DgtaHomeCardCatalogueFormModalComponent;
  let fixture: ComponentFixture<DgtaHomeCardCatalogueFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaHomeCardCatalogueFormModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaHomeCardCatalogueFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
