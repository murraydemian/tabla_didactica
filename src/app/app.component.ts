import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
 
  splash = false;
  splashAnimation = 'div-splash';
  divSuperpuesto = 'div-superpuesto';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    if(this.splash){
      setTimeout(() => this.stop_splash(), 10000);
    }
  }
  start_fadeout(){
    this.splashAnimation = 'fade-out';
    this.divSuperpuesto = 'fade-out';
  }
  stop_splash(){
    this.splash = false;
  }
}
