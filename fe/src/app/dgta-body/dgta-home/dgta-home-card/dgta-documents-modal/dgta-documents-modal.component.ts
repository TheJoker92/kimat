import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
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

@Component({
  selector: 'dgta-documents-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DgtaFilterDocumentsComponent, DgtaHeaderComponent, DgtaTopicCardComponent, DgtaBarcodeDocumentModalComponent, DgtaDocumentFormModalComponent, DgtaOwnersDocumentModalComponent, DgtaCollocationDocumentModalComponent, DgtaHistoryDocumentModalComponent, DgtaStateDocumentModalComponent, PdfViewerModule, DgtaAttachmentsModalComponent, DgtaSearchDocumentComponent],
  templateUrl: './dgta-documents-modal.component.html',
  styleUrl: './dgta-documents-modal.component.scss'
})
export class DgtaDocumentsModalComponent {

  @Input() catalogue: ICatalogue = {}
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
      parentId: this.catalogue.id
    }

    if (term) {
      payload["name"] = term
      // payload["topics"] = term
    }

    if (dates) {

    }

    this.loadingService.isLoading = true
    this.http.getDocuments(payload).subscribe({
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
        if (term) {

          let payload: any = {
            parentId: this.catalogue.id
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

                if (this.documents.filter((presentedDocument: IDocument) => document.id == presentedDocument.id).length == 0) {
                  this.documents.push(document)
                }

                console.log("AAAA", this.documents)
                this.documents = JSON.parse(JSON.stringify(this.documents))
              }
              // this.document = this.documents.find((rawDocument: IDocument) => document.id == rawDocument.id)!


            },
            error: (error: any) => {
              console.error(error)
              this.loadingService.isLoading = false

            }
          })

          // this.document = this.documents.find((rawDocument: IDocument) => document.id == rawDocument.id)!
        }


      },
      error: (error: any) => {
        console.error(error)
        this.loadingService.isLoading = false

      }
    })
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
      id: this.document.history!.length.toString(),
      date: new Date().toISOString(),
      user: this.sessionService.user,
      resourceId: this.document.id,
      actionLog: ActionLogEnum.UPDATE_DOCUMENT_LAST_VIEW
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
      "placement": JSON.stringify(this.document.placement),
      "owners": JSON.stringify(this.document.owners),
      "deliberationDate": this.document.deliberationDate
    }

    this.loadingService.isLoading = true
    this.http.addDocument(payload).subscribe({
      next: (response: any) => {
        this.loadingService.isLoading = false

        if (response.code == 200) {
          alert("Accesso inserito in registro")
          this.loadingService.isLoading = false
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

  closeAttachmentsModal(document: IDocument) {
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
      this.document = this.documents.find((rawDocument: IDocument) => this.document.id == rawDocument.id)!
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
    if (document.owners?.filter(owner => owner.id == this.sessionService.user!.id!).length == 0) {

      this.document = {}
  
      let payload = {
        id: document.id
      }
      this.http.deleteDocuments(payload).subscribe({
        next: (response: any) => {
          if (response.code == 200) {
            alert("L'operazione è riuscita")
            this.getDocuments()
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
        "parentId": this.catalogue.id,
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

        // this.document = this.documents.find((rawDocument: IDocument) => document.id == rawDocument.id)!


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
  }

  deleteMassive() {
    //TODO
  }

  clear() {
    this.startDate = undefined
    this.endDate = undefined

    this.getDocuments()
  }

  selectDocument(documentListed: any) {
    if (this.selectedDocument == documentListed){
      this.selectedDocument = undefined
    } else {
      this.selectedDocument = documentListed
    }
  }
}
