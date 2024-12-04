import { Component, EventEmitter, Output } from '@angular/core';
import { DgtaHomeCardComponent } from './dgta-home-card/dgta-home-card.component';
import { SessionService } from '../../session.service';
import { HttpService } from '../../http.service';
import { ICatalogue } from '../../interfaces/ICatalogue';
import { CommonModule } from '@angular/common';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { DgtaTopicCardComponent } from './dgta-topic-card/dgta-topic-card.component';
import { DgtaSearchCatalogueComponent } from '../dgta-catalogue-list/dgta-search-catalogue/dgta-search-catalogue.component';
import { DgtaCatalogueFormModalComponent } from '../dgta-catalogue-list/dgta-catalogue-form-modal/dgta-catalogue-form-modal.component';
import { DgtaCatalogueCardComponent } from '../dgta-catalogue-list/dgta-catalogue-card/dgta-catalogue-card.component';
import { DgtaDeleteMassiveCatalogueComponent } from '../dgta-catalogue-list/dgta-delete-massive-catalogue/dgta-delete-massive-catalogue.component';
import { DgtaTopicCardCatalogueComponent } from '../dgta-catalogue-list/dgta-topic-card-catalogue/dgta-topic-card-catalogue.component';

@Component({
  selector: 'dgta-home',
  standalone: true,
  imports: [DgtaHomeCardComponent, CommonModule, DgtaTopicCardCatalogueComponent, DgtaTopicCardComponent, DgtaCatalogueFormModalComponent, DgtaCatalogueCardComponent, FontAwesomeModule, DgtaSearchCatalogueComponent, DgtaDeleteMassiveCatalogueComponent],
  templateUrl: './dgta-home.component.html',
  styleUrl: './dgta-home.component.scss'
})
export class DgtaHomeComponent {

  @Output() goToDossierE = new EventEmitter<any>()

  isOpenCatalogueFormModal = false

  faFolderPlus = faFolderPlus

  catalogues: ICatalogue[] = []

  showTopics = false

  term = ""

  toggleTopicsLabel = "mostra filtri"

  numTopics: any = {}

  activeSelect = false

  isOpenDeleteMassive = false
  

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

  getCatalogues(topic?: any) {
    this.deactiveSelectMode()
    
    this.http.getCatalogues(this.sessionService.terms).subscribe({
      next: (response: any) => {

        this.catalogues = []

        for (let document of response.documents!) {
          let catalogue: any = {}
          for (let keyDocument of Object.keys(document)) {
            if (this.isParsable(document[keyDocument])) {
              catalogue[keyDocument] = JSON.parse(document[keyDocument])
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

        for (let topic of Object.keys(this.numTopics)) {
          console.log("GET CATALOGUE", topic)

          let catalogues = this.catalogues.filter(catalogue => catalogue.topics?.includes(topic))

          this.numTopics[topic] = catalogues.length

          this.numTopics = JSON.parse(JSON.stringify(this.numTopics))
        }

        this.numTopics["*"] = this.catalogues.length

        console.log(this.catalogues)
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  toggleTopics() {
    if (this.showTopics) {
      this.showTopics = false
      this.toggleTopicsLabel = "mostra filtri"
    } else {
      this.showTopics = true
      this.toggleTopicsLabel = "nascondi filtri"
    }
  }

  hideTopics() {
    if (this.showTopics) {
      this.showTopics = false
      this.toggleTopicsLabel = "mostra filtri"
    }
  }

  activeSelectMode() {
    this.sessionService.activeSelect = true
  }

  deactiveSelectMode() {
    this.sessionService.activeSelect = false
    this.sessionService.selectedCatalogues = []
  }

  deleteMassive() {
    this.isOpenDeleteMassive = false
    for (let catalogue of this.sessionService.selectedCatalogues) {
      this.deleteCatalogue(catalogue)
    }
  }

  openDeleteMassiveModal() {
    this.isOpenDeleteMassive = true
  }

  closeDeleteMassiveModal() {
    this.isOpenDeleteMassive = false
  }

  deleteCatalogue(catalogue: ICatalogue) {

    if (catalogue.owners?.filter(owner => owner._id == this.sessionService.user!._id!).length != 0) {
  
      let payload = {
        _id: catalogue._id
      }
      this.http.deleteCatalogue(payload).subscribe({
        next: (response: any) => {
          if(response.code == 200) {
            // alert("L'operazione è riuscita")
            this.sessionService.selectedCatalogues = this.sessionService.selectedCatalogues.filter((selectedCatalogue: any) => selectedCatalogue._id != catalogue._id)
            
            if (this.sessionService.selectedCatalogues.length == 0) {
              setTimeout(() => {
                window.location.reload()
              },1000)
            }
          } else {
            alert("Qualcosa è andato storto")
          }
        },
        error: (error: any) => {
          console.error(error)
        }
      })
    } else {
      alert("Non sei autorizzato ad effettuare l'operazione")
    }
    
  }

  goToDossier(catalogue: any) {
    this.goToDossierE.emit(catalogue)
  }
}


