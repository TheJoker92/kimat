import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDocument } from '../../../../../interfaces/IDocument';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'dgta-attachments-modal',
  standalone: true,
  imports: [CommonModule, PdfViewerModule],
  templateUrl: './dgta-attachments-modal.component.html',
  styleUrl: './dgta-attachments-modal.component.scss'
})
export class DgtaAttachmentsModalComponent {

  @Input() document: IDocument = {}
  @Output() getDocumentsE = new EventEmitter()
  @Output() closeAttahcmentsModalE = new EventEmitter()
  
  isOpenAddAttachmentModal = false
  srcPdf = ""

  ngOnInit() {
    this.getPdf()
  }

  getPdf() {
    fetch("https://127.0.0.1:8000/pdf/" + this.document.id!).then((result) => {
      return result.json()
    })
    .then((result) => {
      console.log(result)
      if (result.error) {
        this.srcPdf = ""
      } else {
        this.srcPdf = result.base64
      }
    })
  }

  getDocumentsEmitter() {
    this.getDocumentsE.emit()
  }

  closeAddAttachmentModal() {
    this.isOpenAddAttachmentModal = false
  }

  openAddAttachmentModal() {
    this.isOpenAddAttachmentModal = true
  }

  close() {
    this.closeAttahcmentsModalE.emit()
  }
}
