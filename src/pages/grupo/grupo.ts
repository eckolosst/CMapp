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
  private indiceUser: number;
  private infoUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController) {}

  ionViewWillEnter(){
    /*Recupero el grupo de contactos del usuario logueado*/
    this.nativeStorage.getItem('identity').then(
      (idUser) => {
        this.nativeStorage.getItem('infoUser').then(
          (infoUser) => {
            this.infoUser = infoUser;
            this.indiceUser = infoUser.findIndex(x => x.idUser == idUser._id);
            this.grupos = this.infoUser[this.indiceUser].grupos;
          });
    });
  }

  private newGroupPrompt() {
    /*Ventana emergente con miniform para solicitar datos al crear un grupo*/
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
         handler: data => {}
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
    if(this.grupos.find(x => x.nombre == nombre)){
      let prompt = this.alertCtrl.create({
        title: "No puede existir dos grupos con el mismo nombre",
        buttons: ['OK']
      })
      prompt.present();
    }else{
      this.grupos.push({"nombre":nombre,"contactos":[]})
      this.nativeStorage.setItem('infoUser', this.infoUser);
    }
  }

  private removeGroupPrompt(i:number) {
    /*Ventana emergente para confirmar la eliminacion de un grupo*/
    let prompt = this.alertCtrl.create({
      title: '¿Seguro que desea eliminar el grupo?',
      buttons: [
        {
          text: 'NO',
          handler: () => {}
        },
        {
          text: 'Si',
          handler: () => {
            this.removeGroup(i);
          }
        }
      ]
    });
    prompt.present();
  }
  private removeGroup(i:number){
    this.infoUser[this.indiceUser].grupos.splice(i,1);
    this.nativeStorage.setItem('infoUser',this.infoUser);
  }

  private goGrupoEdit(nombre: string, i: number){
    /*Se ejecuta cada vez que se pincha en un grupo. Se envian por parametro algunos
    datos para facilitar la busqueda del grupo en la vista del grupo seleccionado*/
    this.navCtrl.push("GrupoEditPage",{indiceU:this.indiceUser, indiceG:i, nombreGrupo:nombre});
  }
}
