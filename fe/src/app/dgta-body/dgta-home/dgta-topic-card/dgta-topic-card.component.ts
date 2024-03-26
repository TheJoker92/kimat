import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICatalogue } from '../../../interfaces/ICatalogue';
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
  @Input() catalogues: ICatalogue[] = []
  @Output() getCataloguesByTopicE = new EventEmitter()

  data: any = rawData

  topics: any[] = []

  classCard = ""
  constructor(private sessionService: SessionService) {
    for (let topic of this.data.topics) {
      this.topics.push({
        rawName: topic,
        name: topic.toUpperCase(),
        className: "card row-center-center color-" + topic.toLowerCase().replaceAll(" ","-")
      })
    }

    this.topics.unshift({
      rawName: "*",
      name: "TUTTI",
      className: "card row-center-center color-tutti"
    })
    console.log(this.topics)
  }

  getDocumentByTopic(topic: any) {
    this.sessionService.terms["topics"] = topic.rawName
    this.getCataloguesByTopicE.emit()
  }
}
