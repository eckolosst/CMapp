import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { GLOBAL } from '../../global';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class UserService {
  public url: String;
  public identity;
  public token;

  constructor(private _http:Http, private nativeStorage: NativeStorage){
      this.url = GLOBAL.url;
  }

  register(user_to_register){
      let params = JSON.stringify(user_to_register);
      let headers = new Headers({'Content-Type': 'application/json', 'Authorization': this.getToken()});
      return this._http.post(this.url+'/registro/', params, {headers:headers})
                       .map(res => res.json());
  }

  login(user_to_login, gettoken = null){
      if(gettoken != null){
          user_to_login.gettoken = gettoken;
      }
      let params = JSON.stringify(user_to_login);
      let headers =  new Headers({'Content-Type': 'application/json'});
      return  this._http.post(this.url+'/usuarioLog/app', params, {headers:headers})
                        .map(res => res.json());
  }

  updateSeguimiento(data,id){
    let headers = new Headers({"Content-Type":"application/json", 'Authorization': this.getToken()});
    return this._http.put(this.url+"/seguimiento/"+id,data,{headers: headers}).map(res => res.json());
  }

  getIdentity(){
    let identityIn;
    try{
      this.nativeStorage.getItem('identity').then(
        data => identityIn = data,
        error => console.error(error)
      );
    }
    catch(ex){ }
    if(identityIn != 'undefined'){ this.identity = identityIn; }
    else{ this.identity = null; }
    return this.identity;
  }

  getToken(){
    let tokenIn;
    try{
      this.nativeStorage.getItem('token').then(
        data => {tokenIn = data},
        error => console.error(error)
      );
    }
    catch(ex){ }
    if(tokenIn != 'undefined'){ this.token = tokenIn; }
    else{ this.token = null;}
    return this.token
  }
}
