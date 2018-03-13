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
 Environment
 // CameraPosition,
 // MarkerOptions,
 // Marker,
 // Polyline,
 // PolylineOptions
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
   this.data = ""
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
        zoom: 13,
        tilt: 0 // inclinacion
      },
    };
// GoogleMaps.create('canvas', mapOptions);
    this.map = GoogleMaps.create('map_canvas', mapOptions);
    Environment.setBackgroundColor('#303030');
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
      // Localización actual
      this.latO = response.latLng.lat;
      this.lngO = response.latLng.lng;
      this.latD = response.latLng.lat + 0.007;
      this.lngD = response.latLng.lng + 0.007;
      this.map.addMarker({
        title: 'Destino',
        icon: {
          'url': 'assets/img/destino.png',
          'size': {
            width: 27,
            height: 42}
        },
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
        icon: {
          'url': 'assets/img/origen.png',
          'size': {
            width: 27,
            height: 42}
        },
        animation: 'DROP',
        position: response.latLng,
        draggable: true
      }).then(
        marker => {
          this.mOrigen = marker;
          this.st.newTimer('timer', 5);
        	this.timerId = this.st.subscribe('timer', () => this.actualizaOrigen());

          marker.one(GoogleMapsEvent.MARKER_DRAG)
          .then(() => {
            // Now you can use all methods safely.
            this.getPosition();
          })
          .catch(error =>{
            console.log(error);
          });
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

        this.mOrigen.setPosition(response.latLng)
      }
    })
    .catch(error =>{
      console.log("Ubicación deshabilitada: " + error);
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
         if(canRequest) {
           this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
             (d) => {},
             error => console.log('Error al pedir los permiso de ubicación.', error)
           );
         }
       });
    });
  }

  activar(){
    let id = this.infoUsr._id;
    var data = {
      seguimiento: [this.mOrigen.getPosition(),this.mDestino.getPosition()]
    };
    // this._userService.updateSeguimiento(data,id).subscribe(
    //   response => {
        this.mDestino.setDraggable(false);
        this.mOrigen.setDraggable(false);
        this.st.delTimer('timer');
        this.st2.newTimer('timer2', 10);
      	this.timerId = this.st2.subscribe('timer2', () => this.actualizarRuta());
        this.activado = true;

        // DIBUJA LINEA RECTA DESDE EL ORIGEN HASTA EL DESTINO
        // this.map.addPolyline({
        //   points: [
        //     this.mOrigen.getPosition(),
        //     this.mDestino.getPosition()
        //   ],
        //   'color' : 'black',
        //   'width': 2,
        //   'geodesic': true
        // });

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

  actualizarRuta(){
    this.map.getMyLocation({enableHighAccuracy: true})
    .then(response => {
      this.mOrigen.setPosition(response.latLng);
      console.log(this.latO, this.lngO)
      this.latO = response.latLng.lat;
      this.lngO = response.latLng.lng;
      console.log(this.latO, this.lngO)
      // var last = this.camino.length -1;
      // if(last < 0 || (this.camino[last].getPosition.lat != response.latLng.lat && this.camino[last].getPosition.lng != response.latLng.lng)){
      //   this.map.addMarker({
      //     title: '',
      //     icon: 'red',
      //     animation: 'DROP',
      //     position: {
      //       lat: response.latLng.lat,
      //       lng: response.latLng.lng
      //     }
      //   }).then(
      //     marker => {
      //       marker.label = (this.camino.length + 1).toString();
      //       marker.draggable = false;
      //       marker.hora = Date.now()
      //       this.camino.push(marker);
      //     }
      //   );
      // }
    })
    .catch(error =>{
      console.log("Ubicación deshabilitada: " + error);
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
         if(canRequest) {
           this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
             (d) => {},
             error => console.log('Error al pedir los permiso de ubicación.', error)
           );
         }
       });
    });
  }
}
