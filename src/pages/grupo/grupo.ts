import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-grupo',
  templateUrl: 'grupo.html',
})
export class GrupoPage {
  private grupos: Array<any> = [];
  private indiceGrupos: number;
  private infoUser;
  private idUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController) {}

  ionViewWillEnter(){
    /*Recupero el grupo de contactos del usuario logueado*/
    this.nativeStorage.getItem('identity').then(
      (idUser) => {
        this.idUser = idUser._id;
        this.nativeStorage.getItem('infoUser').then(
          (infoUser) => {
            this.infoUser = infoUser;
            this.indiceGrupos = infoUser.findIndex(x => x.idUser == idUser._id);
            this.grupos = this.infoUser[this.indiceGrupos].grupos;
          }
        );
    });
  }

  private showPrompt() {
   let prompt = this.alertCtrl.create({
     title: 'Nuevo Grupo',
     message: "Ingrese el nombre del nuevo grupo",
     inputs: [
       {
         name: 'nombre',
         placeholder: 'Nombre'
       },
     ],
     buttons: [
       {
         text: 'Cancelar',
         handler: data => {console.log('Cancel clicked');}
       },
       {
         text: 'Guardar',
         handler: data => {this.addGroup(data.nombre);}
       }
     ]
   });
   prompt.present();
 }

  private addGroup(nombre: string){
    //Si ya existe un grupo con el mismo nombre no agregar
    this.grupos.push({"nombre":nombre,"contactos":[]})
    this.nativeStorage.setItem('infoUser', this.infoUser);
  }

  private removeGroup(){

  }

  private goGrupoEdit(nombre: string){
    this.navCtrl.push("GrupoEditPage",{indice:this.indiceGrupos,idUser:this.idUser,nombreGrupo:nombre});
  }
}
