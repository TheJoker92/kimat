import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faTrash, faFileLines, faBarcode, faClockRotateLeft, faUsers, faFolderClosed, faFolderOpen, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
// import { DgtaOwnersModalComponent } from './dgta-owners-modal/dgta-owners-modal.component';
// import { DgtaCollocationModalComponent } from './dgta-collocation-modal/dgta-collocation-modal.component';
// import { DgtaHistoryModalComponent } from './dgta-history-modal/dgta-history-modal.component';
// import { DgtaDossiersModalComponent } from './dgta-dossiers-modal/dgta-dossiers-modal.component';
// import { DgtaTopicCardComponent } from '../dgta-topic-card/dgta-topic-card.component';
import { HttpService } from '../../http.service';
import { ICatalogue } from '../../interfaces/ICatalogue';
import { SessionService } from '../../session.service';
import { DgtaCatalogueFormModalComponent } from './dgta-catalogue-form-modal/dgta-catalogue-form-modal.component';
import { DgtaBarcodeCatalogueModalComponent } from './dgta-barcode-catalogue-modal/dgta-barcode-catalogue-modal.component';

@Component({
  selector: 'dgta-catalogue-list',
  standalone: true,
  imports: [DgtaCatalogueFormModalComponent, DgtaBarcodeCatalogueModalComponent],
  templateUrl: './dgta-catalogue-list.component.html',
  styleUrl: './dgta-catalogue-list.component.scss'
})
export class DgtaCatalogueListComponent {

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
  isOpenDossiersModal = false
  isOpenInfoCatalogueModal = false

  selectedCatalogue: any


  isMultipleSelectedCatalogue(catalogue: any) {

  }

  

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
    if (catalogue.owners?.filter((owner: any) => owner.id == this.sessionService.user!.id!).length == 0) {

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

  openDossiersModal(catalogue: ICatalogue) {
    this.catalogue = catalogue
    this.isOpenDossiersModal = true
    this.sessionService.isOpenDossiersModal = true
  }

  closeDossiersModal() {
    this.catalogue = {}
    this.isOpenDossiersModal = false
    this.sessionService.isOpenDossiersModal = false
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
}