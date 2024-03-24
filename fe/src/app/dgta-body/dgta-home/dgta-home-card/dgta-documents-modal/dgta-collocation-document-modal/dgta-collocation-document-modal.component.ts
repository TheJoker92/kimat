import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlace } from '../../../../../interfaces/IPlace';
import { IDocument } from '../../../../../interfaces/IDocument';
import { DefaultDashPipe } from '../../../../../default-dash.pipe';
import { DgtaCollocationUpdateDocumentComponent } from './dgta-collocation-update-document/dgta-collocation-update-document.component';


@Component({
  selector: 'dgta-collocation-document-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, DgtaCollocationUpdateDocumentComponent],
  templateUrl: './dgta-collocation-document-modal.component.html',
  styleUrl: './dgta-collocation-document-modal.component.scss'
})
export class DgtaCollocationDocumentModalComponent {

  @Input() document: IDocument = {}
  @Output() closeCollocationModalE = new EventEmitter()
  @Output() getDocumentsE = new EventEmitter()

  isOpenUpdateCollocationModal = false

  places: IPlace[] = []

  constructor() {
  }

  ngOnInit() {
    this.document.placement![0]["date"] = this.document.history![0].date!
    console.log(this.document.placement)
  }

  close() {
    this.closeCollocationModalE.emit()
  }

  formatDate (date: string) {
    let dateArray = date.split("T")[0].split("-")
    return dateArray[2] + "-" + dateArray[1]+ "-" + dateArray[0]
  }

  openUpdateCollocationModal() {
    this.isOpenUpdateCollocationModal = true
  }

  closeUpdateCollocationModal() {
    this.isOpenUpdateCollocationModal = false
  }

  getDocumentsEmitter() {
    this.getDocumentsE.emit()
  }
}
