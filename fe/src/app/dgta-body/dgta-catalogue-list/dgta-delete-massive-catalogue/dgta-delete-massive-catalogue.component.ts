import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dgta-delete-massive-catalogue',
  standalone: true,
  imports: [],
  templateUrl: './dgta-delete-massive-catalogue.component.html',
  styleUrl: './dgta-delete-massive-catalogue.component.scss'
})
export class DgtaDeleteMassiveCatalogueComponent {

  @Output() confirmE = new EventEmitter()
  @Output() closeE = new EventEmitter()

  confirm() {
    this.confirmE.emit()
  }

  cancel() {
    this.closeE.emit()
  }

}
