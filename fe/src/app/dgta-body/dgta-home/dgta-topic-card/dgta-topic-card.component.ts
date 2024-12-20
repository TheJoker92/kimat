import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDossier } from '../../../interfaces/IDossier';
import * as rawData from '../../../../assets/enum.json';
import { SessionService } from '../../../session.service';
@Component({
  selector: 'dgta-topic-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dgta-topic-card.component.html',
  styleUrl: './dgta-topic-card.component.scss'
})
export class DgtaTopicCardComponent {
  @Input() dossiers: IDossier[] = []
  @Input() numTopics:any = {}

  @Output() getDossiersByTopicE = new EventEmitter()
  @Output() closeFilterModalE = new EventEmitter()

  data: any = rawData

  @Input() topics: any[] = []

  filteredTopics: any[] = []

  isFiltered = false

  ngOnChanges() {
    if(this.topics && this.topics.length) this.filteredTopics = this.topics.filter(topic => this.numTopics[topic.rawName])

    // if (this.isFiltered) {
    //   this.filteredTopics = [{
    //     rawName: "*",
    //     name: "TUTTI",
    //     className: "card row-center-center color-tutti"
    //   }]
    // }
  }

  ngAfterViewInit() {
    for (let topic of this.data.topics) {
      this.getDossiersByTopicE.emit(topic)
    }

    this.numTopics["*"] = 0

    if (Object.keys(this.sessionService.termsDossier.topics).length == 0) {
      for (let key of Object.keys(this.numTopics)) {
        this.numTopics["*"] += this.numTopics[key]
      }
    }

    this.filteredTopics = this.topics.filter(topic => this.numTopics[topic.rawName])


    console.log(this.topics)
  }

  classCard = ""
  constructor(private sessionService: SessionService) {
    for (let topic of this.data.topics) {
      this.topics.push({
        rawName: topic,
        name: topic.toUpperCase(),
        className: "card row-center-center color-" + topic.toLowerCase().replaceAll(" ","-")
      })
    }


    // this.topics.unshift({
    //   rawName: "*",
    //   name: "TUTTI",
    //   className: "card row-center-center color-tutti"
    // })

    console.log(this.topics)
  }



  getDossierByTopic(topic: any) {

    if (this.isFiltered) {
      this.sessionService.termsDossier["topics"] = ""

      this.isFiltered = false
    } else {
      this.isFiltered = true

      this.filteredTopics = this.topics.filter(topic => this.numTopics[topic.rawName])
      this.sessionService.termsDossier["topics"] = topic.rawName
    }



    this.getDossiersByTopicE.emit()

  }

  isAddedTopic(topic: any) {
    let result

    if (this.topics.filter((addedTopic: any) => addedTopic == topic).length) {
      result = true
    }
    return !result
  }

  close() {
    this.closeFilterModalE.emit()
  }
}
