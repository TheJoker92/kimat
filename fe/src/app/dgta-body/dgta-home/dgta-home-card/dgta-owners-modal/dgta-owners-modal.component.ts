import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDossier } from '../../../../interfaces/IDossier';
import { IUser } from '../../../../interfaces/IUser';
import { CommonModule } from '@angular/common';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'dgta-owners-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-owners-modal.component.html',
  styleUrl: './dgta-owners-modal.component.scss'
})
export class DgtaOwnersModalComponent {
  @Input() dossier: IDossier = {}
  @Output() closeOwnersModalE = new EventEmitter()


  faChevronLeft = faChevronLeft
  
  owners: IUser[] = []

  constructor() { }

  ngOnInit() {
    this.owners = this.dossier.owners!
  }

  cancel() {
    this.closeOwnersModalE.emit()
  }

  getStringSendEmail(email: string) {
    return "mailto:" + email + "?subject = Feedback&body = Message"
  }
}
