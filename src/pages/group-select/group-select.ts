import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-group-select',
  templateUrl: 'group-select.html',
})
export class GroupSelectPage {
  private grupos: Array<any>;
  private indiceUser: number;
  private infoUser;
  private listIndexs: Array<number>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeStorage: NativeStorage,
    private alertCtrl: AlertController) {
      this.grupos = [];
      this.listIndexs = [];
    }

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

  updateListIndexs(index: number){
    let i = this.listIndexs.findIndex(x => x==index);
    if(i == -1){
      this.listIndexs.push(index);
    }else{
      this.listIndexs.splice(i,1);
    }
  }

  goSeguimiento(){
    if(this.listIndexs.length > 0){
      let numeros: Array<number> = [];
      let contactos, num;
      for(let i of this.listIndexs){
        contactos = this.grupos[i].contactos;
        for(let cto of contactos){
          num = cto.telefono;
          if((numeros.findIndex(x => x == num)) == -1) {
            numeros.push(num);
          }
        }
      }
      this.navCtrl.push("SecurityPage",{numeros: numeros})
    }else{
      let prompt = this.alertCtrl.create({
        title:'Seleccione uno o mas grupos',
        buttons:[
          {
            text:'OK',
            handler: ()=>{}
          }
        ]
      });
      prompt.present();
    }
  }

}
