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
  public mOrigen = null;
  public mDestino = null;
  public circle;
  public circle2;
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
        //  this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        //     if(canRequest) {
        //       this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        //         (d) => {
                  this.identity = true;
                  this.infoUsr = data;
                  this.loadMap();
            //     },
            //     error => {
            //       console.log('Error al pedir los permiso de ubicación.', error)
            //     }
            //   );
            // }
          //
          // });

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

    // Genera mapa
    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Setea el color de fondo
    Environment.setBackgroundColor('#303030');

    // Espera que el mapa este listo para ejecutar el evento de inicialización
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      // Método de inicialización (obtiene Localización y crea los marcadores de origen y destino)
      this.getPosition();
    })
    .catch(error =>{
      console.log(error);
    });

  }

  getPosition(): void{

    this.map.getMyLocation({enableHighAccuracy: true}).then(
    response => {

        // Localización actual
        this.latO = response.latLng.lat;
        this.lngO = response.latLng.lng;
        this.latD = response.latLng.lat + 0.007;
        this.lngD = response.latLng.lng + 0.007;

        // Agrega marcador de Destino
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
          marker => this.mDestino = marker
        );

        // Agrega marcador de Origen
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
          draggable: false
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

        // Centra la camara
        this.map.moveCamera({
          target: {
            lat: (this.latO + this.latD)/2,
            lng: (this.lngO + this.lngD)/2
          }
        });

    },
    error => {}
    );
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
    this._userService.updateSeguimiento(data,id).subscribe(
      response => {
        this.mDestino.setDraggable(false);
        this.st.delTimer('timer');
        this.st2.newTimer('timer2', 10);
      	this.timerId = this.st2.subscribe('timer2', () => this.actualizarRuta());
        this.activado = true;
        // Agrega circulo a destino
        this.map.addCircle({
          'center': this.mDestino.getPosition(),
          'radius': 50,
          'strokeColor' : '#2cbfcb',
          'strokeWidth': 2,
          'fillColor' : '#2cbfcb'
        }).then(
          circle => {
            this.circle = circle;
          }
        );
        // Agrega circulo a origen
        this.map.addCircle({
          'center': this.mOrigen.getPosition(),
          'radius': 50,
          'strokeColor' : '#2cbfcb',
          'strokeWidth': 2,
          'fillColor' : '#2cbfcb'
        }).then(
          circle => {
            this.circle2 = circle;
          }
        );
        // this.sms.send('2996731809', 'Ingresa a http://localhost:4200/seguimiento/59f352f8fc602b16bde14c85');
        // this.sms.send('2996731809', 'Ingresa a http://ciudadmujer.fi.uncoma.edu.ar');
        // this.sms.send('2996736141', 'Ingresa a http://ciudadmujer.fi.uncoma.edu.ar');
      },
      error => {
        this.data = error
      }
    )
  }

  desactivar(){
    this.st.delTimer('timer2');
    this.st.newTimer('timer', 5);
    this.timerId = this.st.subscribe('timer', () => this.actualizaOrigen());
    this.mDestino.setDraggable(true);
    this.activado = false;
    this.circle.remove();
    this.circle2.remove()
  }

  actualizarRuta(){
    this.map.getMyLocation({enableHighAccuracy: true})
    .then(response => {
      this.mOrigen.setPosition(response.latLng);
      this.latO = response.latLng.lat;
      this.lngO = response.latLng.lng;

      let id = this.infoUsr._id;
      var data = {
        seguimiento: [this.mOrigen.getPosition(),this.mDestino.getPosition()]
      };
      this._userService.updateSeguimiento(data,id).subscribe(
        response => {
          console.log("Actualizacion realizada")
          let d = this.mDestino.getPosition();
          let o = this.mOrigen.getPosition();
          let distancia = Math.sqrt(Math.pow(d.lat - o.lat,2)+ Math.pow(d.lng - d.lng,2))
          console.log("Distancia: ",distancia)
          if(distancia < 0.0005){
            this.desactivar();
            let toast = this.toastCtrl.create({
              message: 'Has llegado a tu destino (:',
              duration: 2000
            });
            toast.present();
          }
        },
        error => {
          this.data = error
        }
      )
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
