import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DgtaSearchDossierComponent } from './dgta-search-dossier.component';


describe('DgtaSearchDossierComponent', () => {
  let component: DgtaSearchDossierComponent;
  let fixture: ComponentFixture<DgtaSearchDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgtaSearchDossierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DgtaSearchDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
