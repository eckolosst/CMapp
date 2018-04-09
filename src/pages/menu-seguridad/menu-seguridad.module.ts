import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MenuSeguridadPage } from './menu-seguridad';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SMS } from '@ionic-native/sms';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MenuSeguridadPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuSeguridadPage),
    TranslateModule.forChild()
  ],
  providers: [
    SMS,
    LocationAccuracy,
    Geolocation
  ]
})
export class MenuSeguridadPageModule {}
