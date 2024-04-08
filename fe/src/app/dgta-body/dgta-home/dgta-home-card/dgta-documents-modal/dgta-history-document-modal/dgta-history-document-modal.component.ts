import { CommonModule } from "@angular/common"
import { Component, Input, Output, EventEmitter } from "@angular/core"
import { DefaultDashPipe } from "../../../../../default-dash.pipe"
import { ILog } from "../../../../../interfaces/ILog"
import { IDocument } from "../../../../../interfaces/IDocument"
import { SessionService } from "../../../../../session.service"

@Component({
  selector: 'dgta-history-document-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe],
  templateUrl: './dgta-history-document-modal.component.html',
  styleUrl: './dgta-history-document-modal.component.scss'
})
export class DgtaHistoryDocumentModalComponent {
  @Input() document: IDocument = {}
  @Output() closeHistoryModalE = new EventEmitter()

  history: ILog[] = []

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

  getUserFullName(log: ILog) {
    console.log(log.user)
    return log.user?.firstName + " " + log.user?.lastName
  }

  formatDate (date: string) {
    let dateArray = date.split("T")[0].split("-")
    return dateArray[2] + "-" + dateArray[1]+ "-" + dateArray[0]
  }
}
