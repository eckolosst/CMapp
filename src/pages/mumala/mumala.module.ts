import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MumalaPage } from './mumala';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MumalaPage,
  ],
  imports: [
    IonicPageModule.forChild(MumalaPage),
    TranslateModule.forChild()
  ],
})
export class MumalaPageModule {}
