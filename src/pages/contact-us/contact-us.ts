import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MailService } from '../../providers/cm-api/mail.service';
import { Comment } from '../../models/comment';
import { FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Media, MediaObject } from '@ionic-native/media';
import { LongPressModule } from 'ionic-long-press';
import { Base64 } from '@ionic-native/base64';
import { File }  from '@ionic-native/file';

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
  public adjPicture: boolean;
  // public adjLocation: boolean;
  public adjAudio: boolean;
  public image;
  public base64Image: string;
  public audioFile: MediaObject;
  private audioFileName: string;
  public base64Audio: string;
  public enviando: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private _mailService: MailService,
    public toastCtrl: ToastController,
    private media: Media,
    private file: File,
    private base64: Base64
  ){
    this.comentario = new Comment ("","","","","","");
    this.nameFC = new FormControl('',[Validators.required]);
    this.emailFC = new FormControl('',[Validators.required, Validators.pattern(EMAIL_REGEX)]);
    this.audioFileName = 'record.mp3';
    this.enviando = false;
  }

  convertirAudio(){
    var filePath: string;
    this.file.resolveLocalFilesystemUrl(this.file.externalRootDirectory+this.audioFileName).then(resultado =>{
      filePath = resultado.nativeURL;
      this.base64.encodeFile(filePath).then((base64Audio: string) => {
        this.base64Audio = base64Audio;
        // console.log('se convirtió: ' + this.base64Audio );
      }, (err) =>{
        console.log(err);
      });
    });
  }

  takeRecord(){
    this.audioFile = null;
    this.audioFile = this.media.create(this.audioFileName);
    this.audioFile.startRecord();
    // console.log('start recording ' + this.audioFileName);
    this.audioFile.onSuccess.subscribe(()=> {this.audioFile.release()});//libera los recursos de audio del SO
  }

  stopRecord(){
    try{
      this.audioFile.stopRecord();
    }catch(err){
      console.log(err)
    }
    // console.log('se termino de grabar')
    window.setTimeout(() => {
      this.convertirAudio();
      // console.log('se convirtio: ' + this.base64Audio );
    },2000);
  }

  play(){
    try{
      // console.log('reproduciendo... ' + this.audioFile)
      this.audioFile.play();
    }catch(err){
      console.log(err);
      console.log('No se grabó ningun audio')
    }
  }
  pause(){
    try{
      this.audioFile.pause();
    }catch(err){
      console.log(err);
      console.log('No se grabó ningun audio')
    }
  }

  takePicture() {
    const options : CameraOptions = {
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL
    }
    this.camera.getPicture(options).then((imageData) => {
      this.image = imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    },(err) => {
      console.log("Error: ",err);
    });
  }

  sendComment(){
    this.enviando = true;
    if(this.adjPicture && this.image){ this.comentario.picture = this.image; }
    // if(this.adjLocation){}
    if(this.adjAudio && this.audioFile){this.comentario.audio = this.base64Audio}
    let toast = this.toastCtrl.create({
      message: 'Comentario enviado! (:',
      duration: 2000
    });
    var content = this.comentario;
    this._mailService.sendMail(content).subscribe(
      result =>{
        this.navCtrl.pop();
        toast.present();
        this.enviando = false;
      },
      error =>{
        toast.setMessage('Lo sentimos, el comentario no pudo ser enviado ):');
        toast.present();
        console.log("error al enviar mail:",<any>error);
        this.enviando = false;
      }
    );
  }
}
