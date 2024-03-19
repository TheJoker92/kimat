import { Component, EventEmitter, Output } from '@angular/core';
import * as rawData from '../../../../../assets/enum.json';
import { CommonModule } from '@angular/common';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { HttpService } from '../../../../http.service';
import { LoadingService } from '../../../../dgta-loading/loading.service';

@Component({
  selector: 'dgta-home-card-catalogue-form-modal',
  standalone: true,
  imports: [CommonModule],
  providers: [HttpService],
  templateUrl: './dgta-home-card-catalogue-form-modal.component.html',
  styleUrl: './dgta-home-card-catalogue-form-modal.component.scss'
})

export class DgtaHomeCardCatalogueFormModalComponent {
  @Output() closeCatalogueFormModalE = new EventEmitter()
  title: string = ""
  data: any = rawData
  topic: string = this.data.topics[0]

  constructor(private http: HttpService,
              private loadingService: LoadingService) {}

  editTitle(e: any) {
    this.title = e.target.value
  }

  onSelectTopic(e: any) {
    this.topic = e.target.value
    console.log(this.topic)
  }

  addCatalogue() {
    if (this.title) {

      let payload: ICatalogue = {
        title: this.title,
        topic: this.topic
      }
  
      this.loadingService.isLoading = true
      this.http.addCatalogue(payload).subscribe({
        next: (response) => {
          this.loadingService.isLoading = false
          alert("Hai aggiunto un nuovo catalogo")
  
          window.location.reload()
        },
        error: (error) => {
          this.loadingService.isLoading = false
          alert("L'operazione è fallita. Riprova.")
          console.error(error)
        }
      })
    } else {
      alert("Aggiungi un titolo")
    }
  }

  cancel() {
    this.closeCatalogueFormModalE.emit()
  }
}
