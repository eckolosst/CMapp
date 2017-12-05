import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  goTestimony() {
    this.navCtrl.push('ContactUsPage');
  }

  goMumala() {
    this.navCtrl.push('MumalaPage');
  }

  goCiudadMujer() {
    this.navCtrl.push('CiudadMujerPage');
  }
}
