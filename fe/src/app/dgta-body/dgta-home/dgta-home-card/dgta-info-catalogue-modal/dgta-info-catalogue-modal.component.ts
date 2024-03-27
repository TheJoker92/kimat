import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faFileLines, faBarcode, faClockRotateLeft, faUsers, faFolderClosed, faFolderOpen, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { ICatalogue } from '../../../../interfaces/ICatalogue';

@Component({
  selector: 'dgta-info-catalogue-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-info-catalogue-modal.component.html',
  styleUrl: './dgta-info-catalogue-modal.component.scss'
})
export class DgtaInfoCatalogueModalComponent {
 @Input() catalogue: ICatalogue = {}
 @Output() openDocumentModalE = new EventEmitter()

 faFileLines = faFileLines

}
