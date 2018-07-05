import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
  selector: 'page-llamanos',
  templateUrl: 'llamanos.html',
})
export class LlamanosPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private callNumber: CallNumber,
    public translateService: TranslateService) {
  }

  call(){
    this.callNumber.callNumber("02994723022", true)
      .then(() => {})
  }

}
