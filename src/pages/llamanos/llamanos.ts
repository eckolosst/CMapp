import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the LlamanosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-llamanos',
  templateUrl: 'llamanos.html',
})
export class LlamanosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private callNumber: CallNumber) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LlamanosPage');
  }

  call(){
    // Tel. Mumala 02994494560
    this.callNumber.callNumber("02996736141", true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

}
