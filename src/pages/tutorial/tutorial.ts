import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MainPage } from '../pages';
import { NativeStorage } from '@ionic-native/native-storage';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  dir: string = 'ltr';
  public tutorial = false;
  constructor(
    public navCtrl: NavController, translate: TranslateService,
    public platform: Platform,
    private nativeStorage: NativeStorage ) {

    this.nativeStorage.getItem('tutorial')
      .then(
        data => {
          this.navCtrl.setRoot(MainPage, {}, {
            animate: true,
            direction: 'forward'
          });
        },
        error => {
          this.tutorial = true;
          this.dir = platform.dir();
          translate.get(["TUTORIAL_SLIDE1_TITLE",
            "TUTORIAL_SLIDE1_DESCRIPTION",
            "TUTORIAL_SLIDE2_TITLE",
            "TUTORIAL_SLIDE2_DESCRIPTION",
            "TUTORIAL_SLIDE3_TITLE",
            "TUTORIAL_SLIDE3_DESCRIPTION",
          ]).subscribe(
            (values) => {
              console.log('Loaded values', values);
              this.slides = [
                {
                  title: values.TUTORIAL_SLIDE1_TITLE,
                  description: values.TUTORIAL_SLIDE1_DESCRIPTION,
                  image: 'assets/img/ica-slidebox-img-1.png',
                },
                {
                  title: values.TUTORIAL_SLIDE2_TITLE,
                  description: values.TUTORIAL_SLIDE2_DESCRIPTION,
                  image: 'assets/img/ica-slidebox-img-2.png',
                },
                {
                  title: values.TUTORIAL_SLIDE3_TITLE,
                  description: values.TUTORIAL_SLIDE3_DESCRIPTION,
                  image: 'assets/img/ica-slidebox-img-3.png',
                }
              ];
            });
        }
    );
  }

  startApp() {
    this.nativeStorage.setItem('tutorial', true).then(
      () => {
        console.log('Tutorial Visto');
        this.navCtrl.setRoot(MainPage, {}, {
          animate: true,
          direction: 'forward'
        });
      },
      error => console.error('Error storing item tutorial', error)
    );

}

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

}
