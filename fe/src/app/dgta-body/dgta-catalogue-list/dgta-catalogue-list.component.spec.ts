import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaCatalogueListComponent } from './dgta-catalogue-list.component';

describe('DgtaCatalogueListComponent', () => {
  let component: DgtaCatalogueListComponent;
  let fixture: ComponentFixture<DgtaCatalogueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaCatalogueListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaCatalogueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
