import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GLOBAL } from '../../global';

@Injectable()
export class Section{
  public url: String; 

  constructor(
    public _http: Http
  ){
    this.url = GLOBAL.url;
  }

  /*---------------------------------------------------------------------------*/
  /*                        Peticiones para Secciones                          */
  /*---------------------------------------------------------------------------*/
  getListaSecciones(hoy){
    let headers = new Headers({"Content-Type":"application/json"});
    return this._http.get(this.url+"/secciones/"+hoy,{headers: headers}).map(res => res.json());
  }

}
