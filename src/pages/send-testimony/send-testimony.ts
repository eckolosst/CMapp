import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';

@IonicPage()
@Component({
  selector: 'page-send-testimony',
  templateUrl: 'send-testimony.html',
})
export class SendTestimonyPage {

  public audio;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mediaCapture: Media,
    private file: File
  ) { }

  rec(){
    
  }
}
