import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Seccion } from '../../models/seccion';
import { Section } from '../../providers/cm-api/section'

import { WelcomePage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html',
  providers: [Section]
})
export class ListMasterPage {
  secciones: Seccion[];
  constructor(public navCtrl: NavController, private _service : Section) {
    this._service.getListaSecciones().subscribe(
        result =>{
            console.log(result);
            this.secciones = result.secciones;
        },
        error =>{
            console.log(<any>error);
        }
    );
  }

  openItem(seccion: Seccion) {
    this.navCtrl.push('ItemDetailPage', {
      seccion: seccion
    });
  }

  goLogReg() {
    this.navCtrl.setRoot(WelcomePage);
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }
}
