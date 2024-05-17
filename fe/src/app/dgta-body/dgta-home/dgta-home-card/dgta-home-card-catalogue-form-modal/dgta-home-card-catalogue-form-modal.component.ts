import { Component, EventEmitter, Output } from '@angular/core';
import * as rawData from '../../../../../assets/enum.json';
import { CommonModule } from '@angular/common';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { HttpService } from '../../../../http.service';
import { LoadingService } from '../../../../dgta-loading/loading.service';
import { IUser } from '../../../../interfaces/IUser';
import { SessionService } from '../../../../session.service';
import { faCheckSquare, faTrash, faChevronLeft, faCircle } from '@fortawesome/free-solid-svg-icons';
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

  isValidTitle = true
  isValidTopic = true
  isValidOwner = true

  isValidPalace = true
  isValidFloor = true
  isValidSector = true
  isValidRoom = true
  isValidRack = true

  isValidPosition = true
  place: IPlace | any = {}

  faCheckSquare = faCheckSquare
  faTrash = faTrash
  faChevronLeft = faChevronLeft
  faCircle = faCircle

  step = 1

  showTopicSelection = false
  showOwnerSelection = false

  constructor(public sessionService: SessionService,
    private http: HttpService,
    private loadingService: LoadingService) {
    this.allowedTopics = this.data.topics
    // this.topic = this.allowedTopics[0]
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
  addTopic(topic: any) {
    if (this.topics.length < 4) {
      // this.topics.push(this.topic)
      // this.allowedTopics = this.allowedTopics.filter((topic: any) => topic != this.topic)
      // this.topic = this.allowedTopics[0]
      if(this.topics.includes(topic)) {
        this.topics = this.topics.filter((addedTopic: any) => addedTopic != topic)
      } else {
        this.topics.push(topic)
      }
    } else if (this.topics.length >= 4) {
      alert("Puoi aggiungere fino a quattro argomenti")
    } else if (!this.topic) {
      alert("Selezionare un argomento")
    }
  }

  addOwner(owner: any) {
    if (this.owners) {
      // this.topics.push(this.topic)
      // this.allowedTopics = this.allowedTopics.filter((topic: any) => topic != this.topic)
      // this.topic = this.allowedTopics[0]
      if(this.owners.includes(owner)) {
        this.owners = this.owners.filter((addedOwner: any) => addedOwner.id != owner.id)
      } else {
        this.owners.push(owner)
      }
    }
  }


  addCatalogue() {
    this.nextStep()

    if (this.isValidPalace && this.isValidFloor &&this.isValidSector && this.isValidRack && this.isValidRoom && this.isValidPosition) {

      let payload: any = {
        title: this.title,
        topics: JSON.stringify(this.topics),
        documents: JSON.stringify([]),
        owners: JSON.stringify(this.owners),
        history: JSON.stringify([
          {
            id: "0",
            actionLog: ActionLogEnum.CREATION_CATALOGUE,
            date: new Date().toISOString(),
            user: this.sessionService.user,
          }
        ]),
        placement: JSON.stringify([this.place])
      }

      console.log(payload)

      this.loadingService.isLoading = true
      this.http.addCatalogue(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            this.step = 3
            // alert("Hai aggiunto un nuovo catalogo")
            // window.location.reload()
          } else {
            this.step = 4
          }
        },
        error: (error) => {
          this.loadingService.isLoading = false
          this.step = 4
          console.error(error)
        }
      })
    }
    
    
  }

  getUsers() {
    let payload: any = {
      "all": true
    }

    this.http.getUser(payload).subscribe({
      next: (response: any) => {
        this.allowedOwners = JSON.parse(JSON.stringify(response.users))
        // this.allowedOwners = JSON.parse(JSON.stringify(response.users.filter((user: IUser) => user.id != this.sessionService.user!.id)))
        this.data.owners = JSON.parse(JSON.stringify(response.users))
        this.owners = response.users.filter((user: IUser) => user.id == this.sessionService.user!.id)

        this.owner = this.data.owners[0]
      }
    })
  }

  cancel() {
    this.closeCatalogueFormModalE.emit()
  }

  // addOwner() {
  //   if(this.owner && this.owners.filter((owner: IUser) => owner.id == this.owner.id).length) {
  //     this.owner = this.allowedOwners[0]
  //   }
    
  //   if (this.allowedOwners.length && this.owner.id) {
  //     this.owners.push(this.owner)

  //     this.allowedOwners = this.data.owners
  //     for (let owner of this.owners) {

  //       this.allowedOwners = this.allowedOwners.filter((rawOwner: IUser) => rawOwner.id != owner.id)
  //     }

  //     console.log("ADD ALLOW", this.allowedOwners)
  //   } else if(!this.owner.id) {
      
  //   } else {
  //     alert("Non ci sono utenti da aggiungere")
  //   }

  // }

  onSelectOwner(e: any) {
    this.owner = this.allowedOwners.find((owner: IUser) => owner.id == e.target.value)!
  }


  deleteOwner(owner: IUser) {
    this.owners = this.owners.filter((ownerRow: IUser) => ownerRow.id != owner.id)

    this.allowedOwners.push(owner)

    this.allowedOwners = JSON.parse(JSON.stringify(this.allowedOwners))

  }

  editLocation(label: string, e: any) {
    this.place[label] = e.target.value
    console.log(this.place)
  }


  previousStep() {
    if (this.step == 1) {
      this.cancel()
    } else {
      this.step -= 1
    }
  }

  nextStep() {
    if (this.step == 1) {
      if (this.title.length == 0) {
        this.isValidTitle = false
      } else {
        this.isValidTitle = true
      }
  
      if (this.owners.length == 0) {
        this.isValidOwner = false
      } else {
        this.isValidOwner = true
      }
  
      if (this.topics.length == 0) {
        this.isValidTopic = false
      } else {
        this.isValidTopic = true
      }
  
      if (this.isValidOwner && this.isValidTitle && this.isValidTopic) {
        this.step += 1
      } 
    } else if (this.step == 2) {
      if (this.place.palace) {
        this.isValidPalace = true
      } else {
        this.isValidPalace = false
      }
  
      if (this.place.floor) {
        this.isValidFloor = true
      } else {
        this.isValidFloor = false
      }
  
      if (this.place.room) {
        this.isValidRoom = true
      } else {
        this.isValidRoom = false
      }

      if (this.place.sector) {
        this.isValidSector = true
      } else {
        this.isValidSector = false
      }

      if (this.place.rack) {
        this.isValidRack = true
      } else {
        this.isValidRack = false
      }

      if (this.place.position) {
        this.isValidPosition = true
      } else {
        this.isValidPosition = false
      }
    }
  }

  toggleShowTopicSelection() {

    if (this.showTopicSelection) {
      this.showTopicSelection = false
    } else {
      this.showTopicSelection = true

    }
  }

  toggleShowOwnerSelection() {

    if (this.showOwnerSelection) {
      this.showOwnerSelection = false
    } else {
      this.showOwnerSelection = true

    }
  }

  getLabelTopic() {
    let label = ""
    if (this.topics.length == 0) {
      label = "Premere per selezionare gli argomenti"
    } else if(this.topic.length == 1) {
      label = "Hai selezionato " + this.topics.length + " argomento"
    } else {
      label = "Hai selezionato " + this.topics.length + " argomenti"
    }

    return label
  }

  getLabelOwner() {
    let label = ""
    if (this.owners.length == 0) {
      label = "Premere per selezionare i proprietari"
    } else if(this.owners.length == 1) {
      label = "Hai selezionato " + this.owners.length + " proprietario"
    } else {
      label = "Hai selezionato " + this.owners.length + " proprietari"
    }

    return label
  }

  isAddedTopic(topic: any) {
    let result

    if (this.topics.filter((addedTopic: any) => addedTopic == topic).length) {
      result = true
    }
    return result
  }

  isAddedOwner(owner: any) {
    let result

    if (this.owners.filter((addedOwner: any) => addedOwner.id == owner.id).length) {
      result = true
    }
    return result
  }
}
