import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faStop, faBarcode } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from '../../../../../session.service';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dgta-search-document',
  standalone: true,
  imports: [FontAwesomeModule, ZXingScannerModule, CommonModule],
  templateUrl: './dgta-search-document.component.html',
  styleUrl: './dgta-search-document.component.scss'
})
export class DgtaSearchDocumentComponent {
  @Output() getDocumentsE = new EventEmitter()
  @Output() hideTopicsE = new EventEmitter()
  @Output() getDocumentByIdE = new EventEmitter()

  faSearch = faSearch
  faStop = faStop
  faBarcode = faBarcode

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  hasDevices: boolean = false;
  hasPermission: boolean = false;
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | any;
  isEnabledScan = false

  deviceCurrent: any;
  deviceSelected = "";

  allowedFormats = [4];

  constructor(private sessionService: SessionService) {

  }

  // ngAfterViewInit() {
  //   this.onCodeResult("fa0931b9-333a-498b-a6a4-c04add1b44e0")
  // }

  onSearch(e: any) {
    this.sessionService.terms["name"] = "*" + e.target.value + "*"

    this.getDocumentsE.emit("*" + e.target.value + "*")
    this.hideTopicsE.emit()
  }

  onCodeResult(result: any) {
    if (this.isUUID(result)) {
      this.getDocumentByIdE.emit({
        "_id": result
      })
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
