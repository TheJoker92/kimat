import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as rawData from '../../../../../../assets/enum.json';
import { faCheckSquare, faTrash, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from '../../../../../dgta-loading/loading.service';
import { HttpService } from '../../../../../http.service';
import { ActionLogEnum } from '../../../../../interfaces/ILog';
import { IPlace } from '../../../../../interfaces/IPlace';
import { IUser } from '../../../../../interfaces/IUser';
import { SessionService } from '../../../../../session.service';
import { IDossier } from '../../../../../interfaces/IDossier';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dgta-update-collocation-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-update-collocation-modal.component.html',
  styleUrl: './dgta-update-collocation-modal.component.scss'
})
export class DgtaUpdateCollocationModalComponent {
  @Input() dossier: IDossier = {}
  @Output() closeUpdateCollocationModalE = new EventEmitter()
  @Output() closeAllE = new EventEmitter()
  @Output() dossierE = new EventEmitter()

  

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
    this.pullDossier()
  }



  updateDossier() {
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
    if (this.isValidPalace && this.isValidFloor && this.isValidSector && this.isValidRack && this.isValidRoom && this.isValidPosition) {

      this.place["date"] = new Date().toISOString()

      let placement = this.dossier.placement!
      placement.push(this.place)
      placement = JSON.parse(JSON.stringify(placement))

      let history = this.dossier.history!
      history.push({
        _id: this.dossier.history!.length.toString(),
        date: new Date().toISOString(),
        user: this.sessionService.user,
        resourceId: this.dossier._id,
        actionLog: ActionLogEnum.UPDATE_CATALOGUE
      })

      history = JSON.parse(JSON.stringify(history))

      let payload: any = {
        _id: this.dossier._id,
        title: this.dossier.title,
        topics: this.dossier.topics,
        documents: [],
        owners: this.dossier.owners,
        history: history,
        placement: placement,
      }

      this.loadingService.isLoading = true
      this.http.updateDossier(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false


          if (response.code == 200) {
            // alert("Hai aggiornato il catalogo")
            // window.location.reload()
            this.step = 2
            this.pullDossier()
           }
            
            else {
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

  pullDossier() {
    this.loadingService.isLoading = true

    this.http.getCatalogues(this.sessionService.termsCatalogue).subscribe({
      next: (response: any) => {
        let dossierArray = response.documents!.filter((dossier: IDossier) => dossier._id == this.dossier._id)
        
        for (let document of dossierArray) {
          let dossier: any = {}
          for (let keyDocument of Object.keys(document)) {
            if (this.isParsable(document[keyDocument])) {
              dossier[keyDocument] =  JSON.parse(document[keyDocument])
            } else {
              dossier[keyDocument] = document[keyDocument]
            }
          }

          this.dossier = dossier
          this.dossierE.emit(dossier)

        }

        this.loadingService.isLoading = false
        
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  

    

  cancel() {
    this.closeUpdateCollocationModalE.emit()
  }
  


  editLocation(label: string, e: any) {
    this.place[label] = e.target.value
    console.log(this.place)
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
