import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgtaTopicCardComponent } from './dgta-topic-card.component';

describe('DgtaTopicCardComponent', () => {
  let component: DgtaTopicCardComponent;
  let fixture: ComponentFixture<DgtaTopicCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaTopicCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaTopicCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
