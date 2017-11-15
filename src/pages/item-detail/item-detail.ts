import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Seccion } from '../../models/seccion';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage implements OnInit{
  seccion: Seccion;
  contenido: String;
  constructor(public navCtrl: NavController, navParams: NavParams) {
      this.seccion = navParams.get('seccion');
  }

  ngOnInit():void{
    this.contenido = this.seccion.contenido;
  }
}
