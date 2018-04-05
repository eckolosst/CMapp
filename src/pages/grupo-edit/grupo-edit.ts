import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Contact, Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';
import { NativeStorage } from '@ionic-native/native-storage';


@IonicPage()
@Component({
  selector: 'page-grupo-edit',
  templateUrl: 'grupo-edit.html',
})
export class GrupoEditPage {

  //En esta variable se guardan los contactos recuperados el movil
  private contacsList: Array<any> = [];
  /*Es el grupo de contactos que se muestra en la vista.*/
  private grupo: Array<any> = [];
  /*Los datos a continuacion se reciben como parametros de la vista anterior para
  facilitar las busquedas en el storage, los mismos se recuperan en el cosntructor*/
  private indiceUser: number;
  private nombreGrupo: string;
  private indiceGroup: number;
  private infoUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public contacts: Contacts,
    private alertCtrl: AlertController,
    private nativeStorage: NativeStorage,
    public toastCtrl: ToastController) {
      this.indiceUser = this.navParams.get('indiceU');
      this.nombreGrupo = this.navParams.get('nombreGrupo');
      this.indiceGroup = this.navParams.get('indiceG');
      this.nativeStorage.getItem('infoUser').then(
        (infoUser) => {
          this.infoUser = infoUser;
          this.grupo = this.infoUser[this.indiceUser].grupos[this.indiceGroup].contactos;
        });
    }

  private searchContacts(ev:any){
    let fields: ContactFieldType[] = ['displayName','phoneNumbers'];
    const options = new ContactFindOptions();
    options.filter = ev.target.value;
    options.multiple = true;
    options.hasPhoneNumber = true;
    this.contacts.find(fields, options).then(
      (contactsFinded) => {
        this.contacsList = contactsFinded;
        if(this.contacsList.length == 0){
          this.contacsList.push({displayName:'No hay conincidencias'});
        }
      },
      (error) => {
        let toast = this.toastCtrl.create({
          message: 'Error al recuperar contactos del telefono!Concedió los permisos necesarios?',
          duration: 2000
        });
        toast.present();
      });
  }

  private addContact(item:Contact){
    /*Se agregan contactos al grupo que se muestra en la vista. Los cambios se
    guardan al salir de la vista o al presionar el boton de guardar*/
    if(this.grupo.find(x => x.nombre == item.displayName)){
      let prompt = this.alertCtrl.create({
        title: "El usuario que intena agregar ya exise en el grupo",
        buttons: ['OK']
      })
      prompt.present();
    }else{
      this.grupo.push({nombre:item.displayName,telefono:item.phoneNumbers[0].value});
    }
  }

  private exitingPrompt() {
    /*Ventana emergente que se muestra al salir de la vista*/
   let prompt = this.alertCtrl.create({
     title: '¿Desea guardar los cambios?',
     buttons: [
       {
         text: 'NO',
         handler: () => {}
       },
       {
         text: 'Si',
         handler: () => {
           this.guardar();
         }
       }
     ]
   });
   prompt.present();
 }

 private removeContact(i:number) {
   this.grupo.splice(i,1);
}

  ionViewCanLeave(){
    this.exitingPrompt();
  }

  private guardar(){
    this.nativeStorage.setItem('infoUser', this.infoUser);
    let toast = this.toastCtrl.create({
      message: 'Grupo actualizado',
      duration: 2000
    });
    toast.present();
  }

}
