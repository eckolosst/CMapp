import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';


@IonicPage()
@Component({
  selector: 'page-ciudad-mujer',
  templateUrl: 'ciudad-mujer.html',
})
export class CiudadMujerPage {

  listaContactos:any[]=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private contacts:Contacts) {

      this.cargarListaContactos();
  }

  /**
 * Funcion encargada de cargar la lista de contactos del celular, en mi caso filtrare y mostrare solo
 * los objetos que tienen valor en los campos dislplayName, photos, phoneNumbers. Con estos cargare
 * la lista a mostrar.
 */
cargarListaContactos(){
  this.contacts.find(["*"])
  .then(res => {
    let datosMostar:any[]=[];
    res.map((item) =>{
      if(item.displayName != null  && item.phoneNumbers != null){
        datosMostar.push({displayName:item.displayName,phoneNumbers:item.phoneNumbers})
      }
    })
    this.listaContactos = datosMostar;
  },error => {
    console.log({error:error})
  })
}

}
