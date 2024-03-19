import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICatalogue } from '../../../../interfaces/ICatalogue';

@Component({
  selector: 'dgta-barcode-modal',
  standalone: true,
  imports: [],
  templateUrl: './dgta-barcode-modal.component.html',
  styleUrl: './dgta-barcode-modal.component.scss'
})
export class DgtaBarcodeModalComponent {
  @Input() catalogue: ICatalogue = {}
  @Output() closeBarcodeViewModalE = new EventEmitter()

  cancel() {
    this.closeBarcodeViewModalE.emit()
  }

  print() {
    this.closeBarcodeViewModalE.emit() 
  }
}
