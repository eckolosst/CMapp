import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SendPicPage } from './send-pic';

@NgModule({
  declarations: [
    SendPicPage,
  ],
  imports: [
    IonicPageModule.forChild(SendPicPage),
    TranslateModule.forChild()
  ],
})
export class SendPicPageModule {}
