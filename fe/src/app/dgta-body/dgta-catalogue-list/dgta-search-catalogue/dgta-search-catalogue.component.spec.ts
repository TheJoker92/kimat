import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaSearchCatalogueComponent } from './dgta-search-catalogue.component';

describe('DgtaSearchCatalogueComponent', () => {
  let component: DgtaSearchCatalogueComponent;
  let fixture: ComponentFixture<DgtaSearchCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaSearchCatalogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaSearchCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
