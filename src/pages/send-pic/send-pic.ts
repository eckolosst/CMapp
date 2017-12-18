import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MailService } from '../../providers/cm-api/mail.service';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-send-pic',
  templateUrl: 'send-pic.html',
  providers: [MailService]
})
export class SendPicPage {
  public base64Image;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private _mailService: MailService,
    public toastCtrl: ToastController ) {  }

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
      var pic = this.base64Image;
      let toast = this.toastCtrl.create({
        message: 'Foto enviado! (:',
        duration: 2000
      });
      this._mailService.sendMail(pic).subscribe(
        result =>{
          toast.present();
          this.navCtrl.pop();
        },
        error =>{
          toast.setMessage('Lo sentimos, la foto no pudo ser enviado ):');
          console.log("error al enviar mail:",<any>error);
        }
      );
    }
}
