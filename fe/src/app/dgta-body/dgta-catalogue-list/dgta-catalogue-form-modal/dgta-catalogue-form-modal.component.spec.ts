import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaCatalogueFormModalComponent } from './dgta-catalogue-form-modal.component';

describe('DgtaCatalogueFormModalComponent', () => {
  let component: DgtaCatalogueFormModalComponent;
  let fixture: ComponentFixture<DgtaCatalogueFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaCatalogueFormModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaCatalogueFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
