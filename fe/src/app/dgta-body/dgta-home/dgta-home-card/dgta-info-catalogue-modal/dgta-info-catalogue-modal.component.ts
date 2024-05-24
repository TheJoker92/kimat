import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faFileLines, faBarcode, faClockRotateLeft, faUsers, faFolderClosed, faFolderOpen, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { IDossier } from '../../../../interfaces/IDossier';

@Component({
  selector: 'dgta-info-dossier-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-info-dossier-modal.component.html',
  styleUrl: './dgta-info-dossier-modal.component.scss'
})
export class DgtaInfoDossierModalComponent {
 @Input() dossier: IDossier = {}
 @Output() openDocumentModalE = new EventEmitter()

 faFileLines = faFileLines

}
