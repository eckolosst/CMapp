import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GLOBAL } from '../../global';

@Injectable()
export class MailService{
  public url: String;

  constructor(
    public _http: Http
  ){
    this.url = GLOBAL.url;
  }

  sendMail(comment){
    let headers = new Headers({"Content-Type":"application/json"});
    return this._http.post(this.url+"/sendMail",comment,{headers: headers}).map(res => res.json());
  }
}
