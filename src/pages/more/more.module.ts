import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { MorePage } from './more';

@NgModule({
  declarations: [
    MorePage,
  ],
  imports: [
    IonicPageModule.forChild(MorePage),
    TranslateModule.forChild()
  ],
})
export class MorePageModule {}
