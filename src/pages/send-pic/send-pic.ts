import { Component } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-send-pic',
  templateUrl: 'send-pic.html',
})
export class SendPicPage {
  public base64Image;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera ) {  }

    takePicture() {
      const options : CameraOptions = {
        quality: 100,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        destinationType: this.camera.DestinationType.DATA_URL
      }

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
      },(err) => {
        console.log("Error: ",err);
      });
    }

    sendPicture(){
      console.log("Todo joya, adentro de sendPicture");
    }
}
