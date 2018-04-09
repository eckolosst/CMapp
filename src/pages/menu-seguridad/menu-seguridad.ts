import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController} from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SMS } from '@ionic-native/sms';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserService } from '../../providers/providers';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-menu-seguridad',
  templateUrl: 'menu-seguridad.html',
})
export class MenuSeguridadPage {

  private logueado: boolean = false;
  private map;

  constructor(
    public navCtrl: NavController,
    private locationAccuracy: LocationAccuracy,
    public toastCtrl: ToastController,
    private sms: SMS,
    private nativeStorage: NativeStorage,
    private _userService: UserService
  ) {
    // this.map = GoogleMaps.create('map_canvas');
    //
    // // Probando exactitud, se puede eliminar
    // this.map.one(GoogleMapsEvent.MAP_READY)
    // .then(() => {
    //   console.log("Creo mapa")
    //   this.map.getMyLocation({enableHighAccuracy: true}).then()
    // })

  }

  ionViewWillEnter(){
    this.nativeStorage.getItem('identity').then(
      () => {this.logueado = true;},
      (error) => {
        this.logueado = false;
        this.navCtrl.push("WelcomePage")
      });
  }

  goGrupos(){
    this.navCtrl.push("GrupoPage");
  }

  goSecurity(){
    this.navCtrl.push("GroupSelectPage");
  }

  antipanico(){

    this.map = GoogleMaps.create('map_canvas');
    console.log(this.map)
    // Evento que se ejecuta una vez que el mapa se cargó correctamente.
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
         if(canRequest) {
           this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
             (d) => {
               this.map.getMyLocation({enableHighAccuracy: true}).then(
                 pos => {
                   console.log(pos)
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
                                  // console.log('localhost:4200/antipanico/'+pos.latLng.lat+'/'+pos.latLng.lng)

                                  // this.sms.send(contactosAntipanico[c].telefono, 'Estoy en problemas. Ingresa en el siquiente link para ver mi ubicacion: https://www.google.com/maps/@'+pos.latLng.lat+','+pos.latLng.lng+',20z');
                                  this.sms.send(contactosAntipanico[c].telefono, 'Estoy en problemas. Ingresa en el siquiente link para ver mi ubicacion: https://ciudadmujer.fi.uncoma.edu.ar/antipanico/'+pos.latLng.lat+'/'+pos.latLng.lng);
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
                      }
                    )
                 },
                 err => {
                   console.log("Error al obtener la posición.")
                 }
               )
             },
             error => {
               console.log('Error al pedir los permiso de ubicación.', error)
             }
           );
         }

       });

    })
  }
}
