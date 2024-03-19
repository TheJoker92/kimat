import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { SessionService } from '../session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dgta-header',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  providers: [SessionService],
  templateUrl: './dgta-header.component.html',
  styleUrl: './dgta-header.component.scss'
})
export class DgtaHeaderComponent {
  faBook = faBook;
  faSignOut = faSignOut

  dgta = "dgt@"

  constructor(public sessionService: SessionService) {

  }

  logout() {
    this.sessionService.deleteSession()
  }
}
