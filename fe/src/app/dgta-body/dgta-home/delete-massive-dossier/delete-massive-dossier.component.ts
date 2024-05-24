import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dgta-delete-massive-dossier',
  standalone: true,
  imports: [],
  templateUrl: './delete-massive-dossier.component.html',
  styleUrl: './delete-massive-dossier.component.scss'
})
export class DeleteMassiveDossierComponent {

  @Output() confirmE = new EventEmitter()
  @Output() closeE = new EventEmitter()

  confirm() {
    this.confirmE.emit()
  }

  cancel() {
    this.closeE.emit()
  }

}
