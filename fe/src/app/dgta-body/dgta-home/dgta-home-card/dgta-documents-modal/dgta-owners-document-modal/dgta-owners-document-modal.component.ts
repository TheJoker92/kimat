import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '../../../../../interfaces/IUser';
import { IDocument } from '../../../../../interfaces/IDocument';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'dgta-owners-document-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-owners-document-modal.component.html',
  styleUrl: './dgta-owners-document-modal.component.scss'
})
export class DgtaOwnersDocumentModalComponent {

  @Input() document: IDocument = {}
  @Output() closeOwnersModalE = new EventEmitter()

  owners: IUser[] = []

  faChevronLeft = faChevronLeft


  constructor() { }

  ngOnInit() {
    this.owners = this.document.owners!
  }

  cancel() {
    this.closeOwnersModalE.emit()
  }

  getStringSendEmail(email: string) {
    return "mailto:" + email + "?subject = Feedback&body = Message"
  }
}
