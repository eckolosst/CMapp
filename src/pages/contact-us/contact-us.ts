import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MailService } from '../../providers/cm-api/mail.service';
import { Comment } from '../../models/comment';
import { FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
  providers: [MailService]
})
export class ContactUsPage {

  public comentario: Comment;
  public nameFC: FormControl;
  public emailFC: FormControl;
  public adjComment: boolean;
  public adjPicture: boolean;
  public adjLocation: boolean;
  public adjAudio: boolean;
  public image;
  public base64Image;
  public audioFile: MediaObject;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private _mailService: MailService,
    public toastCtrl: ToastController,
    private media: Media,
    private file: File
  ){
    this.comentario = new Comment ("","","","","","");
    this.nameFC = new FormControl('',[Validators.required]);
    this.emailFC = new FormControl('',[Validators.required, Validators.pattern(EMAIL_REGEX)]);
  }

  sendComment(){
    if(this.adjPicture && this.image){ this.comentario.picture = this.image; }
    // if(this.adjLocation){}
    // if(this.adjAudio){ this.comentario.audio = this.audioFile};
    let toast = this.toastCtrl.create({
      message: 'Comentario enviado! (:',
      duration: 2000
    });
    var content = this.comentario;
    this._mailService.sendMail(content).subscribe(
      result =>{
        this.navCtrl.pop();
        toast.present();
      },
      error =>{
        toast.setMessage('Lo sentimos, el comentario no pudo ser enviado ):');
        toast.present();
        console.log("error al enviar mail:",<any>error);
      }
    );
  }

  takePicture() {
    const options : CameraOptions = {
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.image = imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    },(err) => {
      console.log("Error: ",err);
    });
  }

  takeRecord(){
    this.file.createFile(this.file.tempDirectory, 'audio.mp3', true).then(() => {
      this.audioFile = this.media.create(this.file.tempDirectory.replace(/^this.audioFile:\/\//, '')+'audio.mp3');
      this.audioFile.startRecord();
      window.setTimeout(() => this.audioFile.stopRecord(), 10000);
    });

  }

  play(){
    if(this.audioFile){
      this.audioFile.play;
    }
  }

}
