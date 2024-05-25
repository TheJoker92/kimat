import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as rawData from '../../../../../../assets/enum.json';
import { faCheckSquare, faTrash, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../../dgta-loading/loading.service';
import { HttpService } from '../../../../http.service';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { ActionLogEnum } from '../../../../interfaces/ILog';
import { IPlace } from '../../../../interfaces/IPlace';
import { SessionService } from '../../../../session.service';

@Component({
  selector: 'dgta-update-collocation-catalogue-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-update-collocation-catalogue-modal.component.html',
  styleUrl: './dgta-update-collocation-catalogue-modal.component.scss'
})
export class DgtaUpdateCollocationCatalogueModalComponent {

  @Input() catalogue: ICatalogue = {}
  @Output() closeUpdateCollocationModalE = new EventEmitter()
  @Output() closeAllE = new EventEmitter()
  
  
  isValidTitle = true
  isValidTopic = true
  isValidOwner = true

  isValidPalace = true
  isValidFloor = true
  isValidSector = true
  isValidRoom = true
  isValidRack = true
  isValidPosition = true


  faChevronLeft = faChevronLeft

  step = 1

  place: IPlace | any = {}

  faCheckSquare = faCheckSquare
  faTrash = faTrash

  constructor(public sessionService: SessionService,
    private http: HttpService,
    private loadingService: LoadingService) {
    this.pullCatalogue()
  }

  

  updateCatalogue() {
    if (this.place.palace) {
      this.isValidPalace = true
    } else {
      this.isValidPalace = false
    }

    if (this.place.floor) {
      this.isValidFloor = true
    } else {
      this.isValidFloor = false
    }

    if (this.place.room) {
      this.isValidRoom = true
    } else {
      this.isValidRoom = false
    }

    if (this.place.sector) {
      this.isValidSector = true
    } else {
      this.isValidSector = false
    }

    if (this.place.rack) {
      this.isValidRack = true
    } else {
      this.isValidRack = false
    }

    if (this.place.position) {
      this.isValidPosition = true
    } else {
      this.isValidPosition = false
    }
    if (this.isValidPalace && this.isValidFloor &&this.isValidSector && this.isValidRack && this.isValidRoom && this.isValidPosition) {

      this.place["date"] = new Date().toISOString()

      let placement = this.catalogue.placement!
      placement.push(this.place)
      placement = JSON.parse(JSON.stringify(placement))

      let history = this.catalogue.history!
      history.push({
        id: this.catalogue.history!.length.toString(),
        date: new Date().toISOString(),
        user: this.sessionService.user,
        resourceId: this.catalogue.id,
        actionLog: ActionLogEnum.UPDATE_CATALOGUE
      })

      history = JSON.parse(JSON.stringify(history))

      let payload: any = {
        id: this.catalogue.id,
        title: this.catalogue.title,
        topics: JSON.stringify(this.catalogue.topics),
        documents: JSON.stringify([]),
        owners: JSON.stringify(this.catalogue.owners),
        history: JSON.stringify(history),
        placement: JSON.stringify(placement),
      }

      this.loadingService.isLoading = true
      this.http.addCatalogue(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            // alert("Hai aggiornato il catalogo")
            // window.location.reload()
            this.step = 2
          } else {
            alert("Errore server. Contattare il supporto.")
          }
        },
        error: (error) => {
          this.loadingService.isLoading = false
          alert("L'operazione è fallita. Riprova.")
          console.error(error)
        }
      })
    } else if (!this.place.palace || !this.place.floor || !this.place.room || !this.place.sector || !this.place.rack || !this.place.position) {
    } else {
      alert("Qualcosa è andato storto. Riprova.")
    }
  }

  cancel() {
    this.closeUpdateCollocationModalE.emit()
  }


  editLocation(label:string, e: any) {
    this.place[label] = e.target.value
    console.log(this.place)
  }

  pullCatalogue() {
    this.loadingService.isLoading = true

    this.http.getCatalogues(this.sessionService.terms).subscribe({
      next: (response: any) => {
        let catalogueArray = response.documents!.filter((catalogue: ICatalogue) => catalogue.id == this.catalogue.id)
        
        for (let document of catalogueArray) {
          let catalogue: any = {}
          for (let keyDocument of Object.keys(document)) {
            if (this.isParsable(document[keyDocument])) {
              catalogue[keyDocument] =  JSON.parse(document[keyDocument])
            } else {
              catalogue[keyDocument] = document[keyDocument]
            }
          }

          this.catalogue = catalogue

        }

        this.loadingService.isLoading = false
        
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

  previousStep() {
    this.step -= 1
  }

  reload() {
    window.location.reload()
  }
}
