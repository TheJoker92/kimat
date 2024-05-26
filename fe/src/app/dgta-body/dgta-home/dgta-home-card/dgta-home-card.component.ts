import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faTrash, faFileLines, faBarcode, faClockRotateLeft, faUsers, faFolderClosed, faFolderOpen, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { DgtaBarcodeModalComponent } from './dgta-barcode-modal/dgta-barcode-modal.component';
import { HttpService } from '../../../http.service';
import { DgtaOwnersModalComponent } from './dgta-owners-modal/dgta-owners-modal.component';
import { DgtaCollocationModalComponent } from './dgta-collocation-modal/dgta-collocation-modal.component';
import { DgtaHistoryModalComponent } from './dgta-history-modal/dgta-history-modal.component';
import { DgtaDocumentsModalComponent } from './dgta-documents-modal/dgta-documents-modal.component';
import { DgtaTopicCardComponent } from '../dgta-topic-card/dgta-topic-card.component';
import { SessionService } from '../../../session.service';
import { ICatalogue } from '../../../interfaces/ICatalogue';
import { DgtaCatalogueFormModalComponent } from '../../dgta-catalogue-list/dgta-catalogue-form-modal/dgta-catalogue-form-modal.component';
import { DgtaBarcodeCatalogueModalComponent } from '../../dgta-catalogue-list/dgta-barcode-catalogue-modal/dgta-barcode-catalogue-modal.component';
import { DgtaHistoryCatalogueModalComponent } from '../../dgta-catalogue-list/dgta-history-catalogue-modal/dgta-history-catalogue-modal.component';
import { DgtaCollocationCatalogueModalComponent } from '../../dgta-catalogue-list/dgta-collocation-catalogue-modal/dgta-collocation-catalogue-modal.component';
import { DgtaOwnersCatalogueModalComponent } from '../../dgta-catalogue-list/dgta-owners-catalogue-modal/dgta-owners-catalogue-modal.component';
import { DgtaDossierModalComponent } from '../../dgta-catalogue-list/dgta-dossier-modal/dgta-dossier-modal.component';

@Component({
  selector: 'dgta-home-card',
  standalone: true,
  imports: [FontAwesomeModule, DgtaDossierModalComponent, DgtaCatalogueFormModalComponent, DgtaBarcodeCatalogueModalComponent, DgtaHistoryCatalogueModalComponent, DgtaOwnersCatalogueModalComponent, DgtaCollocationCatalogueModalComponent, CommonModule, DgtaTopicCardComponent, DgtaBarcodeModalComponent, DgtaOwnersModalComponent, DgtaCollocationModalComponent, DgtaHistoryModalComponent, DgtaDocumentsModalComponent],
  templateUrl: './dgta-home-card.component.html',
  styleUrl: './dgta-home-card.component.scss'
})
export class DgtaHomeCardComponent {

  @Input() isAdd = false
  @Input() catalogues: ICatalogue[] = []

  @Output() goToDossierE = new EventEmitter<any>()

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
  isOpenDossierModal = false
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
    if (catalogue.owners?.filter(owner => owner.id == this.sessionService.user!.id!).length == 0) {

      this.catalogue = {}
  
      let payload = {
        id: catalogue.id
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

  openDossierModal(catalogue: ICatalogue) {
    this.catalogue = catalogue
    this.goToDossierE.emit(catalogue)
  }

  closeDossierModal() {
    this.catalogue = {}
    this.isOpenDossierModal = false
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
      this.sessionService.selectedCatalogues = this.sessionService.selectedCatalogues.filter((selectedCatalogue: any) => catalogue.id != selectedCatalogue.id)
    }
  }

  isMultipleSelectedCatalogue(catalogue: any) {

  }

  
}
