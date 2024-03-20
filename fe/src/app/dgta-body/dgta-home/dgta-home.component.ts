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
        
        for (let document of response.documents!) {
          let catalogue: any = {}
          for (let keyDocument of Object.keys(document)) {
            if (this.isParsable(document[keyDocument])) {
              catalogue[keyDocument] =  JSON.parse(document[keyDocument])
            } else {
              catalogue[keyDocument] = document[keyDocument]
            }
          }

          this.catalogues.push(catalogue)
        }
        

        console.log(this.catalogues)
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  isParsable(inputString: string): boolean {
    try {
        // Try to parse the string into an object
        JSON.parse(inputString);
        return true; // If successful, return true
    } catch (error) {
        return false; // If parsing fails, return false
    }
  
  }

}


