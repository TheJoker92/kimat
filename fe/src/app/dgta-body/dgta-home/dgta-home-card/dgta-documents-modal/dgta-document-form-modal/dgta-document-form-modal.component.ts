import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDossier } from '../../../../../interfaces/IDossier';
import { IPlace } from '../../../../../interfaces/IPlace';
import { IUser } from '../../../../../interfaces/IUser';
import { HttpService } from '../../../../../http.service';
import { SessionService } from '../../../../../session.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckSquare, faTrash, faChevronLeft, faCircle } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

import * as data from '../../../../../../assets/enum.json'
import { ActionLogEnum, ILog } from '../../../../../interfaces/ILog';
import { IAttachment, IDocument, IDocumentState } from '../../../../../interfaces/IDocument';
import { LoadingService } from '../../../../../dgta-loading/loading.service';
import { map } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'dgta-document-form-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-document-form-modal.component.html',
  styleUrl: './dgta-document-form-modal.component.scss'
})
export class DgtaDocumentFormModalComponent {
  @Input() dossier: IDossier = {}
  @Input() documents: IDocument[] = []

  @Output() closeDocumentFormModalE = new EventEmitter()
  @Output() emitterGetDocumentsE = new EventEmitter()

  faCircle = faCircle

  mode = ""

  stepSingleAdd = 1
  stepMultipleAdd = 1

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

  startUpload = false

  dataUser: any = {}

  attachmentPdf: IAttachment = {}
  attachmentsPdf: IAttachment[] = []
  isSingle = false
  isMultiple = false
  isManual = false

  isValidName = true
  isValidTopic = true
  isValidOwner = true

  isValidPalace = true
  isValidFloor = true
  isValidSector = true
  isValidRoom = true
  isValidRack = true

  isValidPosition = true

  multipleFiles: any[] = []

  showTopicSelection = false
  showOwnerSelection = false

  constructor(private http: HttpService,
    private sessionService: SessionService,
    private loadingService: LoadingService) {
    this.allowedTopics = this.rawData.topics
    this.topic = this.allowedTopics[0]
    this.getUsers()
  }

  faChevronLeft = faChevronLeft

  onSelectTopic(e: any) {
    this.topic = e.target.value
  }


