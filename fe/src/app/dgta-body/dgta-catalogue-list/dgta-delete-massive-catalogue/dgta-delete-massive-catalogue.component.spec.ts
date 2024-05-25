import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaDeleteMassiveCatalogueComponent } from './dgta-delete-massive-catalogue.component';

describe('DgtaDeleteMassiveCatalogueComponent', () => {
  let component: DgtaDeleteMassiveCatalogueComponent;
  let fixture: ComponentFixture<DgtaDeleteMassiveCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaDeleteMassiveCatalogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaDeleteMassiveCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
