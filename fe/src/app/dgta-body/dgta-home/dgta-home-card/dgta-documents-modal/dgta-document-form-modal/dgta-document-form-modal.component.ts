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
  @Input() documents: IDocument[] = []

  @Output() closeDocumentFormModalE = new EventEmitter()
  @Output() emitterGetDocumentsE = new EventEmitter()

  failedUploading: string[] = []

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
  attachmentsPdf: IAttachment[] = []
  isSingle = false
  isMultiple = true

  multipleFiles: any[] = []

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

            this.emitterGetDocumentsE.emit()
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
          ext: "pdf",
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

  toggleIsSingle() {
    this.isSingle = true
    this.isMultiple = false
  }

  toggleIsMultiple() {
    this.isSingle = false
    this.isMultiple = true
  }

  onUploadFiles(e: any) {
    for (let file of e.target.files) {
      if (file && file.type == "application/pdf") {

        this.multipleFiles.push(file)

      } else if (file.type != "application/pdf") {
        alert("Caricare soltanto file pdf")
      }
    }
  }

  addDocumentMultiple() {
    this.addDocumentMultipleFirstStep(0)

  }

  addDocumentMultipleFirstStep(index: number) {
    let file = this.multipleFiles[index]
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

    // let attachments: IAttachment[] = []
    // if(attachmentPdf) {
    //   attachments = [attachmentPdf]
    // }

    let payload: any = {
      "parentId": parentId,
      "name": file.name.replace(".pdf", ""),
      "history": JSON.stringify([history]),
      "attachments": JSON.stringify([]),
      "deviceIds": JSON.stringify([]),
      "states": JSON.stringify([state]),
      "topics": JSON.stringify([]),
      "placement": JSON.stringify([]),
      "owners": JSON.stringify([this.sessionService.user])
    }

    console.log(payload)

    this.loadingService.isLoading = true
    this.http.addDocument(payload).subscribe({
      next: (response: any) => {
        this.loadingService.isLoading = false

        if (response.code == 200) {
          // alert("Hai aggiornato il catalogo")

          // this.emitterGetDocuments.emit()

          let payload = {
            parentId: this.catalogue.id,
            name: file.name.replace(".pdf", "")
          }

          this.loadingService.isLoading = true
          setTimeout(() => {
            this.http.getDocuments(payload).subscribe({
              next: (response: any) => {
                this.loadingService.isLoading = false

                let documents = []
                for (let documentRaw of response.documents!) {
                  let document: any = {}
                  for (let keyDocument of Object.keys(documentRaw)) {
                    if (this.isParsable(documentRaw[keyDocument])) {
                      document[keyDocument] = JSON.parse(documentRaw[keyDocument])
                    } else {
                      document[keyDocument] = documentRaw[keyDocument]
                    }
                  }

                  documents.push(document)
                }

                documents = JSON.parse(JSON.stringify(documents))

                let documentF: IDocument = documents.find((documentFromList: IDocument) => documentFromList.name == file.name.replace(".pdf", ""))!
                console.log("AAA", documentF, documents, file.name.replace(".pdf", ""))
                if (documentF) {
                  this.addDocumentMultipleSecondStep(documentF, index)
                } else {
                  this.failedUploading.push(file.name)
                  this.addDocumentMultipleFirstStep(index + 1)
                }
              }
            })
          }, 5000)
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

  isParsable(inputString: string): boolean {
    try {
      // Try to parse the string into an object
      JSON.parse(inputString);
      return true; // If successful, return true
    } catch (error) {
      return false; // If parsing fails, return false
    }

  }


  addDocumentMultipleSecondStep(document: IDocument, index: number) {
    let file = this.multipleFiles[index]

    const reader = new FileReader();

    reader.onload = (e: any) => {

      let attachmentPdf = {
        name: file.name,
        ext: "pdf",
      }

      let parentId = this.catalogue.id

      let history: ILog = {
        id: document.history!.length.toString(),
        date: new Date().toISOString(),
        actionLog: ActionLogEnum.UPDATE_DOCUMENT_ATTACHMENT,
        user: this.sessionService.user
      }


      let payload: any = {
        "parentId": parentId,
        "id": document.id,
        "name": document.name,
        "history": JSON.stringify([history]),
        "attachments": JSON.stringify([attachmentPdf]),
        "deviceIds": JSON.stringify([]),
        "states": JSON.stringify(document.states),
        "topics": JSON.stringify(document.topics),
        "placement": JSON.stringify(document.placement),
        "owners": JSON.stringify(document.owners)
      }

      this.http.addDocument(payload).subscribe({
        next: (response: any) => {

          if (response.code == 200) {
            let attachmentPdf = {
              name: file.name,
              ext: "pdf",
              base64: e.target.result.replace("data:application/pdf;base64,", "")
            }

            let parentId = this.catalogue.id

            let payload: any = {
              "parentId": parentId,
              "id": document.id,
              "name": document.name,
              "history": JSON.stringify(document.history),
              "attachments": JSON.stringify([attachmentPdf]),
              "deviceIds": JSON.stringify([]),
              "states": JSON.stringify(document.states),
              "topics": JSON.stringify(document.topics),
              "placement": JSON.stringify(document.placement),
              "owners": JSON.stringify(document.owners)
            }

            console.log(payload)

            this.loadingService.isLoading = true

            setTimeout(() => {
              this.http.uploadFile(payload).subscribe({
                next: (response: any) => {
                  if (response.code == 200) {
                    this.getOcr(document, index)

                  }
                }
              })
            }, 5000)


          } else {
            alert("Errore server. Contattare il supporto.")
          }


        },
        error: (error: any) => {
          this.loadingService.isLoading = false
          console.error(error)
        }
      })


    };

    reader.readAsDataURL(file);

  }

  getOcr(document: IDocument, index: number) {
    let payload = {
      id: document.id
    }

    this.loadingService.isLoading = true
    this.http.getOcr(payload).subscribe({
      next: (response: any) => {
        this.loadingService.isLoading = false
        let ocrText = response.text

        let deliberazioneTemaplateJSON: any = {}


        deliberazioneTemaplateJSON.oggetto = ocrText.split("OGGETTO")[1].split("L\u2019")[0]

        let ocrTextNormalized = ocrText.toUpperCase().replace(/\s/g, "").trim()

        let rawDate = ocrTextNormalized.split("L\u2019")[1].split("NELLA")[0]

        deliberazioneTemaplateJSON.annoStr = rawDate.split("ANNO")[1].split(",")[0]
        deliberazioneTemaplateJSON.giornoStr = rawDate.split("ADDI")[1].split("DEL")[0]
        deliberazioneTemaplateJSON.meseStr = rawDate.split("DELMESEDI")[1].split("ALLEORE")[0]
        deliberazioneTemaplateJSON.oreStr = rawDate.split("ALLEORE")[1].split("NELLA")[0]


        deliberazioneTemaplateJSON.data = this.getDayNumber(deliberazioneTemaplateJSON.giornoStr) + "-" + this.getMonthNumber(deliberazioneTemaplateJSON.meseStr) + "-" + this.getYearNumber(deliberazioneTemaplateJSON.annoStr)

        this.http.addDocument(payload).subscribe({
          next: (response: any) => {

            if (response.code == 200) {
              
              let payload: any = {
                "parentId": document.parentId,
                "id": document.id,
                "name": document.name,
                "history": JSON.stringify(document.history),
                "attachments": JSON.stringify(document.attachments),
                "deviceIds": JSON.stringify([]),
                "states": JSON.stringify(document.states),
                "topics": JSON.stringify([deliberazioneTemaplateJSON]),
                "placement": JSON.stringify(document.placement),
                "owners": JSON.stringify(document.owners)
              }

              console.log(payload)

              this.loadingService.isLoading = true

              setTimeout(() => {
                index += 1
                this.loadingService.isLoading = false
                if (index < this.multipleFiles.length) {
                  this.addDocumentMultipleFirstStep(index)
                } else {
                  alert("Hai aggiornato il catalogo")

                  if (this.failedUploading.length) {
                    let msg = "Errore per caricare i seguenti file:\n"

                    for (let notUploadedFile of this.failedUploading) {
                      msg += notUploadedFile + "\n"
                    }
                    alert(msg)
                  }
                  this.emitterGetDocumentsE.emit()
                  this.closeDocumentFormModalE.emit()

                }
              }, 200)


            } else {
              alert("Errore server. Contattare il supporto.")
            }


          },
          error: (error: any) => {
            this.loadingService.isLoading = false
            console.error(error)
          }
        })

      },
      error: (error) => {
        this.loadingService.isLoading = false
        console.error(error)
      }
    })
  }



  getYearNumber(numberStr: string) {
    let numberArray = numberStr.toLowerCase().split("mila")

    return this.numberJson[numberArray[0]] * 1000 + this.numberJson[numberArray[1]]
  }

  getDayNumber(dayStr: string) {
    return this.padWithZero(this.numberJson[dayStr.toLowerCase()])
  }

  numberJson: any = {
    uno: 1,
    due: 2,
    tre: 3,
    quattro: 4,
    cinque: 5,
    sei: 6,
    sette: 7,
    otto: 8,
    nove: 9,
    dieci: 10,
    undici: 11,
    dodici: 12,
    tredici: 13,
    quattordici: 14,
    quindici: 15,
    sedici: 16,
    diciassette: 17,
    diciotto: 18,
    diciannove: 19,
    venti: 20,
    ventuno: 21,
    ventidue: 22,
    ventitre: 23,
    ventiquattro: 24,
    venticinque: 25,
    ventisei: 26,
    ventisette: 27,
    ventotto: 28,
    ventinove: 29,
    trenta: 30
  };

  getMonthNumber(monthStr: string) {
    return this.padWithZero(this.monthJson[monthStr.toLowerCase()])
  }

  monthJson: any = {
    gennaio: 1,
    febbraio: 2,
    marzo: 3,
    aprile: 4,
    maggio: 5,
    giugno: 6,
    luglio: 7,
    agosto: 8,
    settembre: 9,
    ottobre: 10,
    novembre: 11,
    dicembre: 12,
  }

  padWithZero(num: number): string {
    // Using string interpolation and padStart to pad with zero
    const paddedNum: string = num.toString().padStart(2, '0');
    return paddedNum;
  }

}
