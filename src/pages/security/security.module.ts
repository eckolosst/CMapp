import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SecurityPage } from './security';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@NgModule({
  declarations: [
    SecurityPage,
  ],
  imports: [
    IonicPageModule.forChild(SecurityPage),
    TranslateModule.forChild()
  ],
  exports: [
    SecurityPage
  ],
  providers: [
    GoogleMaps,
    LocationAccuracy,
    SMS
  ]
})
export class SecurityPageModule { }
