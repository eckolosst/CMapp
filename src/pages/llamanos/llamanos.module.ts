import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LlamanosPage } from './llamanos';

@NgModule({
  declarations: [
    LlamanosPage,
  ],
  imports: [
    IonicPageModule.forChild(LlamanosPage),
    TranslateModule.forChild()
  ],
})
export class LlamanosPageModule {}
