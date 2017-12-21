import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaCapture, CaptureAudioOptions, MediaFile, CaptureError } from '@ionic-native/media-capture';

/**
 * Generated class for the SendTestomonyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    private mediaCapture: MediaCapture
  ) {}

  rec(){
    let options: CaptureAudioOptions = {limit:1, duration: 120};
    this.mediaCapture.captureAudio(options).then(
      (data: MediaFile[]) => this.audio = data,
      (err: CaptureError) => console.log(err.code)
    );
  }
}
