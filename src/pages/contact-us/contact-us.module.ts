import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactUsPage } from './contact-us';
import { LongPressModule } from 'ionic-long-press';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
//Documentacion de LongPressModule https://www.npmjs.com/package/ionic-long-press
import { Base64 } from '@ionic-native/base64';
import { AndroidPermissions } from '@ionic-native/android-permissions';


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
    Base64,
    Camera,
    Media,
    File,
    AndroidPermissions
  ]
})
export class ContactUsPageModule {}
