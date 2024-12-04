import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DgtaUpdateCollocationCatalogueModalComponent } from './dgta-update-collocation-catalogue-modal/dgta-update-collocation-catalogue-modal.component';
import { DefaultDashPipe } from '../../../default-dash.pipe';
import { ICatalogue } from '../../../interfaces/ICatalogue';
import { IPlace } from '../../../interfaces/IPlace';

@Component({
  selector: 'dgta-collocation-catalogue-modal',
  standalone: true,
  imports: [CommonModule, DefaultDashPipe, DgtaUpdateCollocationCatalogueModalComponent, FontAwesomeModule],
  templateUrl: './dgta-collocation-catalogue-modal.component.html',
  styleUrl: './dgta-collocation-catalogue-modal.component.scss'
})
export class DgtaCollocationCatalogueModalComponent {

  @Input() catalogue: ICatalogue = {}
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
    this.catalogue.placement![0]["date"] = this.catalogue.history![0].date!
    console.log(this.catalogue.placement)

    this.currentPlace = this.catalogue.placement![this.catalogue.placement!.length -1]
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
    return this.catalogue.placement!.filter((placementLog: any) => placementLog != this.catalogue.placement![this.catalogue.placement!.length -1] && placementLog.date)
  }

  closeAllModal() {
    this.closeUpdateCollocationModal()
    this.closeCollocationModalE.emit()
  }

  onUpdateCatalogue(catalogue: any) {
    this.catalogue = catalogue
  }
}
