import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'dgta-login',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dgta-login.component.html',
  styleUrl: './dgta-login.component.scss'
})
export class DgtaLoginComponent {
  faSignIn = faSignIn

  dgta = "dgt@"
}
