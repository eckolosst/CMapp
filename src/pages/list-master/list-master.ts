import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Seccion } from '../../models/seccion';
import { Section } from '../../providers/cm-api/section'


@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html',
  providers: [Section]
})
export class ListMasterPage{
  secciones: Seccion[];
  slides: String[];
  public identity;

  constructor(
    public navCtrl: NavController,
    private _service : Section,
    private nativeStorage: NativeStorage ) {
    this._service.getListaSecciones().subscribe(
        result =>{this.secciones = result.secciones;},
        error =>{}
    );

    this.slides = [
      "assets/img/s1.png",
      "assets/img/s2.png",
      "assets/img/s3.png"
    ]
  }

  ionViewWillEnter(){
    this.nativeStorage.getItem('identity')
      .then(
        data => {this.identity = data != undefined; },
        error => {this.identity = false;}
    );
  }

  openItem(seccion: Seccion) {
    this.navCtrl.push('ItemDetailPage', {seccion: seccion});
  }

  goLogReg() {
    this.navCtrl.push('WelcomePage');
  }

}
