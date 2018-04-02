import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Contact, Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';

@IonicPage()
@Component({
  selector: 'page-grupo',
  templateUrl: 'grupo.html',
})
export class GrupoPage {
  private contacsList: Array<any> = [];
  private grupos: Array<any> = [];
  private grupo: Array<Contact> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private contacts: Contacts,
    private nativeStorage: NativeStorage) {
      this.recuperarGrupos();
    }

  recuperarGrupos(){
    this.nativeStorage.getItem('identity').then(
      (idUser) => {
        this.nativeStorage.getItem('infoUser').then(
          (infoUser) => {
            this.grupos = infoUser.find(x => x.idUser == idUser._id).grupos;
          });
    });
  }

  searchContacts(ev:any){
    let fields: ContactFieldType[] = ['displayName'];

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
    this.grupo.push(item);
  }

}
