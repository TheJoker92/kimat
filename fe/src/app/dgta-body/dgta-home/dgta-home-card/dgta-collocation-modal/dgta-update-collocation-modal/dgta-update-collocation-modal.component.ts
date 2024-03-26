import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as rawData from '../../../../../../assets/enum.json';
import { faCheckSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from '../../../../../dgta-loading/loading.service';
import { HttpService } from '../../../../../http.service';
import { ActionLogEnum } from '../../../../../interfaces/ILog';
import { IPlace } from '../../../../../interfaces/IPlace';
import { IUser } from '../../../../../interfaces/IUser';
import { SessionService } from '../../../../../session.service';
import { ICatalogue } from '../../../../../interfaces/ICatalogue';

@Component({
  selector: 'dgta-update-collocation-modal',
  standalone: true,
  imports: [],
  templateUrl: './dgta-update-collocation-modal.component.html',
  styleUrl: './dgta-update-collocation-modal.component.scss'
})
export class DgtaUpdateCollocationModalComponent {
  @Input() catalogue: ICatalogue = {}
  @Output() closeUpdateCollocationModalE = new EventEmitter()
  

  place: IPlace | any = {}

  faCheckSquare = faCheckSquare
  faTrash = faTrash

  constructor(public sessionService: SessionService,
    private http: HttpService,
    private loadingService: LoadingService) {
    this.pullCatalogue()
  }

  

  updateCatalogue() {
    if (this.place.palace && this.place.floor && this.place.room && this.place.sector && this.place.rack && this.place.position) {

      this.place["date"] = new Date().toISOString()

      let placement = this.catalogue.placement!
      placement.push(this.place)
      placement = JSON.parse(JSON.stringify(placement))

      let history = this.catalogue.history!
      history.push({
        id: this.catalogue.history!.length.toString(),
        date: new Date().toISOString(),
        user: this.sessionService.user,
        resourceId: this.catalogue.id,
        actionLog: ActionLogEnum.UPDATE_CATALOGUE
      })

      history = JSON.parse(JSON.stringify(history))

      let payload: any = {
        id: this.catalogue.id,
        title: this.catalogue.title,
        topics: JSON.stringify(this.catalogue.topics),
        documents: JSON.stringify([]),
        owners: JSON.stringify(this.catalogue.owners),
        history: JSON.stringify(history),
        placement: JSON.stringify(placement),
      }

      this.loadingService.isLoading = true
      this.http.addCatalogue(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            alert("Hai aggiornato il catalogo")
            window.location.reload()
          } else {
            alert("Errore server. Contattare il supporto.")
          }
        },
        error: (error) => {
          this.loadingService.isLoading = false
          alert("L'operazione è fallita. Riprova.")
          console.error(error)
        }
      })
    } else if (!this.place.palace || !this.place.floor || !this.place.room || !this.place.sector || !this.place.rack || !this.place.position) {
      alert("Indicare il collocamento compilando tutti i campi associati.")
    } else {
      alert("Qualcosa è andato storto. Riprova.")
    }
  }

  cancel() {
    this.closeUpdateCollocationModalE.emit()
  }


  editLocation(label:string, e: any) {
    this.place[label] = e.target.value
    console.log(this.place)
  }

  pullCatalogue() {
    this.loadingService.isLoading = true

    this.http.getCatalogues(this.sessionService.terms).subscribe({
      next: (response: any) => {
        let catalogueArray = response.documents!.filter((catalogue: ICatalogue) => catalogue.id == this.catalogue.id)
        
        for (let document of catalogueArray) {
          let catalogue: any = {}
          for (let keyDocument of Object.keys(document)) {
            if (this.isParsable(document[keyDocument])) {
              catalogue[keyDocument] =  JSON.parse(document[keyDocument])
            } else {
              catalogue[keyDocument] = document[keyDocument]
            }
          }

          this.catalogue = catalogue

        }

        this.loadingService.isLoading = false
        
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
