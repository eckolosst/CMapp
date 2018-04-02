import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';

@IonicPage()
@Component({
  selector: 'page-grupo',
  templateUrl: 'grupo.html',
})
export class GrupoPage {
  private contacsList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private contacts: Contacts
  ) {  }

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








}
