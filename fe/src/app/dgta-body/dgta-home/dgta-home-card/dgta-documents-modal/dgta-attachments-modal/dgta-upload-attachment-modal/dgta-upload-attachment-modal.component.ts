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
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'dgta-upload-attachment-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DgtaCameraAcquireModalComponent, DgtaScannerlistModalComponent],
  templateUrl: './dgta-upload-attachment-modal.component.html',
  styleUrl: './dgta-upload-attachment-modal.component.scss'
})
export class DgtaUploadAttachmentModalComponent {
  @Input() document: IDocument = {}
  @Input() attachmentPdf: any = {}
  @Output() closeUploadAttachmentModalE = new EventEmitter()
  @Output() attachmentPdfE = new EventEmitter<IAttachment>()

  faChevronLeft = faChevronLeft

  @Input() startUpload = false
  @Input() step = 1

  multipleFiles = []


  place: IPlace | any = {}

  isOpenCameraAcquireModal = false
  isOpenScannerListModal = false

  constructor(public sessionService: SessionService,
    private http: HttpService,
    private loadingService: LoadingService) {

    }

  ngOnChanges() {
    console.log(this.attachmentPdf.progressUpload)
  }

  cancel() {
    this.closeUploadAttachmentModalE.emit()
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
            _id: "0",
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

  delete() {
    this.attachmentPdf = {}
  }

  

  getReducedLabelName(label: string) {
    let result = label

    if (result.length > 20) {
      result = label.replace(".pdf", "").substring(0, 20) + "..."
    }


    return result
  }
}
