import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dgta-delete-massive-catalogue',
  standalone: true,
  imports: [],
  templateUrl: './delete-massive-catalogue.component.html',
  styleUrl: './delete-massive-catalogue.component.scss'
})
export class DeleteMassiveCatalogueComponent {

  @Output() confirmE = new EventEmitter()
  @Output() closeE = new EventEmitter()

  confirm() {
    this.confirmE.emit()
  }

  cancel() {
    this.closeE.emit()
  }

}
