import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SendLocationPage } from './send-location';

@NgModule({
  declarations: [
    SendLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(SendLocationPage),
    TranslateModule.forChild()
  ],
})
export class SendLocationPageModule {}
