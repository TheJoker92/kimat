import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as rawData from '../assets/enum.json';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  BASE_URL = "https://127.0.0.1:8000/"
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
  getCatalogues() {
    return this.http.get(this.buildURL("catalogues/", this.data.catalogue.getCatalogues))
  }
  
  addCatalogue(payload: any) {
    return this.http.post(this.buildURL("catalogues/", this.data.catalogue.add), payload, this.httpOptions)
  }
}
