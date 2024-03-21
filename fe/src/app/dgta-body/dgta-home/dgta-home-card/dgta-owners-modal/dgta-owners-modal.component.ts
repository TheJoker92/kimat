import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { IUser } from '../../../../interfaces/IUser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dgta-owners-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dgta-owners-modal.component.html',
  styleUrl: './dgta-owners-modal.component.scss'
})
export class DgtaOwnersModalComponent {
  @Input() catalogue: ICatalogue = {}
  @Output() closeOwnersModalE = new EventEmitter()

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
