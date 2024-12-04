import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IDossier } from '../../../../interfaces/IDossier';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DgtaDocumentFormModalComponent } from './dgta-document-form-modal/dgta-document-form-modal.component';
import { HttpService } from '../../../../http.service';
import { LoadingService } from '../../../../dgta-loading/loading.service';
import { IDocument } from '../../../../interfaces/IDocument';
import { faCameraRetro, faTrash, faFileLines, faBarcode, faStepForward, faClockRotateLeft, faUsers, faFolderClosed, faFolderOpen, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { DgtaOwnersDocumentModalComponent } from './dgta-owners-document-modal/dgta-owners-document-modal.component';
import { DgtaCollocationDocumentModalComponent } from './dgta-collocation-document-modal/dgta-collocation-document-modal.component';
import { DgtaHistoryDocumentModalComponent } from './dgta-history-document-modal/dgta-history-document-modal.component';
import { DgtaBarcodeDocumentModalComponent } from './dgta-barcode-document-modal/dgta-barcode-document-modal.component';
import { DgtaStateDocumentModalComponent } from './dgta-state-document-modal/dgta-state-document-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DgtaAttachmentsModalComponent } from './dgta-attachments-modal/dgta-attachments-modal.component';
import { ActionLogEnum } from '../../../../interfaces/ILog';
import { SessionService } from '../../../../session.service';
import { DgtaTopicCardComponent } from '../../dgta-topic-card/dgta-topic-card.component';
import { DgtaSearchDocumentComponent } from './dgta-search-document/dgta-search-document.component';

import { faSearch, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { DgtaHeaderComponent } from '../../../../dgta-header/dgta-header.component';
import { DgtaFilterDocumentsComponent } from './dgta-filter-documents/dgta-filter-documents.component';
import { DgtaDeleteMassiveDocumentComponent } from './dgta-delete-massive-document/dgta-delete-massive-document.component';

@Component({
  selector: 'dgta-documents-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DgtaFilterDocumentsComponent, DgtaHeaderComponent, DgtaDeleteMassiveDocumentComponent, DgtaTopicCardComponent, DgtaBarcodeDocumentModalComponent, DgtaDocumentFormModalComponent, DgtaOwnersDocumentModalComponent, DgtaCollocationDocumentModalComponent, DgtaHistoryDocumentModalComponent, DgtaStateDocumentModalComponent, PdfViewerModule, DgtaAttachmentsModalComponent, DgtaSearchDocumentComponent],
  templateUrl: './dgta-documents-modal.component.html',
  styleUrl: './dgta-documents-modal.component.scss'
})
export class DgtaDocumentsModalComponent {

  @Input() dossier: IDossier = {}
  @Output() closeDocumentsModalE = new EventEmitter()

  faSearch = faSearch
  faChevronLeft = faChevronLeft
  

  selectedDocument: any

  document: IDocument = {}

  isOpenDocumentFormModal = false
  faFolderPlus = faFolderPlus
  faFolder = faFolderClosed
  faUsers = faUsers
  faMapMarker = faMapMarker
  faClockRotateLeft = faClockRotateLeft
  faBarcode = faBarcode
  faFileLines = faFileLines
  faTrash = faTrash
  faStepForward = faStepForward
  faCameraRetro = faCameraRetro

  documents: IDocument[] = []

  htmlColumnns: any = {

  }

  showTopics = false

  term = ""

  toggleTopicsLabel = "nascondi filtri"

  path: any

  isOpenAttachmentModal = false
  isOpenViewBarcodeModal = false
  isOpenHistoryDocumentModal = false
  isOpenCollocationModal = false
  isOpenOwnersModal = false
  isOpenStateModal = false

  startDate: any
  endDate: any

  isOpenDeleteMassive = false

  constructor(private http: HttpService,
    public sessionService: SessionService,
    private loadingService: LoadingService,
    private elementRef: ElementRef,
    private cdRef: ChangeDetectorRef) {


  }

  ngOnInit() {
    this.getDocuments()

  }

  ngAfterViewInit() {


  }

  smoothscroll() {
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

    if (currentScroll > 0) {

      window.requestAnimationFrame(this.smoothscroll);

      window.scrollTo(0, currentScroll - (currentScroll / 8));

    }
  }

  close() {
    this.closeDocumentsModalE.emit()
  }

  openModalDocumentFormModal() {
    this.isOpenDocumentFormModal = true
  }

  closeModalDocuemntFormModal() {
    this.isOpenDocumentFormModal = false
  }

  getDocuments(term?: string, dates?: any) {
    let payload: any = {
      parentId: this.dossier._id
    }

    if (term) {
      payload["name"] = term
      // payload["topics"] = term
    }

    if (dates) {

    }

    // this.loadingService.isLoading = true
    this.http.getDocuments(payload).subscribe({
      next: (response: any) => {
        // this.loadingService.isLoading = false

        this.documents = []
        for (let documentRaw of response.documents!) {
          let document: any = {}
          for (let keyDocument of Object.keys(documentRaw)) {
            if (this.isParsable(documentRaw[keyDocument])) {
              document[keyDocument] = JSON.parse(documentRaw[keyDocument])
            } else {
              document[keyDocument] = documentRaw[keyDocument]
            }
          }

          this.documents.push(document)
          this.documents = JSON.parse(JSON.stringify(this.documents))

        }
        if (term) {

          let payload: any = {
            parentId: this.dossier._id
          }

          delete payload["name"]
          payload["topics"] = term


          this.http.getDocuments(payload).subscribe({
            next: (response: any) => {
              this.loadingService.isLoading = false

              // this.documents = []
              for (let documentRaw of response.documents!) {
                let document: any = {}
                for (let keyDocument of Object.keys(documentRaw)) {
                  if (this.isParsable(documentRaw[keyDocument])) {
                    document[keyDocument] = JSON.parse(documentRaw[keyDocument])
                  } else {
                    document[keyDocument] = documentRaw[keyDocument]
                  }

                }

                if (this.documents.filter((presentedDocument: IDocument) => document._id == presentedDocument._id).length == 0) {
                  this.documents.push(document)
                }

                console.log("AAAA", this.documents)
                this.documents = JSON.parse(JSON.stringify(this.documents))
              }
              // this.document = this.documents.find((rawDocument: IDocument) => document._id == rawDocument._id)!


            },
            error: (error: any) => {
              console.error(error)
              this.loadingService.isLoading = false

            }
          })

          // this.document = this.documents.find((rawDocument: IDocument) => document._id == rawDocument._id)!
        }


      },
      error: (error: any) => {
        console.error(error)
        this.loadingService.isLoading = false

      }
    })
  }

  openDeleteMassiveModal() {
    this.isOpenDeleteMassive = true
  }

  closeDeleteMassiveModal() {
    this.isOpenDeleteMassive = false
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

  openAttachmentsModal(document: IDocument) {
    this.document = document

    let history = this.document.history!
    history.push({
      _id: this.document.history!.length.toString(),
      date: new Date().toISOString(),
      user: this.sessionService.user,
      resourceId: this.document._id,
      actionLog: ActionLogEnum.UPDATE_DOCUMENT_LAST_VIEW
    })

    history = JSON.parse(JSON.stringify(history))

    let payload: any = {
      "parentId": this.document.parentId,
      "_id": this.document._id,
      "name": this.document.name,
      "history": history,
      "attachments": this.document.attachments,
      "deviceIds": this.document.deviceIds,
      "states": this.document.states,
      "topics": this.document.topics,
      "placement": this.document.placement,
      "owners": this.document.owners,
      "deliberationDate": this.document.deliberationDate
    }

    // this.loadingService.isLoading = true
    this.http.updateDocument(payload).subscribe({
      next: (response: any) => {
        this.loadingService.isLoading = false

        if (response.code == 200) {
          this.loadingService.isLoading = false
          alert("Accesso inserito in registro")
          this.getDocuments()
          this.isOpenAttachmentModal = true
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

  closeAttachmentsModal() {
    this.document = {}
    this.isOpenAttachmentModal = false
  }

  openViewBarcodeModal(document: IDocument) {
    this.document = document
    this.isOpenViewBarcodeModal = true
  }

  closeViewBarcodeModal(document: IDocument) {
    this.document = {}
    this.isOpenViewBarcodeModal = false
  }

  openHistoryModal(document: IDocument) {
    this.document = document
    this.isOpenHistoryDocumentModal = true
  }

  closeHistoryModal() {
    this.document = {}
    this.isOpenHistoryDocumentModal = false
  }

  openCollocationModal(document: IDocument) {
    this.document = document
    this.isOpenCollocationModal = true
  }

  closeCollocationModal(update?: any) {
    this.isOpenCollocationModal = false

    if (update) {
      console.log("length BEFORE", this.document.placement)
      this.document = this.documents.find((rawDocument: IDocument) => this.document._id == rawDocument._id)!
      console.log("length AFTER", this.document.placement)
      setTimeout(() => {
        this.isOpenCollocationModal = true
      }, 100)


    }
  }

  openOwnersModal(document: IDocument) {
    this.document = document
    this.isOpenOwnersModal = true
  }

  closeOwnersModal(document: IDocument) {
    this.document = {}
    this.isOpenOwnersModal = false
  }

  openStateModal(document: IDocument) {
    this.document = document
    this.isOpenStateModal = true
  }

  closeStateModal(document: IDocument) {
    this.document = {}
    this.isOpenStateModal = false
  }

  deleteDocument(document: IDocument) {
    if (document.owners?.filter(owner => owner._id == this.sessionService.user!._id!).length != 0) {

      this.document = {}
  
      let payload = {
        _id: document._id
      }
      this.http.deleteDocuments(payload).subscribe({
        next: (response: any) => {
          if (response.code == 200) {
            // alert("L'operazione è riuscita")
            this.sessionService.selectedDocuments = this.sessionService.selectedDocuments.filter((documentSelected: any) => documentSelected._id != document._id)
            
            if (this.sessionService.selectedDocuments.length == 0) {
              this.deactiveSelectMode()
              setTimeout(() => {
                this.getDocuments()
              },1000)
            }
          } else {
            alert("Qualcosa è andato storto")
          }
        },
        error: (error: any) => {
          console.error(error)
        }
      })
    } else {
      alert("Non sei autorizzato ad effettuare l'operazione")
    }

  }

  toggleTopics() {
    if (this.showTopics) {
      this.showTopics = false
      this.toggleTopicsLabel = "mostra filtri"
    } else {
      this.showTopics = true
      this.toggleTopicsLabel = "nascondi filtri"
    }
  }

  hideTopics() {
    if (this.showTopics) {
      this.showTopics = false
      this.toggleTopicsLabel = "mostra filtri"
    }
  }


  getTopicElem(documentListed: any, elem: string) {
    return documentListed.topics![0][elem]
  }

  setStartDate(value: any) {
    this.startDate = value

    if (this.endDate && this.startDate) {
      this.getDocumentsbydate()
    } else {
      this.getDocuments(this.term)
    }
  }

  setEndDate(value: any) {
    this.endDate = value

    if (this.endDate && this.startDate) {
      this.getDocumentsbydate()
    } else {
      this.getDocuments(this.term)
    }
  }

  formatDate(date: string) {
    //NO  DASH FOR SOLR SEARCH
    let dateArray = date.split("T")[0].split("-")
    return dateArray[2] + dateArray[1] + dateArray[0]
  }

  formatDateSlash(date: string) {
    let formatDate

    if(date) {
      let dateArray = date.split("T")[0].split("-")
      formatDate = dateArray[2] + "/" + dateArray[1]+ "/" + + dateArray[0]
    } else {
      formatDate = "*"
    }

    return formatDate
  }

  getDocumentsbydate() {
    const dates = [];
    let currentDate = new Date(this.startDate);

    if (this.startDate && this.endDate) {
      while (currentDate <= new Date(this.endDate)) {
        dates.push(this.formatDate(currentDate.toISOString()));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      let payload = {
        "parentId": this.dossier._id,
        "dates": dates
      }


      this.loadingService.isLoading = true
      this.http.getDocumentsbydate(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          this.documents = []
          for (let documentRaw of response.documents!) {
            let document: any = {}
            for (let keyDocument of Object.keys(documentRaw)) {
              if (this.isParsable(documentRaw[keyDocument])) {
                document[keyDocument] = JSON.parse(documentRaw[keyDocument])
              } else {
                document[keyDocument] = documentRaw[keyDocument]
              }
            }

            this.documents.push(document)

            console.log("AAAA", this.documents)
            this.documents = JSON.parse(JSON.stringify(this.documents))

          }
        }
      })
    } else {
      alert("Selezionare una data di inizio e di fine")
    }
  }

  getDocumentById(payload: any) {
    this.http.getDocumentById(payload).subscribe({
      next: (documentRaw: any) => {
        this.loadingService.isLoading = false

        this.documents = []
        let document: any = {}

        for (let keyDocument of Object.keys(documentRaw)) {
          if (this.isParsable(documentRaw[keyDocument])) {
            document[keyDocument] = JSON.parse(documentRaw[keyDocument])
          } else {
            document[keyDocument] = documentRaw[keyDocument]
          }

        }

        this.documents.push(document)
        

        console.log("AAAA", this.documents)
        this.documents = JSON.parse(JSON.stringify(this.documents))

        // this.document = this.documents.find((rawDocument: IDocument) => document._id == rawDocument._id)!


      },
      error: (error: any) => {
        console.error(error)
        this.loadingService.isLoading = false

      }
    })
  }

  activeSelectMode() {
    this.sessionService.activeSelectDocument = true
  }

  deactiveSelectMode() {
    this.sessionService.activeSelectDocument = false
    this.sessionService.selectedDocuments = []
  }

  clear() {
    this.startDate = undefined
    this.endDate = undefined

    this.getDocuments()
  }

  selectDocument(documentListed: any) {
    if (!this.sessionService.activeSelectDocument) {
      if (this.selectedDocument == documentListed){
        this.selectedDocument = undefined
      } else {
        this.selectedDocument = documentListed
      }
    }
  }

  multipleSelectedDocument(document: any) {
    if (!this.sessionService.selectedDocuments.includes(document)) {
      this.sessionService.selectedDocuments.push(document)
    } else {
      this.sessionService.selectedDocuments = this.sessionService.selectedDocuments.filter((selectedDocument: any) => document._id != selectedDocument._id)
    }
  }

  deleteMassive() {
    this.isOpenDeleteMassive = false
    for (let document of this.sessionService.selectedDocuments) {
      this.deleteDocument(document)
    }
  }

  isMultipleSelectedDocument(document: any) {}
}
