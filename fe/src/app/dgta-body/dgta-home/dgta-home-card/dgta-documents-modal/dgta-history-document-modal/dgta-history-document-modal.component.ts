import { CommonModule } from "@angular/common"
import { Component, Input, Output, EventEmitter } from "@angular/core"
import { DefaultDashPipe } from "../../../../../default-dash.pipe"
import { ILog } from "../../../../../interfaces/ILog"
import { IDocument } from "../../../../../interfaces/IDocument"
import { SessionService } from "../../../../../session.service"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome"
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dgta-history-document-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, FontAwesomeModule],
  templateUrl: './dgta-history-document-modal.component.html',
  styleUrl: './dgta-history-document-modal.component.scss'
})
export class DgtaHistoryDocumentModalComponent {
  @Input() document: IDocument = {}
  @Output() closeHistoryModalE = new EventEmitter()

  faChevronLeft = faChevronLeft

  history: ILog[] = []

  isSelectedInfo = true
  isSelectedLog = false

  constructor(private session: SessionService) { }

  ngOnInit() {
    this.history = this.document.history!.filter((log: ILog) => this.session.user?.role == "admin" || log.user?.id == this.session.user?.id)
    console.log("H", this.history)
  }

  logReader(log: ILog) {
    console.log("LOG",log)
  }

  closeHistoryModal() {
    this.closeHistoryModalE.emit()
  }  

  formatDate (date: string) {
    let dateArray = date.split("T")[0].split("-")
    return dateArray[2] + "-" + dateArray[1]+ "-" + dateArray[0]
  }

  getUserFullName(log: ILog) {
    return log.user?.firstName + " " + log.user?.lastName
  }

  getUserFirstName(log: ILog) {
    return log.user?.firstName
  }

  getUserLastName(log: ILog) {
    return log.user?.lastName
  }

  formatHour(hour: string) {
    let hourArray = hour.split("T")[1].split(":")
    return hourArray[0] + ":" + hourArray[1]
  }

  activeLogTab() {
    this.isSelectedLog = true
    this.isSelectedInfo = false
  }

  activeInfoTab() {
    this.isSelectedLog = false
    this.isSelectedInfo = true
  }
}