  addTopic(topic: any) {
    if (this.topics.length < 4) {
      // this.topics.push(this.topic)
      // this.allowedTopics = this.allowedTopics.filter((topic: any) => topic != this.topic)
      // this.topic = this.allowedTopics[0]
      if (this.topics.includes(topic)) {
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
    this.emitterGetDocumentsE.emit()
    this.closeDocumentFormModalE.emit()
  }

  addDocument() {
    if (!this.name) {
      alert("Inserire il nome di un documento")
    }
    // else if (this.topics.length == 0) {
    //   alert("Indicare almeno un argomento")
    // } 
    else if (this.owners.length == 0) {
      alert("Indicare almeno un proprietario")
    } else if (!this.place.palace || !this.place.floor || !this.place.room || !this.place.sector || !this.place.rack || !this.place.position) {
      alert("Compilare tutti i campi del collocamento")
    } else {

      let parentId = this.dossier._id

      let history: ILog = {
        _id: "0",
        date: new Date().toISOString(),
        actionLog: ActionLogEnum.CREATION_DOCUMENT,
        user: this.sessionService.user
      }

      let state: IDocumentState = {
        _id: "0",
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
        "owners": JSON.stringify(this.owners),
        "deliberationDate": ""
      }

      console.log(payload)

      this.loadingService.isLoading = true
      this.http.addDocument(payload).subscribe({
        next: (response: any) => {
          this.loadingService.isLoading = false

          if (response.code == 200) {
            this.stepSingleAdd = 3

            this.emitterGetDocumentsE.emit()
            // this.closeDocumentFormModalE.emit()
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


  addOwner(owner: any) {
    if (this.owners) {
      // this.topics.push(this.topic)
      // this.allowedTopics = this.allowedTopics.filter((topic: any) => topic != this.topic)
      // this.topic = this.allowedTopics[0]
      if (this.owners.includes(owner)) {
        this.owners = this.owners.filter((addedOwner: any) => addedOwner._id != owner._id)
      } else {
        this.owners.push(owner)
      }
    }
  }

  onSelectOwner(e: any) {
    this.owner = this.allowedOwners.find((owner: IUser) => owner._id == e.target.value)!
  }


  deleteOwner(owner: IUser) {
    this.owners = this.owners.filter((ownerRow: IUser) => ownerRow._id != owner._id)

    this.allowedOwners.push(owner)

    this.allowedOwners = JSON.parse(JSON.stringify(this.allowedOwners))

  }

  getUsers() {
    let payload: any = {
      "all": true
    }

    this.http.getUser(payload).subscribe({
      next: (response: any) => {
        this.allowedOwners = JSON.parse(JSON.stringify(response.users.filter((user: IUser) => user._id != this.sessionService.user!._id)))
        this.dataUser.owners = JSON.parse(JSON.stringify(response.users))
        this.owners = response.users.filter((user: IUser) => user._id == this.sessionService.user!._id)

        this.owner = this.dataUser.owners[0]
      }
    })
  }

  toggleIsSingle() {
    this.isSingle = true
    this.isMultiple = false
    this.isManual = false

    this.mode = "singolo"
  }

  toggleIsMultiple() {
    this.isSingle = false
    this.isMultiple = true
    this.isManual = false

    this.mode = "multiplo"
  }

  toggleIsManual() {
    this.isSingle = false
    this.isMultiple = false
    this.isManual = true

    this.mode = "manuale"
  }

  onUploadFiles(e: any) {
    for (let file of e.target.files) {
      if (file && file.type == "application/pdf") {

        file.progressUpload = 0

        this.multipleFiles.push(file)

      } else if (file.type != "application/pdf") {
        alert("Caricare soltanto file pdf")
      }
    }
  }

  addDocumentMultiple() {
    this.startUpload = true
    this.addDocumentMultipleFirststepSingleAdd(0)

  }

  addDocumentMultipleFirststepSingleAdd(index: number) {
    let file = this.multipleFiles[index]
    let parentId = this.dossier._id

    let history: ILog = {
      _id: "0",
      date: new Date().toISOString(),
      actionLog: ActionLogEnum.CREATION_DOCUMENT,
      user: this.sessionService.user
    }

    let state: IDocumentState = {
      _id: "0",
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
      "owners": JSON.stringify([this.sessionService.user]),
      "deliberationDate": ""
    }

    console.log("FIRST stepSingleAdd", index, payload)

    this.loadingService.isLoading = true
    this.http.addDocument(payload).subscribe({
      next: (response: any) => {
        this.loadingService.isLoading = false

        if (response.code == 200) {
          // alert("Hai aggiornato il catalogo")

          // this.emitterGetDocuments.emit()

          let payload = {
            parentId: this.dossier._id,
            name: file.name.replace(".pdf", "")
          }

          console.log("UPLOAD PDF", index, payload)

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
                // console.log("AAA", documentF, documents, file.name.replace(".pdf", ""))
                if (documentF) {
                  this.addDocumentMultipleSecondstepSingleAdd(documentF, index)
                } else {
                  this.failedUploading.push(file.name)
                  this.addDocumentMultipleFirststepSingleAdd(index + 1)
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


  addDocumentMultipleSecondstepSingleAdd(document: IDocument, index: number) {
    let file = this.multipleFiles[index]

    const reader = new FileReader();

    reader.onload = (e: any) => {

      let attachmentPdf = {
        name: file.name,
        ext: "pdf",
      }

      let parentId = this.dossier._id

      let history: ILog = {
        _id: document.history!.length.toString(),
        date: new Date().toISOString(),
        actionLog: ActionLogEnum.UPDATE_DOCUMENT_ATTACHMENT,
        user: this.sessionService.user
      }


      let payload: any = {
        "parentId": parentId,
        "_id": document._id,
        "name": document.name,
        "history": JSON.stringify([history]),
        "attachments": JSON.stringify([attachmentPdf]),
        "deviceIds": JSON.stringify([]),
        "states": JSON.stringify(document.states),
        "topics": JSON.stringify(document.topics),
        "placement": JSON.stringify(document.placement),
        "owners": JSON.stringify(document.owners),
        "deliberationDate": document.deliberationDate
      }

      console.log("SECOND stepSingleAdd", index, payload)

      this.http.addDocument(payload).subscribe({
        next: (response: any) => {

          if (response.code == 200) {
            let attachmentPdf = {
              name: file.name,
              ext: "pdf",
              base64: e.target.result.replace("data:application/pdf;base64,", "")
            }

            let parentId = this.dossier._id

            let payload: any = {
              "parentId": parentId,
              "_id": document._id,
              "name": document.name,
              "history": JSON.stringify(document.history),
              "attachments": JSON.stringify([attachmentPdf]),
              "deviceIds": JSON.stringify([]),
              "states": JSON.stringify(document.states),
              "topics": JSON.stringify(document.topics),
              "placement": JSON.stringify(document.placement),
              "owners": JSON.stringify(document.owners),
              "deliberationDate": document.deliberationDate
            }

            console.log("UPLOAD PDF SECOND stepSingleAdd", index, payload)

            this.loadingService.isLoading = true

            setTimeout(() => {
              this.http.uploadFileWithPercent(payload).subscribe((event: any) => {
                switch (event.type) {
                  case HttpEventType.UploadProgress:
                    let file = this.multipleFiles[index]
                    file.progressUpload = Math.round(100 * (event.loaded / (event.total ?? 1)));

                    console.log(this.multipleFiles)
                    
                    this.loadingService.isLoading = false
                    if (index < this.multipleFiles.length) {
                      this.addDocumentMultipleFirststepSingleAdd(index + 1)
                    } 

                    return 101
                  case HttpEventType.Response: {

                    if (this.multipleFiles.length == index + 1) {
                      this.stepMultipleAdd = 2
                      this.startUpload = false
                      this.multipleFiles = []
                    }
                    return 100;
                  }
                  default:
                    return 0;
                }
              })


              //   .subscribe({
              //     next: (response: any) => {
              //       if (response.code == 200) {
              //         this.getOcr(document, index)

              //       }

              //       this.multipleFiles[index].progress
              //       this.multipleFiles = JSON.parse(JSON.stringify(this.multipleFiles))
              //     }
              //   })
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
      id: document._id
    }

    console.log("GET OCR", index, payload)

    this.loadingService.isLoading = true
    this.http.getOcr(payload).subscribe({
      next: (response: any) => {
        this.loadingService.isLoading = false
        let ocrText = response.text

        let deliberazioneTemaplateJSON: any = {}


        deliberazioneTemaplateJSON.oggetto = ocrText.split("OGGETTO")[1].split("L\u2019")[0]

        let ocrTextNormalized = ocrText.toUpperCase().replace(/\s/g, "").trim()

        let rawDate = ocrTextNormalized.split("L\u2019")[1].split("NELLA")[0]


        if (!rawDate || !rawDate.includes("ANNO")) {
          rawDate = ocrTextNormalized.split("LANNO")[1]
        }

        if (!rawDate || !rawDate.includes("ANNO")) {
          rawDate = ocrTextNormalized.split("L’")[1]
        }

        if (!rawDate || !rawDate.includes("ANNO")) {
          rawDate = ocrText.split("L\u2019")[1].toUpperCase().replace(/\s/g, "").trim()
        }

        rawDate = rawDate.split("NELLA")[0]

        if (!rawDate.includes("ANNO")) {
          rawDate = ocrTextNormalized.split("L'")[1].split("NELLA")[0]
        }

        if (!rawDate.includes("ANNO")) {
          rawDate = ocrTextNormalized.split("L'")[1].split("NELLA")[0]
        }
        deliberazioneTemaplateJSON.annoStr = rawDate.split("ANNO")[1].split(",")[0]
        deliberazioneTemaplateJSON.giornoStr = rawDate.split("ADDI")[1].split("DEL")[0]
        deliberazioneTemaplateJSON.meseStr = rawDate.split("DELMESEDI")[1].split("ALLEORE")[0].replace(".", ":").replace(",", ":")

        if (!deliberazioneTemaplateJSON.meseStr) {
          deliberazioneTemaplateJSON.meseStr = rawDate.split("MESEDI")[1]
        }

        deliberazioneTemaplateJSON.meseStr = deliberazioneTemaplateJSON.meseStr.split("ALLEORE")[0].replace(".", ":").replace(",", ":")


        deliberazioneTemaplateJSON.oreStr = rawDate.split("ALLEORE")[1].split("NELLA")[0].replace(".", ":").replace(",", ":")



        deliberazioneTemaplateJSON.data = this.getDayNumber(deliberazioneTemaplateJSON.giornoStr) + "-" + this.getMonthNumber(deliberazioneTemaplateJSON.meseStr) + "-" + this.getYearNumber(deliberazioneTemaplateJSON.annoStr)
        deliberazioneTemaplateJSON.dataNoDash = "a" + deliberazioneTemaplateJSON.data.replaceAll("-", "")
        let payload: any = {
          "parentId": document.parentId,
          "_id": document._id,
          "name": document.name,
          "history": JSON.stringify(document.history),
          "attachments": JSON.stringify({
            name: document.name,
            ext: "pdf"
          }),
          "deviceIds": JSON.stringify([]),
          "states": JSON.stringify(document.states),
          "topics": JSON.stringify([deliberazioneTemaplateJSON]),
          "placement": JSON.stringify(document.placement),
          "owners": JSON.stringify(document.owners),
          "deliberationDate": deliberazioneTemaplateJSON.dataNoDash
        }

        console.log(payload)
        this.http.addDocument(payload).subscribe({
          next: (response: any) => {

            if (response.code == 200) {



              this.loadingService.isLoading = true

              setTimeout(() => {
                index += 1
                this.loadingService.isLoading = false
                if (index < this.multipleFiles.length) {
                  this.addDocumentMultipleFirststepSingleAdd(index)
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
    trenta: 30,
    trentuno: 31
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

  openScanApp() {
    this.http.openApp().subscribe({
      next: (response) => {

      }
    })
  }


  previousstepSingleAdd() {
    if (this.stepSingleAdd == 1) {
      this.cancel()
    } else {
      this.stepSingleAdd -= 1
    }
  }

  nextstepSingleAdd() {
    if (this.stepSingleAdd == 1) {
      if (this.name.length == 0) {
        this.isValidName = false
      } else {
        this.isValidName = true
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

      if (this.isValidOwner && this.isValidName && this.isValidTopic) {
        this.stepSingleAdd += 1
      }
    } else if (this.stepSingleAdd == 2) {
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

  getLabelTopic() {
    let label = ""
    if (this.topics.length == 0) {
      label = "Premere per selezionare gli argomenti"
    } else if (this.topic.length == 1) {
      label = "Hai selezionato " + this.topics.length + " argomento"
    } else {
      label = "Hai selezionato " + this.topics.length + " argomenti"
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

    if (this.owners.filter((addedOwner: any) => addedOwner._id == owner._id).length) {
      result = true
    }
    return result
  }

  toggleShowOwnerSelection() {

    if (this.showOwnerSelection) {
      this.showOwnerSelection = false
    } else {
      this.showOwnerSelection = true

    }
  }

  getLabelOwner() {
    let label = ""
    if (this.owners.length == 0) {
      label = "Premere per selezionare i proprietari"
    } else if (this.owners.length == 1) {
      label = "Hai selezionato " + this.owners.length + " proprietario"
    } else {
      label = "Hai selezionato " + this.owners.length + " proprietari"
    }

    return label
  }

  getReducedLabelName(label: string) {
    let result = label

    if (result.length > 20) {
      result = label.replace(".pdf", "").substring(0, 20) + "..."
    }


    return result
  }

  delete(file: any) {
    this.multipleFiles = this.multipleFiles.filter((toBeUploadedFile) => toBeUploadedFile != file)
  }

  previousStep() {
    this.stepMultipleAdd = 1
  }
}
