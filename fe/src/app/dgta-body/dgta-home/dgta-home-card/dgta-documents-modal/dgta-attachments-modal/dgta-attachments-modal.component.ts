import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAttachment, IDocument } from '../../../../../interfaces/IDocument';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ActionLogEnum, ILog } from '../../../../../interfaces/ILog';
import { HttpService } from '../../../../../http.service';
import { LoadingService } from '../../../../../dgta-loading/loading.service';
import { SessionService } from '../../../../../session.service';
import { DgtaUploadAttachmentModalComponent } from './dgta-upload-attachment-modal/dgta-upload-attachment-modal.component';
import { DgtaOcrModalComponent } from './dgta-ocr-modal/dgta-ocr-modal.component';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'dgta-attachments-modal',
  standalone: true,
  imports: [CommonModule, PdfViewerModule, DgtaUploadAttachmentModalComponent, DgtaOcrModalComponent, FontAwesomeModule],
  templateUrl: './dgta-attachments-modal.component.html',
  styleUrl: './dgta-attachments-modal.component.scss'
})
export class DgtaAttachmentsModalComponent {

  @Input() document: IDocument = {}
  @Output() getDocumentsE = new EventEmitter()
  @Output() closeAttahcmentsModalE = new EventEmitter<any>()

  file: any

  faChevronLeft = faChevronLeft
  
  step = 1
  startUpload = false 

  ocrText: string = ""
  isOpenOcrModal = false
  attachmentPdf: any = {}

  isOpenUploadAttachmentModal = false
  srcPdf: any

  token = ""

  numOfPages: string = ""

  lastView: ILog = {}

  isAuthenticated = false

  constructor (private http: HttpService,
              private sessionService: SessionService,
              public loadingService: LoadingService,
              private sanitizer: DomSanitizer) {}

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
    // this.loadingService.isLoading = true
    fetch(this.http.BASE_URL + "pdf/" + this.document._id!, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"email": this.sessionService.user?.email, "firstName": this.sessionService.user?.firstName, "isAuth": this.isAuthenticated})
    }).then((result) => {
      return result.json()
    })
    .then((result) => {
      
      if (result.error) {
        this.srcPdf = ""
        // alert("Il codice inserito è errato. Riprova.")
        // this.isAuthenticated = false
      } else {
        this.srcPdf = this.sanitizer.bypassSecurityTrustResourceUrl(result.base64)

        this.numOfPages = result.numOfPages
      }
      this.loadingService.isLoading = false
    })
    .catch(error => {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Fetch error:', error);
      }
    });
  }

  newToken() {
    this.loadingService.isLoading = false
    this.getPdf()
  }

  getDocumentsEmitter() {
    this.getDocumentsE.emit()
  }

  closeUploadAttachmentModal() {
    this.isOpenUploadAttachmentModal = false
    this.closeAttahcmentsModalE.emit()
  }

  openUploadAttachmentModal() {
    this.isOpenUploadAttachmentModal = true
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
    if (this.isAuthenticated) {

      let payload = {
        _id: this.document._id
      }
  
      this.loadingService.isLoading = true
      this.http.getOcr(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false
          this.ocrText = response.text
          this.isOpenOcrModal = true
        },
        error: (error) => {
          this.loadingService.isLoading = false
          console.error(error)
        }
      })
    }
  }

  uploadAttachmentDocument() {
      let payload: any = {
        "_id": this.document._id,
        "parentId": this.document.parentId,
        "name": this.document.name,
        "history": this.document.history,
        "attachments": [this.attachmentPdf],
        "deviceIds": [],
        "states": this.document.states,
        "topics": this.document.topics,
        "placement": this.document.placement,
        "owners": this.document.owners,
        "deliberationDate": this.document.deliberationDate
      }

      console.log(payload)

      this.loadingService.isLoading = true

      this.http.uploadFileWithPercent(payload).subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.attachmentPdf.progressUpload = Math.round(100 * (event.loaded / (event.total ?? 1)));

            this.attachmentPdf = JSON.parse(JSON.stringify(this.attachmentPdf))
            
            this.loadingService.isLoading = false

            this.startUpload = true

            return 101
          case HttpEventType.Response: {
            this.startUpload = false
            this.step = 2
            return 100;
          }
          default:
            return 0;
        }
      })
      this.http.uploadFile(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            let history: ILog = {
              _id: this.document.history?.length.toString(),
              date: new Date().toISOString(),
              actionLog: ActionLogEnum.UPDATE_DOCUMENT_ATTACHMENT,
              user: this.sessionService.user
            } 

            let attachmentSolr = this.attachmentPdf
            delete attachmentSolr["base64"]
            attachmentSolr = JSON.parse(JSON.stringify(attachmentSolr))
      
            let payload: any = {
              "_id": this.document._id,
              "parentId": this.document.parentId,
              "name": this.document.name,
              "history": [history],
              "attachments": [attachmentSolr],
              "deviceIds": [],
              "states": this.document.states,
              "topics": this.document.topics,
              "placement": this.document.placement,
              "owners": this.document.owners,
              "deliberationDate": this.document.deliberationDate
            }
      
            console.log(payload)
      
            this.loadingService.isLoading = true
            this.http.updateDocument(payload).subscribe({
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

  openUpdateAttachmentModal() {
    this.isOpenUploadAttachmentModal = true
  }

  attachmentPdfEmitter(attachmentPdf: IAttachment) {
    this.attachmentPdf = attachmentPdf

    this.uploadAttachmentDocument()
  }

  uploadAttachment() {
    
  }

  getPositionLabel(label: string) {
    let token = " - "

    if(this.document.placement && this.document.placement[0]) {
      let placement: any[] = this.document.placement
       token = placement[0][label]
    }

    return token
  }

  closeOcrModal() {
    this.isOpenOcrModal = false
  }

  editToken(e: any) {
    this.token = e.target.value
  }

  sendToken() {
    this.loadingService.isLoading = true

    let data = {
      firstName: this.sessionService.user?.firstName,
      email: this.sessionService.user?.email,
      token: this.token
    }
    this.http.sendToken(data).subscribe({
      next: (response: any) => {
        this.isAuthenticated = !response.error
        this.loadingService.isLoading = false
      },
      error: (error: any) => {
        console.error(error)
      }
    })
  }
}
