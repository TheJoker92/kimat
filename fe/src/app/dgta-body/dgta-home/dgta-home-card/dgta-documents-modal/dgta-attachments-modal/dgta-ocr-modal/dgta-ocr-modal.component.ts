import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpService } from '../../../../../../http.service';
import { IDocument } from '../../../../../../interfaces/IDocument';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'dgta-ocr-modal',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dgta-ocr-modal.component.html',
  styleUrl: './dgta-ocr-modal.component.scss'
})
export class DgtaOcrModalComponent {
  @Input() document: IDocument = {}
  @Input() ocrText: string = ""
  @Output() closeOcrModalE = new EventEmitter()

  faChevronLeft = faChevronLeft

  deliberazioneTemaplateJSON: any = {}

  constructor(private http: HttpService) {

  }


  ngOnInit() {
    let ocrTextNormalized = this.ocrText.toUpperCase().replace(/\s/g, "").trim()
    if (ocrTextNormalized.includes("GIUNTACOMUNALE")) {
      this.deliberazioneTemaplateJSON.documentType = "DELIBERAZIONE DELLA GIUNTA COMUNALE"
      let stringTextElem = ocrTextNormalized.split("DELIBERAZIONEN.")[1]
      if (!stringTextElem) {
        stringTextElem = ocrTextNormalized.split("DELIBERAZIONEN")[1]
      }

      let numeroStrTmp: string = stringTextElem[0]
      for (let index = 1; index < stringTextElem.length; index++) {

        if (isNaN(Number(numeroStrTmp))) {
          break
        }

        numeroStrTmp += stringTextElem[index]

      }
      this.deliberazioneTemaplateJSON.numero = numeroStrTmp.replace(/[^0-9]/g, '')

      this.deliberazioneTemaplateJSON.oggetto = this.ocrText.split("OGGETTO")[1].split("L\u2019")[0]

      let rawDate = ocrTextNormalized.split("L\u2019")[1]
      
      if(!rawDate || !rawDate.includes("ANNO")) {
        rawDate = ocrTextNormalized.split("LANNO")[1]
      }

      if(!rawDate || !rawDate.includes("ANNO")) {
        rawDate = ocrTextNormalized.split("L’")[1]
      }

      if(!rawDate || !rawDate.includes("ANNO")) {
        rawDate = this.ocrText.split("L\u2019")[1].toUpperCase().replace(/\s/g, "").trim()
      }
      
      rawDate = rawDate.split("NELLA")[0]

      if (!rawDate.includes("ANNO")) {
        rawDate = ocrTextNormalized.split("L'")[1].split("NELLA")[0]
      }

      this.deliberazioneTemaplateJSON.annoStr = rawDate.split("ANNO")[1].split(",")[0]
      this.deliberazioneTemaplateJSON.giornoStr = rawDate.split("ADDI")[1].split("DEL")[0]
      this.deliberazioneTemaplateJSON.meseStr = rawDate.split("DELMESEDI")[1]

      if (!this.deliberazioneTemaplateJSON.meseStr) {
        this.deliberazioneTemaplateJSON.meseStr = rawDate.split("MESEDI")[1]
      }
      
      this.deliberazioneTemaplateJSON.meseStr = this.deliberazioneTemaplateJSON.meseStr.split("ALLEORE")[0].replace(".", ":").replace(",", ":")
      this.deliberazioneTemaplateJSON.oreStr = rawDate.split("ALLEORE")[1].split("NELLA")[0].replace(".", ":").replace(",", ":")


      this.deliberazioneTemaplateJSON.data = this.getDayNumber(this.deliberazioneTemaplateJSON.giornoStr) + "-" + this.getMonthNumber(this.deliberazioneTemaplateJSON.meseStr) + "-" + this.getYearNumber(this.deliberazioneTemaplateJSON.annoStr)
      this.deliberazioneTemaplateJSON.dataNoDash = "a" + this.deliberazioneTemaplateJSON.data.replaceAll("-","")
      console.log(this.deliberazioneTemaplateJSON)

      if (this.document.topics!.length == 0) {

        let payload: any = {
          "parentId": this.document.parentId,
          "_id": this.document._id,
          "name": this.document.name,
          "history": JSON.stringify(this.document.history),
          "attachments": JSON.stringify({
            name: this.document.name,
            ext: "pdf"
          }),
          "deviceIds": JSON.stringify([]),
          "states": JSON.stringify(this.document.states),
          "topics": JSON.stringify([this.deliberazioneTemaplateJSON]),
          "placement": JSON.stringify(this.document.placement),
          "owners": JSON.stringify(this.document.owners),
          "deliberationDate": this.deliberazioneTemaplateJSON.dataNoDash
        }
  
        console.log(payload)
        this.http.addDocument(payload).subscribe({
          next: (response: any) => {
  
            if (response.code == 200) {
              alert("Hai aggiornato il catalogo")
            } else {
              alert("Qualcosa è andato storto. Contattare l'assistenza.")
            }
          },
          error: (error) => {
            console.error(error)
            alert("Qualcosa è andato storto. Contattare l'assistenza.")
          }
        })
      }
    }

  }



  close() {
    this.closeOcrModalE.emit()
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

}
