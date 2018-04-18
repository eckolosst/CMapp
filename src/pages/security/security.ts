import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { SimpleTimer } from 'ng2-simple-timer';
import { NativeStorage } from '@ionic-native/native-storage';
import { WelcomePage, Tab2Root } from '../pages';
import { UserService } from '../../providers/providers'
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SMS } from '@ionic-native/sms';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 Environment
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-security',
  templateUrl: 'security.html',
  providers: [SimpleTimer, UserService]
})
export class SecurityPage {
  map: GoogleMap;
  private latO;
  private lngO;
  private latD;
  private lngD;
  private mOrigen = null;
  private mDestino = null;
  private circle;
  private circle2;
  private activado = false;
  private timerId: string;
  private infoUsr;
  private contactos;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    private st: SimpleTimer,
    private st2: SimpleTimer,
    public toastCtrl: ToastController,
    public _userService: UserService,
    private locationAccuracy: LocationAccuracy,
    private alertCtrl: AlertController,
    private sms: SMS
  ) {}

  ionViewWillEnter(){
  this.contactos = this.navParams.get('numeros');
  console.log(this.navParams.get('numeros'))
   this.nativeStorage.getItem('identity')
     .then(
       data => {
         this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if(canRequest) {
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                (d) => {
                  this.infoUsr = data;
                  this.loadMap();
                },
                error => {
                  console.log('Error al pedir los permiso de ubicación.', error)
                }
              );
            }
          });
       },
       error => {
         this.navCtrl.push(WelcomePage)
       }
   );
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
        this.latD = response.latLng.lat + 0.005;
        this.lngD = response.latLng.lng + 0.005;

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
          // Setea propiedad que contiene el marcador de destino
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
            // Setea propiedad que contiene el marcador de origen e inicia timer de recalculo de posición
            this.mOrigen = marker;
            this.st.newTimer('timer', 5);
          	this.timerId = this.st.subscribe('timer', () => this.actualizaOrigen());
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
  console.log("Actualiza pos")
    // Obtiene ubicación actual
    this.map.getMyLocation({enableHighAccuracy: true})
    .then(response => {
      // Si cambió la ubicación, setea la posición del marcador de origen
      if( this.latO != response.latLng.lat || this.lngO != response.latLng.lng){
        this.latO = response.latLng.lat;
        this.lngO = response.latLng.lng;
        this.mOrigen.setPosition(response.latLng)
      }
    })
    .catch(error =>{
      console.log("Ubicación deshabilitada: " + error);
      // En caso de haberse desactivado la ubicación, solicita reactivarla
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
    // Calcular y setea en base de datos primer ubicación del seguimiento
    let id = this.infoUsr._id;
    var data = {
      seguimiento: [this.mOrigen.getPosition(),this.mDestino.getPosition()]
    };
    this._userService.updateSeguimiento(data,id).subscribe(
      response => {
        // Desactiva posibilidad de mover el marcador de destino.
        this.mDestino.setDraggable(false);

        // Desactiva timer para recalcular posición de origen
        this.st.delTimer('timer');

        // Activa timer para actualizar ubicación actual
        this.st2.newTimer('timer2', 5);
      	this.timerId = this.st2.subscribe('timer2', () => this.actualizarRuta());

        // Setea botón a mostrar
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


        // Envío de mensajes a grupo seleccionado para notificar sobre el seguimiento
        for(let i=0; i < this.contactos.length;i++){
          console.log("mando a "+this.contactos[i])
          this.sms.send(this.contactos[i], 'Ingresa en el siquiente link para ver mi recorrido: http://ciudadmujer.fi.uncoma.edu.ar/seguimiento/'+id);
        }

      },
      error => {}
    )
  }

  desactivar(){
    // Anula timer para actualizar la ubicación del recorrido
    this.st2.delTimer('timer2');

    // Crea timer para actualizar posición de origen
    this.st.newTimer('timer', 5);
    this.timerId = this.st.subscribe('timer', () => this.actualizaOrigen());

    // Retorna posibilidad de mover el marcador de destino
    this.mDestino.setDraggable(true);

    // Setea propiedad para el botón
    this.activado = false;

    // Elimina círculos de zona cercana
    this.circle.remove();
    this.circle2.remove()
  }

  actualizarRuta(){
    // Obtiene ubicación actual del dispositivo
    this.map.getMyLocation({enableHighAccuracy: true})
    .then(response => {
      // Setea posiciones de marcador
      this.mOrigen.setPosition(response.latLng);
      this.latO = response.latLng.lat;
      this.lngO = response.latLng.lng;

      // Obtiene id del usuario logueado
      let id = this.infoUsr._id;

      // Actualiza en la base la ubicación actual.
      var data = { seguimiento: [this.mOrigen.getPosition(),this.mDestino.getPosition()] };
      this._userService.updateSeguimiento(data,id).subscribe(
        response => {
          console.log("Actualizacion realizada")

          // Calcula distancia al destino y verifica que haya alcanzado la zona circular
          let d = this.mDestino.getPosition();
          let o = this.mOrigen.getPosition();
          let distancia = Math.sqrt(Math.pow(d.lat - o.lat,2)+ Math.pow(d.lng - d.lng,2))
          console.log("Distancia: ",distancia)
          if(distancia < 0.0005){

            // Desactiva seguimiento
            this.desactivar();

            // Notificación de llegada
            let toast = this.toastCtrl.create({
              message: 'Has llegado a tu destino (:',
              duration: 2000
            });
            toast.present();
          }
        },
        error => {}
      )
    })
    .catch(error =>{
      console.log("Ubicación deshabilitada: " + error);
      // En caso de haberse desactivado la ubicación, solicita reactivarla
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

  ionViewWillLeave(){
      console.log("Entró a WillLeave")
      if(this.activado)
        this.st2.delTimer('timer2')
      else
        this.st.delTimer('timer')
      this.navCtrl.setRoot(Tab2Root);
  }

  ionViewCanLeave(){
    console.log("Entró a CanLeave")
    if(this.activado){
      return new Promise((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: '¿Realmente desea salir?',
          message: 'Si sale se desactivará el seguimiento. Puedes minimizar la aplicación y este continuará.',
          buttons: [
            {
              text: 'Si',
              handler: () => {
                alert.dismiss().then(() => resolve());

                return false;
              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                reject();
              }
            }
          ]
        });

        alert.present();
      });
    }
    else{
      return true
    }
  }

}
