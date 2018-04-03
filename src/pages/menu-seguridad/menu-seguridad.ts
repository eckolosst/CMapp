import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { WelcomePage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-menu-seguridad',
  templateUrl: 'menu-seguridad.html',
})
export class MenuSeguridadPage {

  private logueado: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
  ) {}

  private ionViewWillEnter(){
    this.nativeStorage.getItem('identity').then(
      () => {this.logueado = true;},
      (error) => {
        this.logueado = false;
        this.navCtrl.push(WelcomePage)
      });
  }

  goGrupos(){
    this.navCtrl.push("GrupoPage");
  }

  goSecurity(){
    this.navCtrl.push("SecurityPage")
  }
}
