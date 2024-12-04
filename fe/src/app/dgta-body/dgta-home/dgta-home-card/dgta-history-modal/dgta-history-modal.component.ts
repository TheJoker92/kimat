import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDossier } from '../../../../interfaces/IDossier';
import { CommonModule } from '@angular/common';
import { ILog } from '../../../../interfaces/ILog';
import { DefaultDashPipe } from '../../../../default-dash.pipe';
import { SessionService } from '../../../../session.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'dgta-history-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, FontAwesomeModule],
  templateUrl: './dgta-history-modal.component.html',
  styleUrl: './dgta-history-modal.component.scss'
})
export class DgtaHistoryModalComponent {
  @Input() dossier: IDossier = {}
  @Output() closeHistoryModalE = new EventEmitter()

  faChevronLeft = faChevronLeft

  history: ILog[] = []

  isSelectedInfo = true
  isSelectedLog = false

  constructor(private session: SessionService) { }

  ngOnInit() {
    this.history = this.dossier.history!.filter((log: ILog) => this.session.user?.role == "admin" || log.user?._id == this.session.user?._id)
  }

  closeHistoryModal() {
    this.closeHistoryModalE.emit()
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

  formatDate (date: string) {
    let dateArray = date.split("T")[0].split("-")
    return dateArray[2] + "-" + dateArray[1]+ "-" + dateArray[0]
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
