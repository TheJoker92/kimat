import { Injectable } from '@angular/core';
import { IUser } from './interfaces/IUser';
import { IDocument } from './interfaces/IDocument';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  user: IUser = {}
  documentSelected: IDocument = {}

  constructor() {
    if (sessionStorage.getItem("sessionTmp")) {
      let sessionTmp: SessionService = JSON.parse(sessionStorage.getItem("sessionTmp")!)

      this.user = sessionTmp.user
      this.documentSelected = sessionTmp.documentSelected
    }
  }

  saveSession(label: string, value: any) {
    (this as any)[label] = value

    console.log((this as any)[label])
    // sessionStorage.setItem("session", JSON.stringify(this))
  }

  deleteSession() {
    sessionStorage.setItem("session", "")

  }
}
