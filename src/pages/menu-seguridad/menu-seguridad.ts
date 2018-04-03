import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController} from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SMS } from '@ionic-native/sms';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserService } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-menu-seguridad',
  templateUrl: 'menu-seguridad.html',
})
export class MenuSeguridadPage {

  private data =[] //Borrar

  constructor(
    public navCtrl: NavController,
    private locationAccuracy: LocationAccuracy,
    public toastCtrl: ToastController,
    private sms: SMS,
    private nativeStorage: NativeStorage,
    private _userService: UserService
  ) { }

  goGrupos(){
    this.navCtrl.push("GrupoPage");
  }

  goSecurity(){
    this.navCtrl.push("SecurityPage");
  }

  antipanico(){
    console.log("activo antipanico")
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
       if(canRequest) {
         this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
           (d) => {
            this.nativeStorage.getItem('identity').then(
               request => {
                   var identity = request;
                   var infoUser = [];
                   this.nativeStorage.getItem('infoUser').then(
                     (info) => {
                       let gruposUsuario = info.find(x => x.idUser == identity._id).grupos;
                       let contactosAntipanico = gruposUsuario.find(x => x.nombre == "Antipánico").contactos;
                       if(contactosAntipanico.length != 0){
                         console.log("entro2")
                         for(let c of contactosAntipanico){
                           this.sms.send(c.telefono, 'AYUDA!! https://www.google.com/maps/@-38.9401448,-68.0547334,20z');
                         }
                       }
                       else{
                         let toast = this.toastCtrl.create({
                           message: "No hay contactos en el grupo Antipánico.",
                           duration: 10000,
                           position: 'top'
                         });
                         toast.present();
                       }
                     });
               },
               error =>{
                 console.log("No encontró identidad")
               }
             )
           },
           error => {
             console.log('Error al pedir los permiso de ubicación.', error)
           }
         );
       }

     });


  }
}
