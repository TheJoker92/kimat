import { Injectable } from '@angular/core';
import { IUser } from './interfaces/IUser';
import { IDocument } from './interfaces/IDocument';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  user: IUser | undefined
  documentSelected: IDocument | undefined

  constructor() {
    if (localStorage.getItem("session")) {
      let sessionTmp: SessionService = JSON.parse(localStorage.getItem("session")!)

      this.user = sessionTmp.user
      this.documentSelected = sessionTmp.documentSelected
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
