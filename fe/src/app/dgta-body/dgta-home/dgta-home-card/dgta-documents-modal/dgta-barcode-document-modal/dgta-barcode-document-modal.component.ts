import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { IDocument } from '../../../../../interfaces/IDocument';

@Component({
  selector: 'dgta-barcode-document-modal',
  standalone: true,
  imports: [NgxBarcode6Module],
  templateUrl: './dgta-barcode-document-modal.component.html',
  styleUrl: './dgta-barcode-document-modal.component.scss'
})
export class DgtaBarcodeDocumentModalComponent {
  @Input() document: IDocument = {}
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
    // mywindow.document.write('<h2>Catalogo<h2>');
    // mywindow.document.write(document.getElementById(this.document.parentId!)!.innerHTML);
    mywindow.document.write('<h2>Documento<h2>');
    mywindow.document.write('idDocument ' + document.getElementById(this.document.id!)!.innerHTML + 'idDocument ');
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

  }
}
