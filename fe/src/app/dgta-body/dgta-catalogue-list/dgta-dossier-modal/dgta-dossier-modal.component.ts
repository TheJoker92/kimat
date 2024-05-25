import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { HttpService } from '../../../http.service';
import { IDossier } from '../../../interfaces/IDossier';
import { SessionService } from '../../../session.service';
import { DeleteMassiveDossierComponent } from '../../dgta-home/delete-massive-dossier/delete-massive-dossier.component';
import { DgtaHomeCardDossierFormModalComponent } from '../../dgta-home/dgta-home-card/dgta-home-card-dossier-form-modal/dgta-home-card-dossier-form-modal.component';
import { DgtaHomeCardComponent } from '../../dgta-home/dgta-home-card/dgta-home-card.component';
import { DgtaSearchDossierComponent } from '../../dgta-home/dgta-search-dossier/dgta-search-dossier.component';
import { DgtaTopicCardComponent } from '../../dgta-home/dgta-topic-card/dgta-topic-card.component';
import { ICatalogue } from '../../../interfaces/ICatalogue';
import { DgtaDossierCardComponent } from './dgta-dossier-card/dgta-dossier-card.component';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { DgtaDocumentsModalComponent } from '../../dgta-home/dgta-home-card/dgta-documents-modal/dgta-documents-modal.component';

@Component({
  selector: 'dgta-dossier-modal',
  standalone: true,
  imports: [DgtaHomeCardComponent, CommonModule, DgtaDocumentsModalComponent, DgtaDossierCardComponent, DgtaTopicCardComponent, DgtaHomeCardDossierFormModalComponent, FontAwesomeModule, DgtaSearchDossierComponent, DeleteMassiveDossierComponent],
  templateUrl: './dgta-dossier-modal.component.html',
  styleUrl: './dgta-dossier-modal.component.scss'
})
export class DgtaDossierModalComponent {

  @Input() catalogue: any
  @Output() closeModalE = new EventEmitter()

  isOpenDossierFormModal = false

  isOpenDocumentsModal = false

  faFolderPlus = faFolderPlus

  faChevronLeft = faChevronLeft

  dossiers: IDossier[] = []

  showTopics = false

  term = ""

  toggleTopicsLabel = "mostra filtri"

  numTopics: any = {}

  activeSelect = false

  isOpenDeleteMassive = false
  

  constructor(public sessionService: SessionService,
    private http: HttpService) {
  }

  ngOnInit() {
    this.getDossiers()
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

  closeModal() {
    this.closeModalE.emit()
  }

  openModalDossierFormModal() {
    this.isOpenDossierFormModal = true
  }

  closeDossierFormModal() {
    this.isOpenDossierFormModal = false
  }

  getDossiers(topic?: string) {
    this.deactiveSelectMode()

    this.sessionService.terms["parentId"] = this.catalogue.id
    
    this.http.getDossiers(this.sessionService.terms).subscribe({
      next: (response: any) => {

        this.dossiers = []

        for (let document of response.documents!) {
          let dossier: any = {}
          for (let keyDocument of Object.keys(document)) {
            if (this.isParsable(document[keyDocument])) {
              dossier[keyDocument] = JSON.parse(document[keyDocument])
            } else {
              dossier[keyDocument] = document[keyDocument]
            }
          }

          this.dossiers.push(dossier)
        }

        if (topic) {
          console.log("GET CATALOGUE", topic)

          let dossiers = this.dossiers.filter(dossier => dossier.topics?.includes(topic))

          this.numTopics[topic] = dossiers.length

          this.numTopics = JSON.parse(JSON.stringify(this.numTopics))
        } else {
          this.numTopics["*"] = this.dossiers.length
        }

        for (let topic of Object.keys(this.numTopics)) {
          console.log("GET CATALOGUE", topic)

          let dossiers = this.dossiers.filter(dossier => dossier.topics?.includes(topic))

          this.numTopics[topic] = dossiers.length

          this.numTopics = JSON.parse(JSON.stringify(this.numTopics))
        }

        this.numTopics["*"] = this.dossiers.length

        console.log(this.dossiers)
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
    this.sessionService.selectedDossiers = []
  }

  deleteMassive() {
    this.isOpenDeleteMassive = false
    for (let dossier of this.sessionService.selectedDossiers) {
      this.deleteDossier(dossier)
    }
  }

  openDeleteMassiveModal() {
    this.isOpenDeleteMassive = true
  }

  closeDeleteMassiveModal() {
    this.isOpenDeleteMassive = false
  }

  deleteDossier(dossier: IDossier) {

    if (dossier.owners?.filter(owner => owner.id == this.sessionService.user!.id!).length != 0) {
  
      let payload = {
        id: dossier.id
      }
      this.http.deleteDossier(payload).subscribe({
        next: (response: any) => {
          if(response.code == 200) {
            // alert("L'operazione è riuscita")
            this.sessionService.selectedDossiers = this.sessionService.selectedDossiers.filter((selectedDossier: any) => selectedDossier.id != dossier.id)
            
            if (this.sessionService.selectedDossiers.length == 0) {
              window.location.reload()
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
}


