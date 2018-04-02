import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { Section } from '../../providers/providers';
import { ListMasterPage } from './list-master';

@NgModule({
  declarations: [
    ListMasterPage,
  ],
  imports: [
    IonicPageModule.forChild(ListMasterPage),
    TranslateModule.forChild()
  ],
  exports: [
    ListMasterPage
  ],
  providers: [
    Section
  ]
})
export class ListMasterPageModule { }
