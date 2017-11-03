import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Seccion } from '../../models/seccion';
import { GLOBAL } from '../../global';

@Injectable()
export class Section{
  public url: String;

  constructor(
    public _http: Http
  ){
    this.url = GLOBAL.url;
  }
  public token;

  getTokem(){
      let tokenIn = localStorage.getItem('token');
      if(tokenIn != 'undefined'){
          this.token = tokenIn;
      }
      else{
          this.token = null;
      }
      return this.token
  }

  /*---------------------------------------------------------------------------*/
  /*                        Peticiones para Secciones                          */
  /*---------------------------------------------------------------------------*/
  getListaSecciones(){
    let headers = new Headers({"Content-Type":"application/json"});
    return this._http.get(this.url+"/secciones",{headers: headers}).map(res => res.json());
  }
  getSeccion(id){
    let headers = new Headers({"Content-Type":"application/json", 'Authorization': this.getTokem()});
    return this._http.get(this.url+"/seccion/"+id,{headers: headers}).map(res => res.json());
  }
  editSeccion(id, data){
    let headers = new Headers({"Content-Type":"application/json", 'Authorization': this.getTokem()});
    return this._http.put(this.url+"/seccion/"+id,data,{headers: headers}).map(res => res.json());
  }
  deleteSeccion(id){
    let headers = new Headers({"Content-Type":"application/json", 'Authorization': this.getTokem()});
    let options = new RequestOptions({headers: headers});
    return this._http.delete(this.url+"/seccion/"+id,options).map(res => res.json());
  }
  createSeccion(data){
    let params = JSON.stringify(data);
    let headers = new Headers({"Content-Type":"application/json", 'Authorization': this.getTokem()});
    return this._http.post(this.url+"/seccion",params,{headers: headers}).map(res => res.json());
  }
}
