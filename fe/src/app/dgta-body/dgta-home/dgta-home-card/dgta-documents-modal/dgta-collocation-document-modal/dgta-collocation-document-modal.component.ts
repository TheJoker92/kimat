import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlace } from '../../../../../interfaces/IPlace';
import { IDocument } from '../../../../../interfaces/IDocument';
import { DefaultDashPipe } from '../../../../../default-dash.pipe';
import { DgtaCollocationUpdateDocumentComponent } from './dgta-collocation-update-document/dgta-collocation-update-document.component';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'dgta-collocation-document-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, DgtaCollocationUpdateDocumentComponent, FontAwesomeModule],
  templateUrl: './dgta-collocation-document-modal.component.html',
  styleUrl: './dgta-collocation-document-modal.component.scss'
})
export class DgtaCollocationDocumentModalComponent {

  @Input() document: IDocument = {}
  @Output() closeCollocationModalE = new EventEmitter()
  @Output() getDocumentsE = new EventEmitter()

  faChevronLeft = faChevronLeft

  isOpenUpdateCollocationModal = false

  isSelectedCurrent = true
  isSelectedHistory = false

  places: IPlace[] = []

  currentPlace: IPlace = {}

  isVoidCollocationHistory = false

  constructor() {
  }

  ngOnInit() {
    if (this.document.placement && this.document.placement.length) {

      this.document.placement![0]["date"] = this.document.history![0].date!
      console.log(this.document.placement)
  
      this.currentPlace = this.document.placement![this.document.placement!.length -1]
  
      console.log(this.document.placement)
    } else {
      this.isVoidCollocationHistory = true
    }
  }

  close(update?: boolean) {
    this.closeCollocationModalE.emit(update)
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
    // this.close(true)
  }

  activeCurrentTab() {
    this.isSelectedCurrent = true
    this.isSelectedHistory = false
  }

  activeHistoryTab() {
    this.isSelectedHistory = true
    this.isSelectedCurrent = false
  }

  getPlacementLogs() {
    return this.document.placement!.filter((placementLog: any) => placementLog != this.document.placement![this.document.placement!.length -1])
  }
}


