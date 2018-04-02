import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MenuSeguridadPage } from './menu-seguridad';

@NgModule({
  declarations: [
    MenuSeguridadPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuSeguridadPage),
    TranslateModule.forChild()
  ],
})
export class MenuSeguridadPageModule {}
