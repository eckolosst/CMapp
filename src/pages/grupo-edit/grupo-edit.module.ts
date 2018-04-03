import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrupoEditPage } from './grupo-edit';
import { Contacts } from '@ionic-native/contacts';

@NgModule({
  declarations: [
    GrupoEditPage,
  ],
  imports: [
    IonicPageModule.forChild(GrupoEditPage),
  ],
  providers:[
    Contacts
  ]
})
export class GrupoEditPageModule {}
