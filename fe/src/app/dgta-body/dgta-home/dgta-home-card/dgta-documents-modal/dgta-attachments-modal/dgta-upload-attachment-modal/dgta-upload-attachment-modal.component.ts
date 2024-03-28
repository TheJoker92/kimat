import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAttachment, IDocument } from '../../../../../../interfaces/IDocument';
import { ActionLogEnum } from '../../../../../../interfaces/ILog';
import { LoadingService } from '../../../../../../dgta-loading/loading.service';
import { HttpService } from '../../../../../../http.service';
import { IPlace } from '../../../../../../interfaces/IPlace';
import { SessionService } from '../../../../../../session.service';

@Component({
  selector: 'dgta-upload-attachment-modal',
  standalone: true,
  imports: [],
  templateUrl: './dgta-upload-attachment-modal.component.html',
  styleUrl: './dgta-upload-attachment-modal.component.scss'
})
export class DgtaUploadAttachmentModalComponent {
  @Input() document: IDocument = {}
  @Output() closeUpdateCollocationModalE = new EventEmitter()
  @Output() attachmentPdfE = new EventEmitter<IAttachment>()

  attachmentPdf: IAttachment = {}

  place: IPlace | any = {}

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
}
