import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'dgta-documents-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-documents-modal.component.html',
  styleUrl: './dgta-documents-modal.component.scss'
})
export class DgtaDocumentsModalComponent {

  @Input() catalogue: ICatalogue = {}
  @Output() closeDocumentsModalE = new EventEmitter()

  faFolderPlus = faFolderPlus

  close() {
    this.closeDocumentsModalE.emit()
  }

  openModalDocuemntFormModal() {

  }
}
