import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICatalogue } from '../../../../../interfaces/ICatalogue';
import { IPlace } from '../../../../../interfaces/IPlace';
import { IUser } from '../../../../../interfaces/IUser';
import { HttpService } from '../../../../../http.service';
import { SessionService } from '../../../../../session.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

import * as data from '../../../../../../assets/enum.json'
import { ActionLogEnum, ILog } from '../../../../../interfaces/ILog';
import { IAttachment, IDocument, IDocumentState } from '../../../../../interfaces/IDocument';
import { LoadingService } from '../../../../../dgta-loading/loading.service';

@Component({
  selector: 'dgta-document-form-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-document-form-modal.component.html',
  styleUrl: './dgta-document-form-modal.component.scss'
})
export class DgtaDocumentFormModalComponent {
  @Input() catalogue: ICatalogue = {}
  @Output() closeDocumentFormModalE = new EventEmitter()
  @Output() emitterGetDocuments = new EventEmitter()

  topics: string[] = []

  allowedTopics: string[] = []
  rawData: any = data
  topic: string = ""

  faCheckSquare = faCheckSquare
  faTrash = faTrash

  name: string = ""
  place: any = {}

  users: IUser[] = []
  owners: IUser[] = []
  allowedOwners: IUser[] = []
  owner: IUser = {}

  dataUser: any = {}

  attachmentPdf: IAttachment = {}

  constructor(private http: HttpService,
    private sessionService: SessionService,
    private loadingService: LoadingService) {
    this.allowedTopics = this.rawData.topics
    this.topic = this.allowedTopics[0]
    this.getUsers()
  }

  onSelectTopic(e: any) {
    this.topic = e.target.value
  }


  addTopic() {
    if (this.topics.length < 4 && this.topic) {
      this.topics.push(this.topic)
      this.allowedTopics = this.allowedTopics.filter((topic: any) => topic != this.topic)
      this.topic = this.allowedTopics[0]
    } else if (this.topics.length >= 4) {
      alert("Puoi aggiungere fino a quattro argomenti")
    } else if (!this.topic) {
      alert("Selezionare un argomento")
    }
  }


  deleteTopic(value: string) {
    this.topics = this.topics.filter((topic: string) => topic != value)

    this.allowedTopics = this.topics

    for (let index = 0; index < this.topics.length; index++) {
      console.log(this.topics[index])
      this.allowedTopics = this.allowedTopics.filter((dataTopic: string) => dataTopic != this.topics[index] && this.topics[index] != value)
    }

    this.topic = this.allowedTopics[0]
  }

  editName(e: any) {
    this.name = e.target.value
  }

  cancel() {
    this.closeDocumentFormModalE.emit()
  }

  addDocument() {
    if (!this.name) {
      alert("Inserire il nome di un documento")
    } else if (this.topics.length == 0) {
      alert("Indicare un almeno un argomento")
    } else if (this.owners.length == 0) {
      alert("Indicare almeno un proprietario")
    } else if (!this.place.palace || !this.place.floor || !this.place.room || !this.place.sector || !this.place.rack || !this.place.position) {
      alert("Compilare tutti i campi del collocamento")
    } else {

      let parentId = this.catalogue.id

      let history: ILog = {
        id: "0",
        date: new Date().toISOString(),
        actionLog: ActionLogEnum.CREATION_DOCUMENT,
        user: this.sessionService.user
      }

      let state: IDocumentState = {
        id: "0",
        stateValue: this.rawData.documentState.acceptance,
        user: this.sessionService.user,
        date: new Date().toISOString()
      }

      let payload: any = {
        "parentId": parentId,
        "name": this.name,
        "history": JSON.stringify([history]),
        "attachments": JSON.stringify([this.attachmentPdf]),
        "deviceIds": JSON.stringify([]),
        "states": JSON.stringify([state]),
        "topics": JSON.stringify(this.topics),
        "placement": JSON.stringify([this.place]),
        "owners": JSON.stringify(this.owners)
      }

      console.log(payload)

      this.loadingService.isLoading = true
      this.http.addDocument(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            alert("Hai aggiornato il catalogo")

            this.emitterGetDocuments.emit()
            this.closeDocumentFormModalE.emit()
          } else {
            alert("Errore server. Contattare il supporto.")
          }
        },
        error: (error: any) => {
          this.loadingService.isLoading = false
          console.error(error)
        }
      })
    }
  }

  loadFile(ext: string) {
    document.getElementById("file-" + ext)?.click()
  }

  onUploadFile(e: any) {
    let file = e.target.files[0]
    if (file && file.type == "application/pdf") {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.attachmentPdf = {
          name: file.name,
          mimeType: file.type,
          base64: e.target.result.replace("data:application/pdf;base64,", "")
        }
      };

      reader.readAsDataURL(file);

    } else if (file.type != "application/pdf") {
      alert("Caricare soltanto file pdf")
    }
  }

  editLocation(label: string, e: any) {
    this.place[label] = e.target.value
    console.log(this.place)
  }


  addOwner() {
    if (this.owner && this.owners.filter((owner: IUser) => owner.id == this.owner.id).length) {
      this.owner = this.allowedOwners[0]
    }

    if (this.allowedOwners.length && this.owner.id) {
      this.owners.push(this.owner)

      this.allowedOwners = this.dataUser.owners
      for (let owner of this.owners) {

        this.allowedOwners = this.allowedOwners.filter((rawOwner: IUser) => rawOwner.id != owner.id)
      }

      console.log("ADD ALLOW", this.allowedOwners)
    } else if (!this.owner.id) {

    } else {
      alert("Non ci sono utenti da aggiungere")
    }

  }

  onSelectOwner(e: any) {
    this.owner = this.allowedOwners.find((owner: IUser) => owner.id == e.target.value)!
  }


  deleteOwner(owner: IUser) {
    this.owners = this.owners.filter((ownerRow: IUser) => ownerRow.id != owner.id)

    this.allowedOwners.push(owner)

    this.allowedOwners = JSON.parse(JSON.stringify(this.allowedOwners))

  }

  getUsers() {
    let payload: any = {
      "all": true
    }

    this.http.getUser(payload).subscribe({
      next: (response: any) => {
        this.allowedOwners = JSON.parse(JSON.stringify(response.users.filter((user: IUser) => user.id != this.sessionService.user!.id)))
        this.dataUser.owners = JSON.parse(JSON.stringify(response.users))
        this.owners = response.users.filter((user: IUser) => user.id == this.sessionService.user!.id)

        this.owner = this.dataUser.owners[0]
      }
    })
  }
}
