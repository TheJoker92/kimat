import { Component } from '@angular/core';
import { KimatLoginComponent } from './kimat-login/kimat-login.component';

@Component({
  selector: 'kimat-body',
  standalone: true,
  imports: [KimatLoginComponent],
  templateUrl: './kimat-body.component.html',
  styleUrl: './kimat-body.component.scss'
})
export class KimatBodyComponent {

}
