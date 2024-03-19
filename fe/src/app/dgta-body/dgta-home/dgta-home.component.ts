import { Component } from '@angular/core';
import { DgtaHomeCardComponent } from './dgta-home-card/dgta-home-card.component';
import { SessionService } from '../../session.service';
import { HttpService } from '../../http.service';
import { ICatalogue } from '../../interfaces/ICatalogue';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dgta-home',
  standalone: true,
  imports: [DgtaHomeCardComponent, CommonModule],
  templateUrl: './dgta-home.component.html',
  styleUrl: './dgta-home.component.scss'
})
export class DgtaHomeComponent {

  catalogues: ICatalogue[] = []

  constructor(public sessionService: SessionService,
              private http: HttpService) {
    this.http.getCatalogues().subscribe({
      next: (response: any) => {
        this.catalogues = response.documents!

        console.log(this.catalogues)
      },
      error: (error) => {
        console.error(error)
      }
    })
  }


}
