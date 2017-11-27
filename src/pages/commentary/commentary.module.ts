import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentaryPage } from './commentary';

@NgModule({
  declarations: [
    CommentaryPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentaryPage),
  ],
})
export class CommentaryPageModule {}
