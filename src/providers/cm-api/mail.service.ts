import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
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
    let param = JSON.stringify(comment);
    let headers = new Headers({"Content-Type":"application/json"});
    return this._http.post(this.url+"/sendMail",param,{headers: headers}).map(res => res.json());
  }

  sendMailPic(content){
    let param = JSON.stringify(content);
    let headers = new Headers({"Content-Type":"application/json"});
    return this._http.post(this.url+"/sendMailPic",param,{headers: headers}).map(res => res.json());
  }
}
