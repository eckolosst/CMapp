import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Seccion } from '../../models/seccion';
declare var $: any;

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage implements OnInit{
  seccion: any;
  contenidoX: String;
  constructor(public navCtrl: NavController, navParams: NavParams) {
      this.seccion = navParams.get('seccion');
  }

  ngOnInit():void{
      var $log = $("#contenidoX");
      var htmlString = $.parseHTML(this.seccion.contenido);
      $log.append(htmlString);
  }
}
