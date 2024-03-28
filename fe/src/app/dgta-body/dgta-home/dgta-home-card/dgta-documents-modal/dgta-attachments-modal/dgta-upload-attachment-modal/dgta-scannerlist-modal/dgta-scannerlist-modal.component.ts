import { Component, EventEmitter, Output } from '@angular/core';
import { HttpService } from '../../../../../../../http.service';
import { IDevice } from '../../../../../../../interfaces/IDevice';

@Component({
  selector: 'dgta-scannerlist-modal',
  standalone: true,
  imports: [],
  templateUrl: './dgta-scannerlist-modal.component.html',
  styleUrl: './dgta-scannerlist-modal.component.scss'
})
export class DgtaScannerlistModalComponent {
  @Output() closeScannerListModalE = new EventEmitter<string>()

  scanners: IDevice[] = []

  constructor(private http: HttpService) {
    // this.http.getScannerList()
  }

  cancel() {
    this.closeScannerListModalE.emit()
  }

  updateDocument() {
    this.closeScannerListModalE.emit()
  }
}
