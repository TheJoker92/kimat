import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlace } from '../../../../interfaces/IPlace';
import { CommonModule } from '@angular/common';
import { IDossier } from '../../../../interfaces/IDossier';
import { DefaultDashPipe } from '../../../../default-dash.pipe';
import { DgtaUpdateCollocationModalComponent } from './dgta-update-collocation-modal/dgta-update-collocation-modal.component';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'dgta-collocation-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, DgtaUpdateCollocationModalComponent, FontAwesomeModule],
  templateUrl: './dgta-collocation-modal.component.html',
  styleUrl: './dgta-collocation-modal.component.scss'
})
export class DgtaCollocationModalComponent {
  @Input() dossier: IDossier = {}
  @Output() closeCollocationModalE = new EventEmitter()

  faChevronLeft = faChevronLeft

  isOpenUpdateCollocationModal = false

  places: IPlace[] = []

  currentPlace: IPlace = {}

  isSelectedCurrent = true
  isSelectedHistory = false

  constructor() {
  }

  ngOnInit() {
    this.dossier.placement![0]["date"] = this.dossier.history![0].date!
    console.log(this.dossier.placement)

    this.currentPlace = this.dossier.placement![this.dossier.placement!.length -1]
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

  activeCurrentTab() {
    this.isSelectedCurrent = true
    this.isSelectedHistory = false
  }

  activeHistoryTab() {
    this.isSelectedHistory = true
    this.isSelectedCurrent = false
  }

  getPlacementLogs() {
    return this.dossier.placement!.filter((placementLog: any) => placementLog != this.dossier.placement![this.dossier.placement!.length -1] && placementLog.date)
  }

  closeAllModal() {
    this.closeUpdateCollocationModal()
    this.closeCollocationModalE.emit()
  }

  onUpdateDossier(dossier: any) {
    this.dossier = dossier
  }
}
