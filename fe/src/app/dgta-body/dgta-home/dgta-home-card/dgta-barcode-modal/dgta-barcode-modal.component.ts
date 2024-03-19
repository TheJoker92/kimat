import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { NgxBarcode6Module } from 'ngx-barcode6';

@Component({
  selector: 'dgta-barcode-modal',
  standalone: true,
  imports: [NgxBarcode6Module],
  templateUrl: './dgta-barcode-modal.component.html',
  styleUrl: './dgta-barcode-modal.component.scss'
})
export class DgtaBarcodeModalComponent {
  @Input() catalogue: ICatalogue = {}
  @Output() closeBarcodeViewModalE = new EventEmitter()

  constructor() { }

  cancel() {
    this.closeBarcodeViewModalE.emit()
  }

  print() {
    this.closeBarcodeViewModalE.emit() 

    var mywindow = window.open('', 'PRINT', 'height=400,width=600')!

    mywindow.document.write('<html><head>');
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById(this.catalogue.id!)!.innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

  }
}
