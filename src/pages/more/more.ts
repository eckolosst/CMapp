import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
// import { MainPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  public identity;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    public toastCtrl: ToastController) {

      this.nativeStorage.getItem('identity')
        .then(
          data => {
            this.identity = data != undefined;
          },
          error => {
            console.error(error, this.identity)
            this.identity = false;
          }
      );
  }

  ionViewDidEnter(){

    this.nativeStorage.getItem('identity')
      .then(
        data => {
          console.log("Entró a more")
          this.identity = data != undefined;
        },
        error => {
          this.identity = false;
        }
    );
  }

  goLlamanos(){
    this.navCtrl.push("LlamanosPage");
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

  logout(){
    this.nativeStorage.remove('identity').then(
        () => {
          this.identity = false;
          let toast = this.toastCtrl.create({
          message: "Sesion cerrada correctamente!",
          duration: 3000,
          position: 'top'
          });
          toast.present();
          // this.navCtrl.setRoot(MainPage);
          this.navCtrl.setRoot(this.navCtrl.getActive().component)
      },
      error => console.error('Error cerrando sesión', error)
    );
  }
}
