import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDocument } from '../../../../../interfaces/IDocument';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ActionLogEnum, ILog } from '../../../../../interfaces/ILog';
import { HttpService } from '../../../../../http.service';
import { LoadingService } from '../../../../../dgta-loading/loading.service';

@Component({
  selector: 'dgta-attachments-modal',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './dgta-attachments-modal.component.html',
  styleUrl: './dgta-attachments-modal.component.scss'
})
export class DgtaAttachmentsModalComponent {

  @Input() document: IDocument = {}
  @Output() getDocumentsE = new EventEmitter()
  @Output() closeAttahcmentsModalE = new EventEmitter()
  
  isOpenAddAttachmentModal = false
  srcPdf = ""

  numOfPages: string = ""

  lastView: ILog = {}

  constructor (private http: HttpService,
              private loadingService: LoadingService) {}
  ngOnInit() {
    this.getPdf()

    let history = this.document.history!
    if (history.length > 1) {
      let historyTmp = history.filter((log:ILog) => log.actionLog == ActionLogEnum.UPDATE_DOCUMENT_LAST_VIEW)
      this.lastView = historyTmp[historyTmp.length - 2]
    }
  }

  getPdf() {
    fetch("https://127.0.0.1:8000/pdf/" + this.document.id!).then((result) => {
      return result.json()
    })
    .then((result) => {
      console.log(result)
      if (result.error) {
        this.srcPdf = ""
      } else {
        this.srcPdf = result.base64

        this.numOfPages = result.numOfPages
      }
    })
  }

  getDocumentsEmitter() {
    this.getDocumentsE.emit()
  }

  closeAddAttachmentModal() {
    this.isOpenAddAttachmentModal = false
  }

  openAddAttachmentModal() {
    this.isOpenAddAttachmentModal = true
  }

  close() {
    this.closeAttahcmentsModalE.emit()
  }

  getLastViewFullName() {
    let fullname = "-"

    if(this.lastView && this.lastView.user) {
      fullname = this.lastView.user.firstName + " " + this.lastView.user.lastName
    }

    return fullname
  }

  getLastViewtDate() {
    let date = ""

    if(this.lastView && this.lastView.date) {
      date = this.formatDate(this.lastView.date)
    }

    return date
  }

  formatDate (date: string) {
    let dateArray = date.split("T")[0].split("-")

    let hourArray = date.split("T")[1].split(":")
    return dateArray[2] + "-" + dateArray[1]+ "-" + dateArray[0]
  }

  getOcr() {
    let payload = {
      id: this.document.id
    }

    this.loadingService.isLoading = true
    this.http.getOcr(payload).subscribe({
      next: (response) => {
        this.loadingService.isLoading = false
        console.log(response)
      },
      error: (error) => {
        this.loadingService.isLoading = false
        console.error(error)
      }
    })
  }
}
