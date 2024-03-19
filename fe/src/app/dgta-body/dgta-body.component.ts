import { Component } from '@angular/core';
import { DgtaLoginComponent } from './dgta-login/dgta-login.component';
import { DgtaLoadingComponent } from '../dgta-loading/dgta-loading.component';
import { LoadingService } from '../dgta-loading/loading.service';
import { CommonModule } from '@angular/common';
import { SessionService } from '../session.service';
import { DgtaHomeComponent } from './dgta-home/dgta-home.component';

@Component({
  selector: 'dgta-body',
  standalone: true,
  imports: [CommonModule, DgtaLoginComponent, DgtaLoadingComponent, DgtaHomeComponent],
  providers: [LoadingService, SessionService],
  templateUrl: './dgta-body.component.html',
  styleUrl: './dgta-body.component.scss'
})
export class DgtaBodyComponent {
  constructor(public loadingService: LoadingService,
              public sessionService: SessionService) {

  }

}
