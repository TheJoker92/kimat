import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kimat-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './kimat-header.component.html',
  styleUrl: './kimat-header.component.scss'
})
export class KimatHeaderComponent {
  faBook = faBook;
}
