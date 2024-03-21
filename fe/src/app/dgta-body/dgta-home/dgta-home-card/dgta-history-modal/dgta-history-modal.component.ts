import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { CommonModule } from '@angular/common';
import { ILog } from '../../../../interfaces/ILog';
import { DefaultDashPipe } from '../../../../default-dash.pipe';

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

  ngOnInit() {
    this.history = this.catalogue.history!
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
