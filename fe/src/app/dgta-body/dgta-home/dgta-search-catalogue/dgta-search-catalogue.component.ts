import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SessionService } from '../../../session.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faBarcode } from '@fortawesome/free-solid-svg-icons';
import { BarcodeScannerLivestreamComponent, BarcodeScannerLivestreamModule } from 'ngx-barcode-scanner';

@Component({
  selector: 'dgta-search-catalogue',
  standalone: true,
  imports: [FontAwesomeModule, BarcodeScannerLivestreamModule],
  templateUrl: './dgta-search-catalogue.component.html',
  styleUrl: './dgta-search-catalogue.component.scss'
})
export class DgtaSearchCatalogueComponent {
  @Output() getCataloguesE = new EventEmitter()
  @Output() hideTopicsE = new EventEmitter()

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent = new BarcodeScannerLivestreamComponent();

  barcodeValue: any


  faSearch = faSearch
  faBarcode = faBarcode

  constructor(private sessionService: SessionService) {

  }

  onSearch(e: any) {
    this.sessionService.terms = {
      "title": "*" + e.target.value + "*"
    }


    this.getCataloguesE.emit()
    this.hideTopicsE.emit()
  }

  onValueChanges(result: any) {
    if (this.isGUID(result.codeResult.code)) {
      this.sessionService.terms = {
        "id": result.codeResult.code
      }

      this.getCataloguesE.emit()
      this.hideTopicsE.emit()

      this.barcodeScanner.stop()
    } else {
      alert("Barcode non valido")
    }

  }

  isGUID(str: any) {
    const GUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return GUIDRegex.test(str);
  }

  startScan() {
    this.barcodeScanner.start()
  }
}
