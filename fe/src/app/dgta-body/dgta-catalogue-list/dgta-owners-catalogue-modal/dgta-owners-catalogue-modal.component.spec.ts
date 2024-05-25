import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaOwnersCatalogueModalComponent } from './dgta-owners-catalogue-modal.component';

describe('DgtaOwnersCatalogueModalComponent', () => {
  let component: DgtaOwnersCatalogueModalComponent;
  let fixture: ComponentFixture<DgtaOwnersCatalogueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaOwnersCatalogueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaOwnersCatalogueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
