import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LlamanosPage } from './llamanos';
import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [
    LlamanosPage,
  ],
  imports: [
    IonicPageModule.forChild(LlamanosPage),
    TranslateModule.forChild()
  ],
  providers:[
    CallNumber
  ]
})
export class LlamanosPageModule {}
