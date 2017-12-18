import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  goCommentary(){
    this.navCtrl.push('CommentaryPage');
  }

  goSendPic(){
    this.navCtrl.push('SendPicPage');
  }

  goTestimony(){
    this.navCtrl.push('SendTestimonyPage');
  }
}
