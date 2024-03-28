import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as rawData from '../../../../../../assets/enum.json';
import { faCheckSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IDocument } from '../../../../../../interfaces/IDocument';
import { CommonModule } from '@angular/common';
import { DefaultDashPipe } from '../../../../../../default-dash.pipe';
import { LoadingService } from '../../../../../../dgta-loading/loading.service';
import { HttpService } from '../../../../../../http.service';
import { ICatalogue } from '../../../../../../interfaces/ICatalogue';
import { ActionLogEnum } from '../../../../../../interfaces/ILog';
import { IPlace } from '../../../../../../interfaces/IPlace';
import { SessionService } from '../../../../../../session.service';
import { DgtaUpdateCollocationModalComponent } from '../../../dgta-collocation-modal/dgta-update-collocation-modal/dgta-update-collocation-modal.component';

@Component({
  selector: 'dgta-collocation-update-document',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, DgtaUpdateCollocationModalComponent],
  templateUrl: './dgta-collocation-update-document.component.html',
  styleUrl: './dgta-collocation-update-document.component.scss'
})
export class DgtaCollocationUpdateDocumentComponent {
  @Input() document: IDocument = {}
  @Output() closeUpdateCollocationModalE = new EventEmitter()
  @Output() getDocumentsE = new EventEmitter()

  place: IPlace | any = {}

  faCheckSquare = faCheckSquare
  faTrash = faTrash

  constructor(public sessionService: SessionService,
    private http: HttpService,
    private loadingService: LoadingService) {

    }

  

  updateDocument() {
    if (this.place.palace && this.place.floor && this.place.room && this.place.sector && this.place.rack && this.place.position) {
      this.place["date"] = new Date().toISOString()

      this.place = JSON.parse(JSON.stringify(this.place))

      let placement = this.document.placement!
      placement.push(this.place)
      placement = JSON.parse(JSON.stringify(placement))

      let history = this.document.history!
      history.push({
        id: this.document.history!.length.toString(),
        date: new Date().toISOString(),
        user: this.sessionService.user,
        resourceId: this.document.id,
        actionLog: ActionLogEnum.UPDATE_DOCUMENT_COLLOCATION
      })

      history = JSON.parse(JSON.stringify(history))

      let payload: any = {
        "parentId": this.document.parentId,
        "id": this.document.id,
        "name": this.document.name,
        "history": JSON.stringify(history),
        "attachments": JSON.stringify(this.document.attachments),
        "deviceIds": JSON.stringify(this.document.deviceIds),
        "states": JSON.stringify(this.document.states),
        "topics": JSON.stringify(this.document.topics),
        "placement": JSON.stringify(placement),
        "owners": JSON.stringify(this.document.owners),
      }

      this.loadingService.isLoading = true
      this.http.addDocument(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            alert("Hai aggiornato il catalogo")
            this.loadingService.isLoading = false
            this.getDocumentsE.emit()
            this.closeUpdateCollocationModalE.emit()
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
}
