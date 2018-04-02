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
  public infoUser;

  constructor(
    public navCtrl: NavController,
    public _userService: UserService,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private nativeStorage: NativeStorage) {
      this.user = new User('','','','','user',[]);
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
                        this.nativeStorage.setItem('token', this.token).then( () => {
                          /* console.log('Stored item!')
                          Si almacenó el token en storage procedo a verificar si existen arreglos de grupos*/
                          this.nativeStorage.getItem('infoUser').then((info) => {
                            /*Si ya existe un arreglo verifico que haya uno para el user logueandose*/
                            if(info.find(x => x.idUser == this.identity._id) == undefined){
                              this.infoUser.push({"idUser": this.identity._id, "grupos": [{"nombre":"Familia","contactos":[]}]});
                              this.nativeStorage.setItem('infoUser', this.infoUser)
                              // this.msjLog("Existe arreglo, verifico que haya uno para el user logueado");
                            }
                          },(error) => {
                            this.msjLog("entro en errr");
                            /*Si no existe un arreglo creo uno nuevo con el user que se loguea*/
                            this.infoUser.push({"idUser": this.identity._id, "grupos": [{"nombre":"Familia","contactos":[]}]})
                            this.nativeStorage.setItem('infoUser', this.infoUser);
                            this.msjLog("No existe arreglo, creo uno nuevo con user logueado");
                          });
                        },(error) => console.error('Error storing item', error));
                        this.navCtrl.pop();
                    }
                    // this.status = 'succes';
                },(error) => {console.log(<any> error)});
        }
      },(err) => {
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

  private msjLog(msj: string){
    let toast1 = this.toastCtrl.create({
      message: msj,
      duration: 5000,
      position: 'center'
    });
    toast1.present();
  }
}
