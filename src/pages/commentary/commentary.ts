import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MailService } from '../../providers/cm-api/mail.service';
import { Comment } from '../../models/comment';
import { FormControl, Validators } from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@IonicPage()
@Component({
  selector: 'page-commentary',
  templateUrl: 'commentary.html',
  providers: [MailService]
})
export class CommentaryPage {
  public comentario: Comment;
  public nameFC: FormControl;
  public emailFC: FormControl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _mailService: MailService,
    public toastCtrl: ToastController
  ){
    this.comentario = new Comment ("","","");
    this.nameFC = new FormControl('',[Validators.required]);
    this.emailFC = new FormControl('',[Validators.required, Validators.pattern(EMAIL_REGEX)]);
  }

  sendComment(){
    var comment = this.comentario;
    let toast = this.toastCtrl.create({
      message: 'Comentario enviado! (:',
      duration: 2000
    });
    this._mailService.sendMail(comment).subscribe(
      result =>{
        toast.present();
        this.navCtrl.pop();
      },
      error =>{
        toast.setMessage('Lo sentimos, el comentario no pudo ser enviado ):');
        toast.present();
        console.log("error al enviar mail:",<any>error);
      }
    );
  }
}
