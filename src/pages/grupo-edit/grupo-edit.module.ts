import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrupoEditPage } from './grupo-edit';
import { Contacts } from '@ionic-native/contacts';
import { AndroidPermissions } from '@ionic-native/android-permissions';


@NgModule({
  declarations: [
    GrupoEditPage,
  ],
  imports: [
    IonicPageModule.forChild(GrupoEditPage),
  ],
  providers:[
    Contacts,
    AndroidPermissions
  ]
})
export class GrupoEditPageModule {}
