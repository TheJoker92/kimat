import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICatalogue } from '../../../interfaces/ICatalogue';
import * as rawData from '../../../../assets/enum.json';
import { SessionService } from '../../../session.service';

@Component({
  selector: 'dgta-topic-card-catalogue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dgta-topic-card-catalogue.component.html',
  styleUrl: './dgta-topic-card-catalogue.component.scss'
})
export class DgtaTopicCardCatalogueComponent {

  @Input() catalogues: ICatalogue[] = []
  @Input() numTopics:any = {}

  @Output() getCataloguesByTopicE = new EventEmitter<any>()
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
      this.getCataloguesByTopicE.emit(topic)
    }

    this.numTopics["*"] = 0

    if (Object.keys(this.sessionService.terms.topics).length == 0) {
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



  getDocumentByTopic(topic: any) {

    if (this.isFiltered) {
      this.sessionService.terms["topics"] = "*"

      this.isFiltered = false
    } else {
      this.isFiltered = true

      this.filteredTopics = this.topics.filter(topic => this.numTopics[topic.rawName])
      this.sessionService.terms["topics"] = topic.rawName
    }



    this.getCataloguesByTopicE.emit()

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
