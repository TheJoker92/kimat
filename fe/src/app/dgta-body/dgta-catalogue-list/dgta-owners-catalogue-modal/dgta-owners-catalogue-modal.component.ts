import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ICatalogue } from '../../../interfaces/ICatalogue';
import { IUser } from '../../../interfaces/IUser';

@Component({
  selector: 'dgta-owners-catalogue-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-owners-catalogue-modal.component.html',
  styleUrl: './dgta-owners-catalogue-modal.component.scss'
})
export class DgtaOwnersCatalogueModalComponent {
  
  @Input() catalogue: ICatalogue = {}
  @Output() closeOwnersModalE = new EventEmitter()


  faChevronLeft = faChevronLeft
  
  owners: IUser[] = []

  constructor() { }

  ngOnInit() {
    this.owners = this.catalogue.owners!
  }

  cancel() {
    this.closeOwnersModalE.emit()
  }

  getStringSendEmail(email: string) {
    return "mailto:" + email + "?subject = Feedback&body = Message"
  }
}
