import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteMassiveDossierComponent } from './delete-massive-dossier.component';


describe('DeleteMassiveDossierComponent', () => {
  let component: DeleteMassiveDossierComponent;
  let fixture: ComponentFixture<DeleteMassiveDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMassiveDossierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteMassiveDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
