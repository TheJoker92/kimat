import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DgtaHomeCardCatalogueFormModalComponent } from './dgta-home-card-catalogue-form-modal/dgta-home-card-catalogue-form-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dgta-home-card',
  standalone: true,
  imports: [FontAwesomeModule, DgtaHomeCardCatalogueFormModalComponent, CommonModule],
  templateUrl: './dgta-home-card.component.html',
  styleUrl: './dgta-home-card.component.scss'
})
export class DgtaHomeCardComponent {
  faPlus = faPlus

  isOpenCatalogueFormModal = false

  openModalCatalogueFormModal() {
    this.isOpenCatalogueFormModal = true
  }

  closeCatalogueFormModal() {
    this.isOpenCatalogueFormModal = false
  }
}
