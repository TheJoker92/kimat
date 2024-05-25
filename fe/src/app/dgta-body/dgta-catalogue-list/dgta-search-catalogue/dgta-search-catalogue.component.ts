import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { SessionService } from '../../../session.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faBarcode, faStop } from '@fortawesome/free-solid-svg-icons';
import { BarcodeScannerLivestreamComponent, BarcodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'dgta-search-catalogue',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, BarcodeScannerLivestreamModule, ZXingScannerModule],
  templateUrl: './dgta-search-catalogue.component.html',
  styleUrl: './dgta-search-catalogue.component.scss'
})
export class DgtaSearchCatalogueComponent {
  @Output() getCataloguesE = new EventEmitter()
  @Output() hideTopicsE = new EventEmitter()

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  hasDevices: boolean = false;
  hasPermission: boolean = false;
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | any;
  isEnabledScan = false


  faSearch = faSearch
  faBarcode = faBarcode
  faStop = faStop

  deviceCurrent: any;
  deviceSelected = "";

  allowedFormats = [4];


  constructor(private sessionService: SessionService) {

  }



  onSearch(e: any) {
    this.sessionService.terms = {
      "title": "*" + e.target.value + "*"
    }


    this.getCataloguesE.emit()
    this.hideTopicsE.emit()
  }

  onCodeResult(result: any) {
    if (this.isUUID(result)) {
      this.sessionService.terms = {
        "id": result
      }

      this.getCataloguesE.emit()
      this.hideTopicsE.emit()

    } else {
      alert("Barcode non valido")
    }

    this.stopScan()

  }

  isUUID(str: any) {
    const UUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return UUIDRegex.test(str);
  }


  startScan() {
    this.isEnabledScan = true
  }

  stopScan() {
    this.isEnabledScan = false
  }

  onDeviceSelectChange(selected: any) {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find((x: any) => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

  onDeviceChange(device: any) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  onTorchCompatible(isCompatible: any): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  onCamerasFound(devices: any): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onHasPermission(has: any) {
    this.hasPermission = has;
  }

}
