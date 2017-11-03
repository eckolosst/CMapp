import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Seccion } from '../../models/seccion';
import { Section } from '../../providers/cm-api/section'

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

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Seccion) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
