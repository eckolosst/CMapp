import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController} from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SMS } from '@ionic-native/sms';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserService } from '../../providers/providers';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@IonicPage()
@Component({
  selector: 'page-menu-seguridad',
  templateUrl: 'menu-seguridad.html',
})
export class MenuSeguridadPage {

  private logueado: boolean = false;
  private map;
  private firstLoad: boolean = true;
  private data = "";

  constructor(
    public navCtrl: NavController,
    private locationAccuracy: LocationAccuracy,
    public toastCtrl: ToastController,
    private sms: SMS,
    private nativeStorage: NativeStorage,
    private _userService: UserService,
    private geolocation: Geolocation,
    private androidPermissions: AndroidPermissions
  ) {}

  ionViewWillEnter(){
    this.nativeStorage.getItem('identity').then(
      () => {this.logueado = true;},
      (error) => {
        this.logueado = false;
        this.navCtrl.push("WelcomePage")
      }
    );
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    .then(
      (result) => {
        if(result.hasPermission == false){
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
        }
      }
    );
  }

  goGrupos(){
    this.navCtrl.push("GrupoPage");
  }

  goSecurity(){
    this.navCtrl.push("GroupSelectPage");
  }

  antipanico(){
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
         if(canRequest) {
           this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
             (d) => {
               this.geolocation.getCurrentPosition().then((resp) => {
                 this.nativeStorage.getItem('identity').then(
                   request => {
                     var identity = request;
                     var infoUser = [];
                     this.nativeStorage.getItem('infoUser').then(
                       (info) => {
                         let gruposUsuario = info.find(x => x.idUser == identity._id).grupos;
                         let contactosAntipanico = gruposUsuario.find(x => x.nombre == "Antipánico").contactos;
                         if(contactosAntipanico.length != 0){
                           for(let c = 0; c < contactosAntipanico.length; c++){
                             this.sms.send(contactosAntipanico[c].telefono, 'Estoy en peligro. Entra al siguiente enlace para conocer mi ubicacion actual: http://ciudadmujer.fi.uncoma.edu.ar/antipanico/'+resp.coords.latitude+'/'+resp.coords.longitude);
                           }
                           let toast = this.toastCtrl.create({
                             message: "Los mensajes fueron enviados con éxito",
                             duration: 5000,
                             position: 'top'
                           });
                           toast.present();
                         }
                         else{
                           let toast = this.toastCtrl.create({
                             message: "No hay contactos en el grupo Antipánico.",
                             duration: 5000,
                             position: 'top'
                           });
                           toast.present();
                         }
                       });
                     },
                     error =>{
                       console.log("No encontró identidad")
                     })
              }).catch((error) => {
                this.data = error;
                console.log('Error getting location', error.message);
              });
             },
             error => {
               console.log('Error al pedir los permiso de ubicación.', error)
             }
           );
         }

       });
  }
}
