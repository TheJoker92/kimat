import { Component } from '@angular/core';
import { DgtaHomeCardComponent } from './dgta-home-card/dgta-home-card.component';
import { SessionService } from '../../session.service';
import { HttpService } from '../../http.service';
import { ICatalogue } from '../../interfaces/ICatalogue';
import { CommonModule } from '@angular/common';
import { DgtaHomeCardCatalogueFormModalComponent } from './dgta-home-card/dgta-home-card-catalogue-form-modal/dgta-home-card-catalogue-form-modal.component';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DgtaSearchCatalogueComponent } from './dgta-search-catalogue/dgta-search-catalogue.component';
import { Subscription } from 'rxjs';
import { DgtaTopicCardComponent } from './dgta-topic-card/dgta-topic-card.component';

@Component({
  selector: 'dgta-home',
  standalone: true,
  imports: [DgtaHomeCardComponent, CommonModule, DgtaTopicCardComponent, DgtaHomeCardCatalogueFormModalComponent, FontAwesomeModule, DgtaSearchCatalogueComponent],
  templateUrl: './dgta-home.component.html',
  styleUrl: './dgta-home.component.scss'
})
export class DgtaHomeComponent {
  isOpenCatalogueFormModal = false

  faFolderPlus = faFolderPlus

  catalogues: ICatalogue[] = []

  showTopics = true

  term = ""

  toggleTopicsLabel = "nascondi categorie"

  numTopics: any = {}

  constructor(public sessionService: SessionService,
              private http: HttpService) {
    this.getCatalogues()
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

  getCatalogues(topic?: string) {
    this.http.getCatalogues(this.sessionService.terms).subscribe({
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
        
        if (topic) {
          console.log("GET CATALOGUE", topic)

          let catalogues = this.catalogues.filter(catalogue => catalogue.topics?.includes(topic))
          
          this.numTopics[topic] = catalogues.length

          this.numTopics = JSON.parse(JSON.stringify(this.numTopics))
        } else {
          this.numTopics["*"] = this.catalogues.length
        }




        console.log(this.catalogues)
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  toggleTopics() {
    if(this.showTopics) {
      this.showTopics = false
      this.toggleTopicsLabel = "mostra categorie"
    } else {
      this.showTopics = true
      this.toggleTopicsLabel = "nascondi categorie"
    }
  }

  hideTopics() {
    if(this.showTopics) {
      this.showTopics = false
      this.toggleTopicsLabel = "mostra categorie"
    }
  }
}


