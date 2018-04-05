import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { WelcomePage } from '../pages';
import { UserService } from '../../providers/providers';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  public user;
  public signupErrorString;
  public data; //Borrar

  constructor(public navCtrl: NavController,
    public _userService: UserService,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
      this.user = new User('','','','','user',[]);
      this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
        this.signupErrorString = value;
      })
  }

  doSignup() {

    // Attempt to login in through our User service
    this._userService.register(this.user).subscribe((resp) => {
      this.navCtrl.pop();
      // this.data = resp;
    }, (err) => {

      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
