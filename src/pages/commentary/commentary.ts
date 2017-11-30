import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MailService } from '../../providers/cm-api/mail.service';
import { Comment } from '../../models/comment';

@IonicPage()
@Component({
  selector: 'page-commentary',
  templateUrl: 'commentary.html',
  providers: [MailService]
})
export class CommentaryPage {

  name: String;
  email: String;
  comment: String;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _mailService: MailService
  ){}

  ionViewDidLoad() {
  }

  sendComment(){
    var comentario = new Comment(this.name, this.email, this.comment);
    this._mailService.sendMail(comentario).subscribe(
      result =>{

      },
      error =>{
          console.log(<any>error);
      }
    );
  }
}
