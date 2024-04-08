import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { CommonModule } from '@angular/common';
import { ILog } from '../../../../interfaces/ILog';
import { DefaultDashPipe } from '../../../../default-dash.pipe';
import { SessionService } from '../../../../session.service';

@Component({
  selector: 'dgta-history-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe],
  templateUrl: './dgta-history-modal.component.html',
  styleUrl: './dgta-history-modal.component.scss'
})
export class DgtaHistoryModalComponent {
  @Input() catalogue: ICatalogue = {}
  @Output() closeHistoryModalE = new EventEmitter()

  history: ILog[] = []

  constructor(private session: SessionService) { }

  ngOnInit() {
    this.history = this.catalogue.history!.filter((log: ILog) => this.session.user?.role == "admin" || log.user?.id == this.session.user?.id)
  }

  closeHistoryModal() {
    this.closeHistoryModalE.emit()
  }  

  getUserFullName(log: ILog) {
    return log.user?.firstName + " " + log.user?.lastName
  }

  formatDate (date: string) {
    let dateArray = date.split("T")[0].split("-")
    return dateArray[2] + "-" + dateArray[1]+ "-" + dateArray[0]
  }
}
