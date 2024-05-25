import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaTopicCardCatalogueComponent } from './dgta-topic-card-catalogue.component';

describe('DgtaTopicCardCatalogueComponent', () => {
  let component: DgtaTopicCardCatalogueComponent;
  let fixture: ComponentFixture<DgtaTopicCardCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaTopicCardCatalogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaTopicCardCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
