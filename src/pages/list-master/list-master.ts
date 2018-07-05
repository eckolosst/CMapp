import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Seccion } from '../../models/seccion';
import { Section } from '../../providers/cm-api/section'


@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html',
  providers: [Section]
})
export class ListMasterPage{
  secciones: Seccion[];
  slides: String[];
  public identity;

  constructor(
    public navCtrl: NavController,
    private _service : Section,
    private nativeStorage: NativeStorage,
    public toastCtrl: ToastController
   ) {
     this.nativeStorage.getItem('fecha_mod').then(
       data => {
         this.buscarSecciones(data)
       },
       error => {
        /*
        * Primera vez que se inicia la app, no existe la fecha.
        * Se envía una "web" para que si o si retorne las secciones
        */
         console.log("Error al buscar fecha_mod")
         this.buscarSecciones("web") //new Date(1990,1,1).toString()
       }
     );

    this.slides = [
      "assets/img/s2.png",
      "assets/img/s3.png",
      "assets/img/s1.png"
    ]
  }

  buscarSecciones(data){
    this._service.getListaSecciones(data).subscribe(
        result =>{
          // Si retorna [] es que no existían cambios, evita gasto de datos.
          if(result.secciones.length != 0){
            console.log("Entro a actualizar")
            this.secciones = result.secciones;
            this.nativeStorage.setItem('secciones', this.secciones).then(
              () => {
                this.nativeStorage.setItem('fecha_mod', new Date().toString()).then(
                  () => {
                    let toast = this.toastCtrl.create({
                      message: "Secciones actualizadas con éxito.",
                      duration: 3000
                    });
                    toast.present();
                  },
                  error => {console.log('Error al guardar datos de la aplicación.')}
                );
              },
              error => {console.log('Error al guardar datos de la aplicación.')}
            );
          }
          //Entra a buscar porque no habia cambios
          else{
            this.getAlmacenadas();
          }
        },
        error =>{
          console.log("Error en la carga");
          this.getAlmacenadas()
        }
    );
  }

  getAlmacenadas(){
    this.nativeStorage.getItem('secciones').then(
      data => {this.secciones = data; },
      error => {this.secciones = null;}
    );
  }

  ionViewWillEnter(){
    this.nativeStorage.getItem('identity')
      .then(
        data => {this.identity = data != undefined; },
        error => {this.identity = false;}
    );
  }

  openItem(seccion: Seccion) {
    this.navCtrl.push('ItemDetailPage', {seccion: seccion});
  }

  goLogReg() {
    this.navCtrl.push('WelcomePage');
  }

  goHelp(){
    this.navCtrl.push("Help");
  }
}
