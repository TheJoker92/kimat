import { Injectable } from '@angular/core';
import { IUser } from './interfaces/IUser';
import { IDocument } from './interfaces/IDocument';
import { IPageNavigation, PageEnum } from './interfaces/IPageNavigation';
import { ICatalogue } from './interfaces/ICatalogue';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  user: IUser | undefined
  documentSelected: IDocument | undefined
  pageNavigation: PageEnum[] = [PageEnum.LOGIN]

  terms: any = {}

  catalogue: ICatalogue = {}
  isOpenOwnersModal: boolean = false
  isOpenCollocationModal: boolean = false
  isOpenHistoryModal: boolean = false
  isOpenDocumentsModal: boolean = false
  isOpenViewBarcodeModal: boolean = false

  constructor() {
    if (localStorage.getItem("session")) {
      let sessionTmp: SessionService = JSON.parse(localStorage.getItem("session")!)

      this.user = sessionTmp.user
      this.documentSelected = sessionTmp.documentSelected
      this.pageNavigation = sessionTmp.pageNavigation
    }
  }

  saveSession(label: string, value: any) {
    (this as any)[label] = value

    console.log("saveSession", (this as any)[label])
    localStorage.setItem("session", JSON.stringify(this))
  }

  deleteSession() {
    localStorage.setItem("session", "")
    window.location.reload()

  }
}
