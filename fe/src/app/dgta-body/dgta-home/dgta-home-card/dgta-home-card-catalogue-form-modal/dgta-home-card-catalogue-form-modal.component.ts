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
import { ActionEnum } from '../../../../interfaces/ILog';
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

  place: IPlace = {}

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

    for (let index=0; index < this.topics.length; index++) {
      console.log(this.topics[index])
      this.allowedTopics = this.allowedTopics.filter((dataTopic: string) => dataTopic != this.topics[index] || this.topics[index] != value)
    }
    
    this.topic = this.allowedTopics[0]
  }
  addTopic() {
    if (this.topics.length < 4 && this.topic) {
      this.topics.push(this.topic)
      this.allowedTopics = this.allowedTopics.filter((topic: any) => topic != this.topic)
      this.topic = ""
    } else if (this.topics.length >= 4) {
      alert("Puoi aggiungere fino a tre argomenti")
    } else if (!this.topic) {
      alert("Selezionare un argomento")
    }
  }

  addCatalogue() {
    if (this.title) {

      let payload: ICatalogue = {
        title: this.title,
        topics: this.topics,
        documents: [],
        owners: this.owners,
        history: [
          {
            id: "0",
            action: ActionEnum.CREATION_CATALOGUE,
            date: new Date().toISOString(),
            user: this.sessionService.user,
          }
        ],
        placement: [this.place]
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

  getUsers() {
    let payload: any = {
      "all": true
    }

    this.http.getUser(payload).subscribe({
      next: (response: any) => {
        this.users = response.users.filter((user: IUser) => user.id != this.sessionService.user!.id)
        this.owners = [this.sessionService.user!]
      }
    })
  }

  cancel() {
    this.closeCatalogueFormModalE.emit()
  }

  onSelectOwner(e: any) {

  }
}
