import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'kimat-login',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './kimat-login.component.html',
  styleUrl: './kimat-login.component.scss'
})
export class KimatLoginComponent {
  faSignIn = faSignIn
}
