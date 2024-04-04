import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as rawData from '../assets/enum.json';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // BASE_URL  = "https://127.0.0.1:8000/"
  BASE_URL = "https://151.31.100.114:8000/"
  // BASE_URL = "http://127.0.0.1:8001/"
  API = "api/"

  
  data: any = rawData

  httpOptions = {
    headers: new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
  }

  constructor(private http: HttpClient) {
    this.data = this.data["endpoints"]
  }

  buildURL(entity: string, endpoint: string) {
    return this.BASE_URL + this.API  + entity + endpoint
  }

  /**
   * USERS
   */
  login(payload: any) {
    return this.http.post(this.buildURL("users/", this.data.user.login), payload, this.httpOptions)
  }

  getUser(payload: any) {
    return this.http.post(this.buildURL("users/", this.data.user.getUser), payload, this.httpOptions)
  }

  /**
   * CATALOGUES
   */
  getCatalogues(payload: any) {
    return this.http.post(this.buildURL("catalogues/", this.data.catalogue.getCatalogues), payload)
  }
  
  addCatalogue(payload: any) {
    return this.http.post(this.buildURL("catalogues/", this.data.catalogue.add), payload, this.httpOptions)
  }

  deleteCatalogue(payload: any) {
    return this.http.post(this.buildURL("catalogues/", this.data.catalogue.delete), payload, this.httpOptions)
  }

  /**
   * DOCUMENTS
   */
  getDocuments(payload: any) {
    return this.http.post(this.buildURL("documents/", this.data.document.getDocuments), payload, this.httpOptions)
  }
  
  addDocument(payload: any) {
    return this.http.post(this.buildURL("documents/", this.data.document.add), payload, this.httpOptions)
  }

  uploadFile(payload: any) {
    return this.http.post(this.buildURL("documents/", this.data.document.base64), payload, this.httpOptions)
  }

  deleteDocuments(payload: any) {
    return this.http.post(this.buildURL("documents/", this.data.document.delete), payload, this.httpOptions)
  }

  getOcr(payload: any) {
    return this.http.post(this.buildURL("documents/", this.data.document.ocr), payload, this.httpOptions)

  }

  getDocumentsByDates(payload: any) {
    return this.http.post(this.buildURL("documents/", this.data.document.getDocumentsByDate), payload, this.httpOptions)
  }
}
