import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dgta-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dgta-header.component.html',
  styleUrl: './dgta-header.component.scss'
})
export class DgtaHeaderComponent {
  faBook = faBook;

  dgta = "dgt@"
}
