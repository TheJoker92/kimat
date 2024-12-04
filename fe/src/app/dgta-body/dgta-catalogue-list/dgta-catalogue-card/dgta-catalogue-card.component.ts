import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faTrash, faFileLines, faBarcode, faClockRotateLeft, faUsers, faFolderClosed, faFolderOpen, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../http.service';
import { SessionService } from '../../../session.service';
import { ICatalogue } from '../../../interfaces/ICatalogue';
import { DgtaCatalogueFormModalComponent } from '../dgta-catalogue-form-modal/dgta-catalogue-form-modal.component';
import { DgtaTopicCardCatalogueComponent } from '../dgta-topic-card-catalogue/dgta-topic-card-catalogue.component';
import { DgtaBarcodeCatalogueModalComponent } from '../dgta-barcode-catalogue-modal/dgta-barcode-catalogue-modal.component';
import { DgtaOwnersCatalogueModalComponent } from '../dgta-owners-catalogue-modal/dgta-owners-catalogue-modal.component';
import { DgtaCollocationCatalogueModalComponent } from '../dgta-collocation-catalogue-modal/dgta-collocation-catalogue-modal.component';
import { DgtaHistoryCatalogueModalComponent } from '../dgta-history-catalogue-modal/dgta-history-catalogue-modal.component';

@Component({
  selector: 'dgta-catalogue-card',
  standalone: true,
  imports: [FontAwesomeModule, DgtaCatalogueFormModalComponent, CommonModule, DgtaTopicCardCatalogueComponent, DgtaBarcodeCatalogueModalComponent, DgtaOwnersCatalogueModalComponent, DgtaCollocationCatalogueModalComponent, DgtaHistoryCatalogueModalComponent],
  templateUrl: './dgta-catalogue-card.component.html',
  styleUrl: './dgta-catalogue-card.component.scss'
})
export class DgtaCatalogueCardComponent {

  @Input() isAdd = false
  @Input() catalogues: ICatalogue[] = []

  catalogue: ICatalogue = {}

  faFolder = faFolderClosed
  faUsers = faUsers
  faMapMarker = faMapMarker
  faClockRotateLeft = faClockRotateLeft
  faBarcode = faBarcode
  faFileLines = faFileLines
  faTrash = faTrash
  faInfoCircle = faInfoCircle


  isOpenViewBarcodeModal = false
  isOpenOwnersModal = false
  isOpenCollocationModal = false
  isOpenHistoryModal = false
  isOpenDocumentsModal = false
  isOpenInfoCatalogueModal = false

  selectedCatalogue: any

  constructor(private http: HttpService,
              public sessionService: SessionService) { }

  // onMouseOverFolder() {
  //   this.faFolder = faFolderOpen
  // }

  // onMouseLeftFolder() {
  //   this.faFolder = faFolderClosed
  // }

  openViewBarcodeModal(catalogue: ICatalogue) {
    this.catalogue = catalogue
    this.isOpenViewBarcodeModal = true
  }

  closeViewBarcodeModal() {
    this.catalogue = {}
    this.isOpenViewBarcodeModal = false
  }

  deleteCatalogue(catalogue: ICatalogue) {
    if (catalogue.owners?.filter(owner => owner._id == this.sessionService.user!._id!).length == 0) {

      this.catalogue = {}
  
      let payload = {
        _id: catalogue._id
      }
      this.http.deleteCatalogue(payload).subscribe({
        next: (response: any) => {
          if(response.code == 200) {
            alert("L'operazione è riuscita")
            window.location.reload()
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

  openOwnersModal(catalogue: ICatalogue) {
    this.catalogue = catalogue
    this.isOpenOwnersModal = true
  }

  closeOwnersModal() {
    this.catalogue = {}
    this.isOpenOwnersModal = false
  }

  openCollocationModal(catalogue: ICatalogue) {
    this.catalogue = catalogue
    this.isOpenCollocationModal = true
  }

  closeCollocationModal() {
    this.catalogue = {}
    this.isOpenCollocationModal = false
  }

  openHistoryModal(catalogue: ICatalogue) {
    this.catalogue = catalogue
    this.isOpenHistoryModal = true
  }

  closeHistoryModal() {
    this.catalogue = {}
    this.isOpenHistoryModal = false
  }

  openDocumentsModal(catalogue: ICatalogue) {
    this.catalogue = catalogue
    this.isOpenDocumentsModal = true
    this.sessionService.isOpenDocumentsModal = true
  }

  closeDocumentsModal() {
    this.catalogue = {}
    this.isOpenDocumentsModal = false
    this.sessionService.isOpenDocumentsModal = false
  }

  openCatalogueInfo(catalogue: ICatalogue) {
    this.catalogue = catalogue
    this.isOpenInfoCatalogueModal = true
  }

  closeCatalogueInfo() {
    this.catalogue = {}
    this.isOpenInfoCatalogueModal = false
  }

  selectCatalogue(catalogue: any) {
    if (!this.sessionService.activeSelect) {
      if (this.selectedCatalogue != catalogue) {
        this.selectedCatalogue = catalogue
      } else {
        this.selectedCatalogue = undefined
      }
    }
  }

  multipleSelectedCatalogue(catalogue: any) {
    if (!this.sessionService.selectedCatalogues.includes(catalogue)) {
      this.sessionService.selectedCatalogues.push(catalogue)
    } else {
      this.sessionService.selectedCatalogues = this.sessionService.selectedCatalogues.filter((selectedCatalogue: any) => catalogue._id != selectedCatalogue._id)
    }
  }

  isMultipleSelectedCatalogue(catalogue: any) {

  }

  
}
