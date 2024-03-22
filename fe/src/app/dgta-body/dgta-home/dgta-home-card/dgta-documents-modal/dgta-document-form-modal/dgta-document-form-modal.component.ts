import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICatalogue } from '../../../../../interfaces/ICatalogue';
import { IPlace } from '../../../../../interfaces/IPlace';

@Component({
  selector: 'dgta-document-form-modal',
  standalone: true,
  imports: [],
  templateUrl: './dgta-document-form-modal.component.html',
  styleUrl: './dgta-document-form-modal.component.scss'
})
export class DgtaDocumentFormModalComponent {
  @Input() catalogue: ICatalogue = {}
  @Output() closeDocumentFormModalE = new EventEmitter()
  
  name: string = ""
  place: any = {}

  editName(e: any) {
    this.name = e.target.value
  }

  cancel() {
    this.closeDocumentFormModalE.emit()
  }

  addDocument() {

  }

  loadFile(ext: string) {
    document.getElementById("file-"+ext)?.click()
  }

  editLocation(label:string, e: any) {
    this.place[label] = e.target.value
    console.log(this.place)
  }
}
