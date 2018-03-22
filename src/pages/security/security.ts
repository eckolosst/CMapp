import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { SimpleTimer } from 'ng2-simple-timer';
import { NativeStorage } from '@ionic-native/native-storage';
import { WelcomePage } from '../pages';
import { UserService } from '../../providers/providers'
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SMS } from '@ionic-native/sms';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-security',
  templateUrl: 'security.html',
  providers: [SimpleTimer, UserService]
})
export class SecurityPage {
  map: GoogleMap;
  public latO;
  public lngO;
  public latD;
  public lngD;
  public data;
  public mOrigen;
  public mDestino;
  public camino = [];
  public activado = false;
  public timerId: string;
  public identity;
  public infoUsr;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    private st: SimpleTimer,
    private st2: SimpleTimer,
    public toastCtrl: ToastController,
    public _userService: UserService,
    private locationAccuracy: LocationAccuracy,
    private sms: SMS
  ) {}

  ionViewWillEnter(){
   this.nativeStorage.getItem('identity')
     .then(
       data => {
         this.locationAccuracy.canRequest().then((canRequest: boolean) => {

            if(canRequest) {
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                (d) => {
                  this.identity = true;
                  this.infoUsr = data;
                  this.loadMap();
                },
                error => console.log('Error al pedir los permiso de ubicación.', error)
              );
            }

          });

       },
       error => {
         this.identity = false;
         this.navCtrl.push(WelcomePage)
       }
   );
   return this.identity
  }

  loadMap(){

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: -38.9516100,
          lng: -68.0591000
        },
        zoom: 12,
        tilt: 0 // inclinacion
      },
    };
// GoogleMaps.create('canvas', mapOptions);
    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      // Now you can use all methods safely.
      this.getPosition();
    })
    .catch(error =>{
      console.log(error);
    });

  }

  getPosition(): void{
    this.map.getMyLocation({enableHighAccuracy: true})
    .then(response => {
      // Localocación actual
      this.latO = response.latLng.lat;
      this.lngO = response.latLng.lng;
      this.latD = response.latLng.lat + 0.007;
      this.lngD = response.latLng.lng + 0.007;
      this.map.addMarker({
        title: 'Destino',
        icon: 'blue',
        animation: 'DROP',
        position: {
          lat: this.latD,
          lng: this.lngD
        },
        draggable: true
      }).then(
        marker => {
          this.mDestino = marker;
        }
      );
      this.map.addMarker({
        title: 'Origen',
        icon: 'green',
        animation: 'DROP',
        position: response.latLng,
        draggable: true
      }).then(
        marker => {
          this.mOrigen = marker;
          this.st.newTimer('timer', 5);
        	this.timerId = this.st.subscribe('timer', () => this.actualizaOrigen());
        }
      );
      this.map.moveCamera({
        target: {
          lat: (this.latO + this.latD)/2,
          lng: (this.lngO + this.lngD)/2
        }
      });
    })
    .catch(error =>{
      console.log("Ubicación deshabilitada: " + error);
    });
  }

  actualizaOrigen(){
    this.map.getMyLocation({enableHighAccuracy: true})
    .then(response => {
      if( this.latO != response.latLng.lat || this.lngO != response.latLng.lng){
        this.latO = response.latLng.lat;
        this.lngO = response.latLng.lng;
        this.map.moveCamera({
          target: {
            lat: (this.latO + this.latD)/2,
            lng: (this.lngO + this.lngD)/2
          }
        });
        this.mOrigen.setPosition(response.latLng)
      }
    })
    .catch(error =>{
      console.log("Ubicación deshabilitada: " + error);
    });
  }

  activar(){
    var data = {
      origenLat: this.mOrigen.getPosition().lat,
      origenLng: this.mOrigen.getPosition().lng,
      destinoLat: this.mDestino.getPosition().lat,
      destinoLng: this.mDestino.getPosition().lng,
      camino: this.camino
    }

    // this._userService.updateSeguimiento(data,this.infoUsr._id).subscribe(
    //   response => {
        this.mDestino.setDraggable(false);
        this.mOrigen.setDraggable(false);
        this.st.delTimer('timer');
        this.st2.newTimer('timer2', 10);
      	this.timerId = this.st2.subscribe('timer2', () => this.agregarRuta());
        this.activado = true;
    //   },
    //   error => {
    //     this.data = error
    //   }
    // )
    this.sms.send('','');//Primero numero y despues el msj
  }

  desactivar(){
    this.st.delTimer('timer2');
    this.st.newTimer('timer', 5);
    this.timerId = this.st.subscribe('timer', () => this.actualizaOrigen());
    this.mDestino.setDraggable(true);
    this.mOrigen.setDraggable(true);
    this.activado = false;
  }

  agregarRuta(){
    this.map.getMyLocation({enableHighAccuracy: true})
    .then(response => {
      var last = this.camino.length -1;
      if(last < 0 || (this.camino[last].getPosition.lat != response.latLng.lat && this.camino[last].getPosition.lng != response.latLng.lng)){
        this.map.addMarker({
          title: '',
          icon: 'red',
          animation: 'DROP',
          position: {
            lat: response.latLng.lat,
            lng: response.latLng.lng
          }
        }).then(
          marker => {
            marker.label = (this.camino.length + 1).toString();
            marker.draggable = false;
            marker.hora = Date.now()
            this.camino.push(marker);
            // var data = {
            //   origenLat: this.mOrigen.getPosition().lat,
            //   origenLng: this.mOrigen.getPosition().lng,
            //   destinoLat: this.mDestino.getPosition().lat,
            //   destinoLng: this.mDestino.getPosition().lng,
            //   camino: this.camino
            // }
            // this._userService.updateSeguimiento(data,this.infoUsr._id).subscribe(
            //   response => {
            //     console.log("Todo OK")
            //   },
            //   error => {
            //     console.error(error)
            //   }
            // )
          }
        );;
      }
    })
    .catch(error =>{
      console.log("Ubicación deshabilitada: " + error);
    });
  }
}
