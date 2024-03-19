import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DgtaHeaderComponent } from './dgta-header/dgta-header.component';
import { SessionService } from './session.service';
import { DgtaBodyComponent } from './dgta-body/dgta-body.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DgtaHeaderComponent, DgtaBodyComponent],
  providers: [SessionService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fe';

  constructor(public sessionService: SessionService) {}
}
