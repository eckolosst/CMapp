import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import { SecurityPage } from './security';
import { GoogleMaps } from '@ionic-native/google-maps';
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
    SMS,
    LocationAccuracy,
    GoogleMaps
  ]
})
export class SecurityPageModule { }
