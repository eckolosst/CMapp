import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactUsPage } from './contact-us';
import { LongPressModule } from 'ionic-long-press';
//Documentacion de LongPressModule https://www.npmjs.com/package/ionic-long-press
import { Base64 } from '@ionic-native/base64';


@NgModule({
  declarations: [
    ContactUsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactUsPage),
    TranslateModule.forChild(),
    LongPressModule
  ],
  providers: [
    Base64
  ]
})
export class ContactUsPageModule {}
