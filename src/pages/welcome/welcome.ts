import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

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
