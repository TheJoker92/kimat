import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as rawData from '../../../../../../assets/enum.json';
import { SessionService } from '../../../../../session.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'dgta-filter-documents',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dgta-filter-documents.component.html',
  styleUrl: './dgta-filter-documents.component.scss'
})
export class DgtaFilterDocumentsComponent {

  @Input() documents: any[] = []

  @Output() getDocumentsByDateE = new EventEmitter()
  @Output() closeFilterModalE = new EventEmitter()

  @Output() startDateE = new EventEmitter()
  @Output() endDateE = new EventEmitter()
  

  data: any = rawData

  faChevronLeft = faChevronLeft

  startDate: any
  endDate: any


  filteredTopics: any[] = []

  isFiltered = false

  ngOnChanges() {
  }    

  constructor(private sessionService: SessionService) {}

  close() {
    this.closeFilterModalE.emit()
  }

  setStartDate(e: any) {
    this.startDate = e.target.value
    this.startDateE.emit(this.startDate)
  }

  setEndDate(e: any) {
    this.endDate = e.target.value
    this.endDateE.emit(this.endDate)
  }

  formatDate(date: string) {
    //NO  DASH FOR SOLR SEARCH
    let dateArray = date.split("T")[0].split("-")
    return dateArray[2] + dateArray[1] + dateArray[0]
  }
}
