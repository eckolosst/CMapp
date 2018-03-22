import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GrupoPage } from './grupo';
import { Contacts } from '@ionic-native/contacts';


@NgModule({
  declarations: [
    GrupoPage,
  ],
  imports: [
    IonicPageModule.forChild(GrupoPage),
    TranslateModule.forChild()
  ],
  providers:[
    Contacts
  ]
})
export class GrupoPageModule {}
