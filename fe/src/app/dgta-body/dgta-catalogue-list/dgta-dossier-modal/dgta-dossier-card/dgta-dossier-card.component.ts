import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faTrash, faFileLines, faBarcode, faClockRotateLeft, faUsers, faFolderClosed, faFolderOpen, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { DgtaHistoryModalComponent } from '../../../dgta-home/dgta-home-card/dgta-history-modal/dgta-history-modal.component';
import { DgtaOwnersModalComponent } from '../../../dgta-home/dgta-home-card/dgta-owners-modal/dgta-owners-modal.component';
import { DgtaCollocationModalComponent } from '../../../dgta-home/dgta-home-card/dgta-collocation-modal/dgta-collocation-modal.component';
import { DgtaBarcodeModalComponent } from '../../../dgta-home/dgta-home-card/dgta-barcode-modal/dgta-barcode-modal.component';
import { DgtaTopicCardComponent } from '../../../dgta-home/dgta-topic-card/dgta-topic-card.component';
import { HttpService } from '../../../../http.service';
import { IDossier } from '../../../../interfaces/IDossier';
import { SessionService } from '../../../../session.service';
import { DgtaDocumentsModalComponent } from '../../../dgta-home/dgta-home-card/dgta-documents-modal/dgta-documents-modal.component';


@Component({
  selector: 'dgta-dossier-card',
  standalone: true,
  imports: [FontAwesomeModule, DgtaDocumentsModalComponent, DgtaHistoryModalComponent, DgtaOwnersModalComponent, DgtaCollocationModalComponent, CommonModule, DgtaTopicCardComponent, DgtaBarcodeModalComponent, DgtaOwnersModalComponent, DgtaCollocationModalComponent, DgtaHistoryModalComponent],
  templateUrl: './dgta-dossier-card.component.html',
  styleUrl: './dgta-dossier-card.component.scss'
})
export class DgtaDossierCardComponent {
  @Input() isAdd = false
  @Input() dossiers: IDossier[] = []
  @Output() goToDocumentsE = new EventEmitter<any>()

  dossier: IDossier = {}

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
  isOpenInfoDossierModal = false

  selectedDossier: any

  constructor(private http: HttpService,
              public sessionService: SessionService) { }

  // onMouseOverFolder() {
  //   this.faFolder = faFolderOpen
  // }

  // onMouseLeftFolder() {
  //   this.faFolder = faFolderClosed
  // }

  openViewBarcodeModal(dossier: IDossier) {
    this.dossier = dossier
    this.isOpenViewBarcodeModal = true
  }

  closeViewBarcodeModal() {
    this.dossier = {}
    this.isOpenViewBarcodeModal = false
  }

  deleteDossier(dossier: IDossier) {
    if (dossier.owners?.filter(owner => owner._id == this.sessionService.user!._id!).length == 0) {

      this.dossier = {}
  
      let payload = {
        _id: dossier._id
      }
      this.http.deleteDossier(payload).subscribe({
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

  openOwnersModal(dossier: IDossier) {
    this.dossier = dossier
    this.isOpenOwnersModal = true
  }

  closeOwnersModal() {
    this.dossier = {}
    this.isOpenOwnersModal = false
  }

  openCollocationModal(dossier: IDossier) {
    this.dossier = dossier
    this.isOpenCollocationModal = true
  }

  closeCollocationModal() {
    this.dossier = {}
    this.isOpenCollocationModal = false
  }

  openHistoryModal(dossier: IDossier) {
    this.dossier = dossier
    this.isOpenHistoryModal = true
  }

  closeHistoryModal() {
    this.dossier = {}
    this.isOpenHistoryModal = false
  }

  openDocumentsModal(dossier: IDossier) {
    this.dossier = dossier
    // this.isOpenDocumentsModal = true 
    this.goToDocumentsE.emit(dossier)
    this.sessionService.isOpenDocumentsModal = true
  }

  closeDocumentsModal() {
    this.isOpenDocumentsModal = false
    this.sessionService.isOpenDocumentsModal = false
  }

  openDossierInfo(dossier: IDossier) {
    this.dossier = dossier
    this.isOpenInfoDossierModal = true
  }

  closeDossierInfo() {
    this.dossier = {}
    this.isOpenInfoDossierModal = false
  }

  selectDossier(dossier: any) {
    if (!this.sessionService.activeSelect) {
      if (this.selectedDossier != dossier) {
        this.selectedDossier = dossier
      } else {
        this.selectedDossier = undefined
      }
    }
  }

  multipleSelectedDossier(dossier: any) {
    if (!this.sessionService.selectedDossiers.includes(dossier)) {
      this.sessionService.selectedDossiers.push(dossier)
    } else {
      this.sessionService.selectedDossiers = this.sessionService.selectedDossiers.filter((selectedDossier: any) => dossier._id != selectedDossier._id)
    }
  }

  isMultipleSelectedDossier(dossier: any) {

  }

  
}
