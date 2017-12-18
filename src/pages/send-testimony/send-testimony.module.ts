import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SendTestimonyPage } from './send-testimony';

@NgModule({
  declarations: [
    SendTestimonyPage,
  ],
  imports: [
    IonicPageModule.forChild(SendTestimonyPage),
    TranslateModule.forChild()
  ],
})
export class SendTestimonyPageModule {}
