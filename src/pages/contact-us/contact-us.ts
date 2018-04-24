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
import { AndroidPermissions } from '@ionic-native/android-permissions';

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
    private base64: Base64,
    private androidPermissions: AndroidPermissions){
      this.comentario = new Comment ("","","","","","");
      this.nameFC = new FormControl('',[Validators.required]);
      this.emailFC = new FormControl('',[Validators.required, Validators.pattern(EMAIL_REGEX)]);
      this.audioFileName = 'record.mp3';
      this.enviando = false;
  }

  ionViewWillEnter(){
    var arrPermisos = [this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,this.androidPermissions.PERMISSION.RECORD_AUDIO,this.androidPermissions.PERMISSION.CAMERA];
    for (let i = 0; i < arrPermisos.length; i++) {
      this.androidPermissions.checkPermission(arrPermisos[i])
      .then(
        (result) => {
          if(result.hasPermission == false){
            this.androidPermissions.requestPermission(arrPermisos[i]);
          }
        }
      );
    }
  }

  convertirAudio(){
    var filePath: string;
    this.file.resolveLocalFilesystemUrl(this.file.externalRootDirectory+this.audioFileName)
    .then(resultado =>{
      filePath = resultado.nativeURL;
      this.base64.encodeFile(filePath).then(
        (base64Audio: string) => {this.base64Audio = base64Audio;},
        (err) =>{this.reportarError('Se produjo un error al capturar el audio');}
      );
    });
  }

  takeRecord(){
    this.audioFile = null;
    this.audioFile = this.media.create(this.audioFileName);
    this.audioFile.startRecord();
    this.audioFile.onSuccess.subscribe(()=> {this.audioFile.release()});//libera los recursos de audio del SO
  }

  stopRecord(){
    try{
      this.audioFile.stopRecord();
    }catch(err){
      this.reportarError('Se produjo un error al parar de grabar el audio');
    }
    window.setTimeout(() => {
      this.convertirAudio();
    },2000);
  }

  play(){
    try{
      this.audioFile.play();
    }catch(err){
      this.reportarError('No se grabó ningún audio');
    }
  }

  pause(){
    try{
      this.audioFile.pause();
    }catch(err){
      this.reportarError('No se grabó ningún audio');
    }
  }

  takePicture() {
    const options : CameraOptions = {
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL
    }
    this.camera.getPicture(options).then(
      (imageData) => {
        this.image = imageData;
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
      },
      (err) => {this.reportarError('Se produjo un error al tomar la foto')});
  }

  sendComment(){
    this.enviando = true;
    if(this.adjPicture && this.image){ this.comentario.picture = this.image; }
    if(this.adjAudio && this.audioFile){this.comentario.audio = this.base64Audio}
    var content = this.comentario;
    this._mailService.sendMail(content).subscribe(
      result =>{
        this.navCtrl.pop();
        this.reportarError('Comentario enviado! (:')
        this.enviando = false;
      },
      error =>{
        this.reportarError('Lo sentimos, el comentario no pudo ser enviado ):')
        this.enviando = false;
      }
    );
  }

  reportarError(msj: string){
    let toast = this.toastCtrl.create({
      message: msj,
      duration: 2000
    });
    toast.present();
  }
}
