import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import { MainPage } from '../pages';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  public identity;

  constructor(
    public navCtrl: NavController,
    private nativeStorage: NativeStorage) { }

  ionViewWillEnter(){

    this.nativeStorage.getItem('identity')
      .then(
        data => {
          if(data != undefined)
            this.navCtrl.pop();
        },
        error => {console.error(error)}
    );
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  cancel(){
    this.navCtrl.pop();
  }
}
