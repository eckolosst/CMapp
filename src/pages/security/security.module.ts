import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SMS } from '@ionic-native/sms';
import { SecurityPage } from './security';

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
    SMS
  ]
})
export class SecurityPageModule { }
