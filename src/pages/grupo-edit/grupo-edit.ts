import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Contact, Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';

@IonicPage()
@Component({
  selector: 'page-grupo-edit',
  templateUrl: 'grupo-edit.html',
})
export class GrupoEditPage {

  private contacsList: Array<any> = [];
  private grupo: Array<any> = [];
  private indiceGrupos: number;
  private nombreGrupo: string;
  private idUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public contacts: Contacts,
    private alertCtrl: AlertController) {
    this.idUser = this.navParams.get('idUser');
    this.indiceGrupos = this.navParams.get('indice');
    this.nombreGrupo = this.navParams.get('nombreGrupo');
  }

  ionViewDidLoad() {
    console.log(this.idUser +" "+ this.indiceGrupos);
  }

  private searchContacts(ev:any){
    let fields: ContactFieldType[] = ['displayName','phoneNumbers'];
    const options = new ContactFindOptions();
    options.filter = ev.target.value;
    options.multiple = true;
    options.hasPhoneNumber = true;
    this.contacts.find(fields, options).then((contactsFinded) => {
      this.contacsList = contactsFinded;
      console.log(contactsFinded);
      if(this.contacsList.length == 0){
        this.contacsList.push({displayName:'No hay conincidencias'});
      }
    });
  }

  private addContact(item:Contact){
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
}
