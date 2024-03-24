import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDocument, IDocumentState } from '../../../../../../interfaces/IDocument';
import { HttpService } from '../../../../../../http.service';
import { LoadingService } from '../../../../../../dgta-loading/loading.service';
import { SessionService } from '../../../../../../session.service';
import { ActionLogEnum } from '../../../../../../interfaces/ILog';
import * as rawData from '../../../../../../../assets/enum.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dgta-update-state-document-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dgta-update-state-document-modal.component.html',
  styleUrl: './dgta-update-state-document-modal.component.scss'
})
export class DgtaUpdateStateDocumentModalComponent {
  @Input() document: IDocument = {}
  @Output() closeUpdateStateModalE = new EventEmitter()
  @Output() getDocumentsE = new EventEmitter()

  states: IDocumentState[] = []
  stateValues: string[] = []
  stateValue: string = ""

  data: any = rawData

  constructor(private http: HttpService,
              private loadingService: LoadingService,
              private sessionService: SessionService) {
                for (let documentState in this.data.documentState) {
                  this.stateValues.push(this.data.documentState[documentState])
                }
  }

  ngOnInit() {
    this.states = this.document.states!
  }


  close() {
    this.closeUpdateStateModalE.emit()
  }

  updateDocument() {

    let history = this.document.history!
    history.push({
      id: this.document.history!.length.toString(),
      date: new Date().toISOString(),
      user: this.sessionService.user,
      resourceId: this.document.id,
      actionLog: ActionLogEnum.UPDATE_DOCUMENT_STATE
    })

    history = JSON.parse(JSON.stringify(history))

    let state: IDocumentState = {
      id: this.states.length.toString(),
      stateValue: this.stateValue,
      date: new Date().toISOString(),
      user: this.sessionService.user
    }

    this.states.push(state)

    let payload: any = {
      "parentId": this.document.parentId,
      "id": this.document.id,
      "name": this.document.name,
      "history": JSON.stringify(history),
      "attachments": JSON.stringify(this.document.attachments),
      "deviceIds": JSON.stringify(this.document.deviceIds),
      "states": JSON.stringify(this.states),
      "topics": JSON.stringify(this.document.topics),
      "placement": JSON.stringify(this.document.placement),
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
          this.closeUpdateStateModalE.emit()
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

  }

  onSelectState(e: any) {
    this.stateValue = e.target.value
  }
}