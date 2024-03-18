import { Component } from '@angular/core';
import { DgtaLoginComponent } from './dgta-login/dgta-login.component';
import { DgtaLoadingComponent } from '../dgta-loading/dgta-loading.component';
import { LoadingService } from '../dgta-loading/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dgta-body',
  standalone: true,
  imports: [CommonModule, DgtaLoginComponent, DgtaLoadingComponent],
  providers: [LoadingService],
  templateUrl: './dgta-body.component.html',
  styleUrl: './dgta-body.component.scss'
})
export class DgtaBodyComponent {
  constructor(public loadingService: LoadingService) {

  }

}
