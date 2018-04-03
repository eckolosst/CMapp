import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GrupoPage } from './grupo';

@NgModule({
  declarations: [
    GrupoPage,
  ],
  imports: [
    IonicPageModule.forChild(GrupoPage),
    TranslateModule.forChild()
  ]
})
export class GrupoPageModule {}
