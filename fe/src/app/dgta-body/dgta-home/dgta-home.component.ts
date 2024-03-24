import { Component } from '@angular/core';
import { DgtaHomeCardComponent } from './dgta-home-card/dgta-home-card.component';
import { SessionService } from '../../session.service';
import { HttpService } from '../../http.service';
import { ICatalogue } from '../../interfaces/ICatalogue';
import { CommonModule } from '@angular/common';
import { DgtaHomeCardCatalogueFormModalComponent } from './dgta-home-card/dgta-home-card-catalogue-form-modal/dgta-home-card-catalogue-form-modal.component';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'dgta-home',
  standalone: true,
  imports: [DgtaHomeCardComponent, CommonModule, DgtaHomeCardCatalogueFormModalComponent, FontAwesomeModule],
  templateUrl: './dgta-home.component.html',
  styleUrl: './dgta-home.component.scss'
})
export class DgtaHomeComponent {
  isOpenCatalogueFormModal = false

  faFolderPlus = faFolderPlus

  catalogues: ICatalogue[] = []

  constructor(public sessionService: SessionService,
              private http: HttpService) {
    this.http.getCatalogues().subscribe({
      next: (response: any) => {

        this.catalogues = []
        
        for (let document of response.documents!) {
          let catalogue: any = {}
          for (let keyDocument of Object.keys(document)) {
            if (this.isParsable(document[keyDocument])) {
              catalogue[keyDocument] =  JSON.parse(document[keyDocument])
            } else {
              catalogue[keyDocument] = document[keyDocument]
            }
          }

          this.catalogues.push(catalogue)
        }
        

        console.log(this.catalogues)
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  isParsable(inputString: string): boolean {
    try {
        // Try to parse the string into an object
        JSON.parse(inputString);
        return true; // If successful, return true
    } catch (error) {
        return false; // If parsing fails, return false
    }
  
  }

  openModalCatalogueFormModal() {
    this.isOpenCatalogueFormModal = true
  }

  closeCatalogueFormModal() {
    this.isOpenCatalogueFormModal = false
  }

}


