import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDocument, IDocumentState } from '../../../../../interfaces/IDocument';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../../../http.service';
import { SessionService } from '../../../../../session.service';
import { LoadingService } from '../../../../../dgta-loading/loading.service';
import { ActionLogEnum } from '../../../../../interfaces/ILog';
import { DefaultDashPipe } from '../../../../../default-dash.pipe';
import { DgtaUpdateStateDocumentModalComponent } from './dgta-update-state-document-modal/dgta-update-state-document-modal.component';

@Component({
  selector: 'dgta-state-document-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, DgtaUpdateStateDocumentModalComponent],
  templateUrl: './dgta-state-document-modal.component.html',
  styleUrl: './dgta-state-document-modal.component.scss'
})
export class DgtaStateDocumentModalComponent {
  @Input() document: IDocument = {}
  @Output() closeStateModalE = new EventEmitter()
  @Output() getDocumentsE = new EventEmitter()


  isOpenUpdateStateDocument = false

  states: IDocumentState[] = []
  state: string = ""

  constructor(public sessionService: SessionService,
    private http: HttpService,
    private loadingService: LoadingService) {
      
    }

  ngOnInit() {
    this.states = this.document.states!
  }

  close() {
    this.closeStateModalE.emit()
  }

  getUserFullName(state: IDocumentState) {
    return state.user?.firstName + " " + state.user?.lastName
  }

  formatDate (date: string) {
    let dateArray = date.split("T")[0].split("-")
    return dateArray[2] + "-" + dateArray[1]+ "-" + dateArray[0]
  }

  getDocumentEmitter() {
    this.getDocumentsE.emit()
  }

  openUpdateStateDocument() {
    this.isOpenUpdateStateDocument = true
  }

  closeUpdateStateDocument() {
    this.isOpenUpdateStateDocument = false
  }
}
