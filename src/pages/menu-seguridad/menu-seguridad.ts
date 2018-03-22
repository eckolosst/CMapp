import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-menu-seguridad',
  templateUrl: 'menu-seguridad.html',
})
export class MenuSeguridadPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  goGrupos(){
    this.navCtrl.push("GrupoPage");
  }
}
