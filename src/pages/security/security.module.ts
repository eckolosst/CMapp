import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

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
  ]
})
export class SecurityPageModule { }
