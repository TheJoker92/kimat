import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMassiveCatalogueComponent } from './delete-massive-catalogue.component';

describe('DeleteMassiveCatalogueComponent', () => {
  let component: DeleteMassiveCatalogueComponent;
  let fixture: ComponentFixture<DeleteMassiveCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMassiveCatalogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteMassiveCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
