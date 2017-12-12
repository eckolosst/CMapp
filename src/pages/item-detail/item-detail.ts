import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Seccion } from '../../models/seccion';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage implements OnInit{
  seccion: Seccion;
  contenido;
  constructor(public navCtrl: NavController, navParams: NavParams, private sanitizer: DomSanitizer) {
      this.seccion = navParams.get('seccion');
  }

  ngOnInit():void{
    let st = (this.seccion.contenido).toString();
    this.contenido = this.sanitizer.bypassSecurityTrustHtml(st);
  }
}
