import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAttachment, IDocument } from '../../../../../interfaces/IDocument';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ActionLogEnum, ILog } from '../../../../../interfaces/ILog';
import { HttpService } from '../../../../../http.service';
import { LoadingService } from '../../../../../dgta-loading/loading.service';
import { SessionService } from '../../../../../session.service';

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
  
  attachmentPdf: IAttachment = {}

  isOpenAddAttachmentModal = false
  srcPdf = ""

  numOfPages: string = ""

  lastView: ILog = {}

  constructor (private http: HttpService,
              private sessionService: SessionService,
              private loadingService: LoadingService) {}

  ngOnChanges() {

    console.log("CHANGE", this.document)
  }
              
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

  addDocument() {
      let history: ILog = {
        id: this.document.history?.length.toString(),
        date: new Date().toISOString(),
        actionLog: ActionLogEnum.UPDATE_DOCUMENT_ATTACHMENT,
        user: this.sessionService.user
      } 

      let payload: any = {
        "id": this.document.id,
        "parentId": this.document.parentId,
        "name": this.document.name,
        "history": JSON.stringify([history]),
        "attachments": JSON.stringify([this.attachmentPdf]),
        "deviceIds": JSON.stringify([]),
        "states": JSON.stringify(this.document.states),
        "topics": JSON.stringify(this.document.topics),
        "placement": JSON.stringify(this.document.placement),
        "owners": JSON.stringify(this.document.owners)
      }

      console.log(payload)

      this.loadingService.isLoading = true
      this.http.addDocument(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            alert("Hai aggiornato il catalogo")

            this.getPdf() 

            this.getDocumentsE.emit()
          } else {
            alert("Errore server. Contattare il supporto.")
          }
        },
        error: (error: any) => {
          this.loadingService.isLoading = false
          console.error(error)
        }
      })
    
  }

  loadFile(ext: string) {
    document.getElementById("file-" + ext)?.click()
  }

  onUploadFile(e: any) {
    let file = e.target.files[0]
    if (file && file.type == "application/pdf") {
      const reader = new FileReader();

      console.log(this.document)

      reader.onload = (e: any) => {
        this.attachmentPdf = {
          name: file.name,
          ext: "pdf",
          base64: e.target.result.replace("data:application/pdf;base64,", "")
        }

        this.addDocument()
      };

      reader.readAsDataURL(file);

    } else if (file.type != "application/pdf") {
      alert("Caricare soltanto file pdf")
    }
  }
}
