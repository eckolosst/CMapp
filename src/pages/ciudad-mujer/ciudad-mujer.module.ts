import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CiudadMujerPage } from './ciudad-mujer';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CiudadMujerPage,
  ],
  imports: [
    IonicPageModule.forChild(CiudadMujerPage),
    TranslateModule.forChild()
  ],
})
export class CiudadMujerPageModule {}
