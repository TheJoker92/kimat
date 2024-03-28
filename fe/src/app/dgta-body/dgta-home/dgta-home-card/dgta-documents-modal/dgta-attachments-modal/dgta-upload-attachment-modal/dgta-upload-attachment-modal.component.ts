import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAttachment, IDocument } from '../../../../../../interfaces/IDocument';
import { ActionLogEnum } from '../../../../../../interfaces/ILog';
import { LoadingService } from '../../../../../../dgta-loading/loading.service';
import { HttpService } from '../../../../../../http.service';
import { IPlace } from '../../../../../../interfaces/IPlace';
import { SessionService } from '../../../../../../session.service';
import { CommonModule } from '@angular/common';
import { DgtaCameraAcquireModalComponent } from './dgta-camera-acquire-modal/dgta-camera-acquire-modal.component';
import { DgtaScannerlistModalComponent } from './dgta-scannerlist-modal/dgta-scannerlist-modal.component';

@Component({
  selector: 'dgta-upload-attachment-modal',
  standalone: true,
  imports: [CommonModule, DgtaCameraAcquireModalComponent, DgtaScannerlistModalComponent],
  templateUrl: './dgta-upload-attachment-modal.component.html',
  styleUrl: './dgta-upload-attachment-modal.component.scss'
})
export class DgtaUploadAttachmentModalComponent {
  @Input() document: IDocument = {}
  @Output() closeUpdateCollocationModalE = new EventEmitter()
  @Output() attachmentPdfE = new EventEmitter<IAttachment>()

  attachmentPdf: IAttachment = {}

  place: IPlace | any = {}

  isOpenCameraAcquireModal = false
  isOpenScannerListModal = false

  constructor(public sessionService: SessionService,
    private http: HttpService,
    private loadingService: LoadingService) {

    }

  cancel() {
    this.closeUpdateCollocationModalE.emit()
  }

  loadFile(ext: string) {
    document.getElementById("file-" + ext)?.click()
  }

  onUploadFile(e: any) {
    let file = e.target.files[0]
    if (file && file.type == "application/pdf") {
      const reader = new FileReader();

      console.log(this.document)

      reader.onload = (e: any) => {
        this.attachmentPdf = {
          name: file.name,
          ext: "pdf",
          base64: e.target.result.replace("data:application/pdf;base64,", ""),
          device: {
            id: "0",
            model: "manuale",
            vendor: "manuale"
          },
          user: this.sessionService.user
        }
      };

      reader.readAsDataURL(file);

    } else if (file.type != "application/pdf") {
      alert("Caricare soltanto file pdf")
    }
  }

  updateDocument() {
    this.attachmentPdfE.emit(this.attachmentPdf)
  }

  openCameraAcquireModal() {
    this.isOpenCameraAcquireModal = true
  }

  closeCameraAcquireModal() {
    this.isOpenCameraAcquireModal = false
  }

  openScannerListModal() {
    this.isOpenScannerListModal = true
  }

  closeScannerListModal() {
    this.isOpenScannerListModal = false
  }

  uploadFromCamera(base64: string) {
    this.attachmentPdf = {
      base64: base64,
      device: {
        model: window.navigator.userAgent,
        vendor: window.navigator.userAgent,
        type: "camera"
      },

    }
  }
}
