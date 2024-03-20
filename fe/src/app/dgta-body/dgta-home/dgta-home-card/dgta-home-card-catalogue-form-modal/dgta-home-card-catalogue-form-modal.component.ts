import { Component, EventEmitter, Output } from '@angular/core';
import * as rawData from '../../../../../assets/enum.json';
import { CommonModule } from '@angular/common';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { HttpService } from '../../../../http.service';
import { LoadingService } from '../../../../dgta-loading/loading.service';
import { IUser } from '../../../../interfaces/IUser';
import { SessionService } from '../../../../session.service';
import { faCheckSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActionLogEnum } from '../../../../interfaces/ILog';
import { IPlace } from '../../../../interfaces/IPlace';

@Component({
  selector: 'dgta-home-card-catalogue-form-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  providers: [HttpService],
  templateUrl: './dgta-home-card-catalogue-form-modal.component.html',
  styleUrl: './dgta-home-card-catalogue-form-modal.component.scss'
})

export class DgtaHomeCardCatalogueFormModalComponent {
  @Output() closeCatalogueFormModalE = new EventEmitter()
  title: string = ""
  data: any = rawData
  allowedTopics: string[] = []
  topics: string[] = []
  topic: string = ""
  users: IUser[] = []
  owners: IUser[] = []
  allowedOwners: IUser[] = []
  owner: IUser = {}

  place: IPlace | any = {}

  faCheckSquare = faCheckSquare
  faTrash = faTrash

  constructor(public sessionService: SessionService,
    private http: HttpService,
    private loadingService: LoadingService) {
    this.allowedTopics = this.data.topics
    this.topic = this.allowedTopics[0]
    this.getUsers()
  }

  editTitle(e: any) {
    this.title = e.target.value
  }

  onSelectTopic(e: any) {
    this.topic = e.target.value
  }

  deleteTopic(value: string) {
    this.topics = this.topics.filter((topic: string) => topic != value)

    this.allowedTopics = this.data.topics

    for (let index = 0; index < this.topics.length; index++) {
      console.log(this.topics[index])
      this.allowedTopics = this.allowedTopics.filter((dataTopic: string) => dataTopic != this.topics[index] && this.topics[index] != value)
    }

    this.topic = this.allowedTopics[0]
  }
  addTopic() {
    if (this.topics.length < 4 && this.topic) {
      this.topics.push(this.topic)
      this.allowedTopics = this.allowedTopics.filter((topic: any) => topic != this.topic)
      this.topic = this.allowedTopics[0]
    } else if (this.topics.length >= 4) {
      alert("Puoi aggiungere fino a tre argomenti")
    } else if (!this.topic) {
      alert("Selezionare un argomento")
    }
  }

  addCatalogue() {
    if (this.title && (this.owners && this.owners.length > 0) && (this.topics && this.topics.length > 0) && 
        this.place.palace && this.place.floor && this.place.room && this.place.sector && this.place.rack && this.place.position) {

      let payload: ICatalogue = {
        title: this.title,
        topics: this.topics,
        documents: [],
        owners: this.owners,
        history: [
          {
            id: "0",
            actionLog: ActionLogEnum.CREATION_CATALOGUE,
            date: new Date().toISOString(),
            user: this.sessionService.user,
          }
        ],
        placement: [this.place]
      }

      console.log(payload)

      this.loadingService.isLoading = true
      this.http.addCatalogue(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            alert("Hai aggiunto un nuovo catalogo")
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
    } else if (!this.title) {
      alert("Aggiungi un titolo")
    } else if (!this.owners || this.owners.length == 0) {
      alert("Indicare almeno un proprietario.")
    } else if (!this.topics || this.topics.length == 0) {
      alert("Indicare almeno un aromento.")
    } else if (!this.place.palace || !this.place.floor || !this.place.room || !this.place.sector || !this.place.rack || !this.place.position) {
      alert("Indicare il collocamento compilando tutti i campi associati.")
    } else {
      alert("Qualcosa è andato storto. Riprova.")
    }
  }

  getUsers() {
    let payload: any = {
      "all": true
    }

    this.http.getUser(payload).subscribe({
      next: (response: any) => {
        this.allowedOwners = response.users.filter((user: IUser) => user.id != this.sessionService.user!.id)
        this.data.owners = response.users
        this.owners = response.users.filter((user: IUser) => user.id == this.sessionService.user!.id)
        this.owner = this.data.owners[0]
      }
    })
  }

  cancel() {
    this.closeCatalogueFormModalE.emit()
  }

  addOwner() {
    console.log(this.owner)
    this.owners.push(this.owner)
    this.allowedOwners = this.allowedOwners.filter((owner: IUser) => owner != this.owner)
    if(this.allowedOwners.length) this.owner = this.allowedOwners[0]
  }

  onSelectOwner(e: any) {
    this.owner = this.allowedOwners.find((owner: IUser) => owner.id == e.target.value)!
    console.log(this.owner)
  }


  deleteOwner(owner: IUser) {
    this.owners = this.owners.filter((ownerRow: IUser) => ownerRow.id != owner.id)

    this.allowedOwners = this.data.owners

    for (let index = 0; index < this.owners.length; index++) {
      this.allowedOwners = this.allowedOwners.filter((dataOwner: IUser) => dataOwner.id != this.owners[index].id || this.owners[index].id != owner.id)
    }

    this.owner = this.allowedOwners[0]
  }

  editLocation(label:string, e: any) {
    this.place[label] = e.target.value
    console.log(this.place)
  }
}
