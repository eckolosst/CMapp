import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-ciudad-mujer',
  templateUrl: 'ciudad-mujer.html',
})
export class CiudadMujerPage {

  listaContactos:any[]=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {}

}
