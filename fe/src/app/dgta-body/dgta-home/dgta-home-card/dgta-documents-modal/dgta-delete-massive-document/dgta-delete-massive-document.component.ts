import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dgta-delete-massive-document',
  standalone: true,
  imports: [],
  templateUrl: './dgta-delete-massive-document.component.html',
  styleUrl: './dgta-delete-massive-document.component.scss'
})
export class DgtaDeleteMassiveDocumentComponent {
  @Output() confirmE = new EventEmitter()
  @Output() closeE = new EventEmitter()

  confirm() {
    this.confirmE.emit()
  }

  cancel() {
    this.closeE.emit()
  }
}
