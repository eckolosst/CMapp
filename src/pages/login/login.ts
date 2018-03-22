import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { UserService } from '../../providers/providers';
import { User } from '../../models/user';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public identity;
  public token;
  public user;

  constructor(
    public navCtrl: NavController,
    public _userService: UserService,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private nativeStorage: NativeStorage) {
      this.user = new User('','','','');
  }

  doLogin() {
    this._userService.login(this.user).subscribe(
      (response) => {
        this.identity = response;
        if(!this.identity || !this.identity._id){
            console.log('El usuario no se ha logueado coorectamente: id incorrecto')
        }else{
            this.nativeStorage.setItem('identity', this.identity).then(
              () => console.log('Stored item!'+this.identity),
              error => console.error('Error storing item', error)
            );
            //Obtencion del token
            this._userService.login(this.user, 'true').subscribe(
                response => {
                    this.token = response.token;
                    if(this.token.length <= 0){console.log('El token no se ha generado');}
                    else{
                        this.nativeStorage.setItem('token', this.token)
                        .then(
                          () => console.log('Stored item!'),
                          error => console.error('Error storing item', error)
                        );
                        // this.status = 'succes';
                        this.navCtrl.pop();
                    }
                },
                error => {console.log(<any> error);}
            );
        }
      },
      (err) => {
        // this.navCtrl.push(MainPage);
        // Unable to log in
        let toast = this.toastCtrl.create({
          message: "Error al Iniciar Sesión. Por favor verifique sus datos.",
          duration: 10000,
          position: 'top'
        });
        toast.present();
    });
  }
}
