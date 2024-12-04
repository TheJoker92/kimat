import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as rawData from '../../../../../../assets/enum.json';
import { IDocument } from '../../../../../../interfaces/IDocument';
import { CommonModule } from '@angular/common';
import { DefaultDashPipe } from '../../../../../../default-dash.pipe';
import { LoadingService } from '../../../../../../dgta-loading/loading.service';
import { HttpService } from '../../../../../../http.service';
import { IDossier } from '../../../../../../interfaces/IDossier';
import { ActionLogEnum } from '../../../../../../interfaces/ILog';
import { IPlace } from '../../../../../../interfaces/IPlace';
import { SessionService } from '../../../../../../session.service';
import { DgtaUpdateCollocationModalComponent } from '../../../dgta-collocation-modal/dgta-update-collocation-modal/dgta-update-collocation-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'dgta-collocation-update-document',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, DgtaUpdateCollocationModalComponent, FontAwesomeModule],
  templateUrl: './dgta-collocation-update-document.component.html',
  styleUrl: './dgta-collocation-update-document.component.scss'
})
export class DgtaCollocationUpdateDocumentComponent {
  @Input() document: IDocument = {}
  @Output() closeUpdateCollocationModalE = new EventEmitter()
  @Output() getDocumentsE = new EventEmitter()

  isValidPalace = true
  isValidFloor = true
  isValidSector = true
  isValidRoom = true
  isValidRack = true
  isValidPosition = true


  faChevronLeft = faChevronLeft

  place: IPlace | any = {}


  step = 1
  
  constructor(public sessionService: SessionService,
    private http: HttpService,
    private loadingService: LoadingService) {

    }

  

  updateDocument() {
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

      this.place = JSON.parse(JSON.stringify(this.place))

      let placement = this.document.placement!
      placement.push(this.place)
      placement = JSON.parse(JSON.stringify(placement))

      let history = this.document.history!
      history.push({
        _id: this.document.history!.length.toString(),
        date: new Date().toISOString(),
        user: this.sessionService.user,
        resourceId: this.document._id,
        actionLog: ActionLogEnum.UPDATE_DOCUMENT_COLLOCATION
      })

      history = JSON.parse(JSON.stringify(history))

      let payload: any = {
        "parentId": this.document.parentId,
        "_id": this.document._id,
        "name": this.document.name,
        "history": JSON.stringify(history),
        "attachments": JSON.stringify(this.document.attachments),
        "deviceIds": JSON.stringify(this.document.deviceIds),
        "states": JSON.stringify(this.document.states),
        "topics": JSON.stringify(this.document.topics),
        "placement": JSON.stringify(placement),
        "owners": JSON.stringify(this.document.owners),
        "deliberationDate": this.document.deliberationDate
      }

      this.loadingService.isLoading = true
      this.http.addDocument(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            // alert("Hai aggiornato il catalogo")
            this.getDocumentsE.emit()
            // this.closeUpdateCollocationModalE.emit()
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
      alert("Indicare il collocamento compilando tutti i campi associati.")
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
