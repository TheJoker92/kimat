import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlace } from '../../../../interfaces/IPlace';
import { CommonModule } from '@angular/common';
import { ICatalogue } from '../../../../interfaces/ICatalogue';
import { DefaultDashPipe } from '../../../../default-dash.pipe';
import { DgtaUpdateCollocationModalComponent } from './dgta-update-collocation-modal/dgta-update-collocation-modal.component';

@Component({
  selector: 'dgta-collocation-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, DgtaUpdateCollocationModalComponent],
  templateUrl: './dgta-collocation-modal.component.html',
  styleUrl: './dgta-collocation-modal.component.scss'
})
export class DgtaCollocationModalComponent {
  @Input() catalogue: ICatalogue = {}
  @Output() closeCollocationModalE = new EventEmitter()

  isOpenUpdateCollocationModal = false

  places: IPlace[] = []

  constructor() {
  }

  ngOnInit() {
    this.catalogue.placement![0]["date"] = this.catalogue.history![0].date!
    console.log(this.catalogue.placement)
  }

  close() {
    this.closeCollocationModalE.emit()
  }

  formatDate (date: string) {
    let dateArray = date.split("T")[0].split("-")
    return dateArray[2] + "-" + dateArray[1]+ "-" + dateArray[0]
  }

  openUpdateCollocationModal() {
    this.isOpenUpdateCollocationModal = true
  }

  closeUpdateCollocationModal() {
    this.isOpenUpdateCollocationModal = false
  }
}
