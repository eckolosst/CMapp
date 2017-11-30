import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-commentary',
  templateUrl: 'commentary.html',
})
export class CommentaryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  sendComment(){
      /*Se deberian pasar los datos al servidor, y desde ahi enviar el mail
      desde una cuenta de correo que este definida en la api, hacia una cuenta
      de mumala. Antes deberia verificarse en el movil que se cuenta con conexion
      a internet, esto puede hacerse con el modulo nativo de ionic "Network"*/
  }
}
