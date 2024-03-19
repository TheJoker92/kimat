import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faFileLines, faBarcode, faClockRotateLeft, faUsers, faFolderClosed, faFolderOpen, faFolderPlus, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { DgtaHomeCardCatalogueFormModalComponent } from './dgta-home-card-catalogue-form-modal/dgta-home-card-catalogue-form-modal.component';
import { CommonModule } from '@angular/common';
import { ICatalogue } from '../../../interfaces/ICatalogue';
import { DgtaBarcodeModalComponent } from './dgta-barcode-modal/dgta-barcode-modal.component';

@Component({
  selector: 'dgta-home-card',
  standalone: true,
  imports: [FontAwesomeModule, DgtaHomeCardCatalogueFormModalComponent, CommonModule, DgtaBarcodeModalComponent],
  templateUrl: './dgta-home-card.component.html',
  styleUrl: './dgta-home-card.component.scss'
})
export class DgtaHomeCardComponent {

  @Input() isAdd = false
  @Input() catalogue: ICatalogue = {}
  faFolderPlus = faFolderPlus
  faFolder = faFolderClosed
  faUsers = faUsers
  faMapMarker = faMapMarker
  faClockRotateLeft = faClockRotateLeft
  faBarcode = faBarcode
  faFileLines = faFileLines
  faTrash = faTrash


  isOpenCatalogueFormModal = false
  isOpenViewBarcodeModal = false

  constructor() { }

  openModalCatalogueFormModal() {
    this.isOpenCatalogueFormModal = true
  }

  closeCatalogueFormModal() {
    this.isOpenCatalogueFormModal = false
  }

  onMouseOverFolder() {
    this.faFolder = faFolderOpen
  }

  onMouseLeftFolder() {
    this.faFolder = faFolderClosed
  }

  openViewBarcodeModal() {
    this.isOpenViewBarcodeModal = true
  }

  closeViewBarcodeModal() {
    this.isOpenViewBarcodeModal = false
  }
}
