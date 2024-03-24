import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
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

@Component({
  selector: 'dgta-documents-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DgtaBarcodeDocumentModalComponent, DgtaDocumentFormModalComponent, DgtaOwnersDocumentModalComponent, DgtaCollocationDocumentModalComponent, DgtaHistoryDocumentModalComponent, DgtaStateDocumentModalComponent],
  templateUrl: './dgta-documents-modal.component.html',
  styleUrl: './dgta-documents-modal.component.scss'
})
export class DgtaDocumentsModalComponent {

  @Input() catalogue: ICatalogue = {}
  @Output() closeDocumentsModalE = new EventEmitter()

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
  
  


  isOpenAttachmentModal = false
  isOpenViewBarcodeModal = false
  isOpenHistoryDocumentModal = false
  isOpenCollocationModal = false
  isOpenOwnersModal = false
  isOpenStateModal = false
  
  constructor(private http: HttpService,
              private loadingService: LoadingService) {
    this.getDocuments()
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

  getDocuments() {
    this.loadingService.isLoading = true
    this.http.getDocuments().subscribe({
      next: (response: any) => {
        this.loadingService.isLoading = false

        this.documents = []
        for (let documentRaw of response.documents!) {
          let document: any = {}
          for (let keyDocument of Object.keys(documentRaw)) {
            if (this.isParsable(documentRaw[keyDocument])) {
              document[keyDocument] =  JSON.parse(documentRaw[keyDocument])
            } else {
              document[keyDocument] = documentRaw[keyDocument]
            }
          }

          this.documents.push(document)
          console.log(document, documentRaw)
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
    this.isOpenAttachmentModal = true
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

  closeCollocationModal(document: IDocument) {
    this.document = {}
    this.isOpenCollocationModal = false
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

  closeStateModal(document:IDocument) {
    this.document = {}
    this.isOpenStateModal = false
  }

  deleteDocument(document: IDocument) {
    this.document = {}

    let payload = {
      id: document.id
    }
    this.http.deleteDocuments(payload).subscribe({
      next: (response: any) => {
        if(response.code == 200) {
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
    
  }
}
