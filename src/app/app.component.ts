import { Component } from '@angular/core';
import { MainTabComponent } from './main-tab';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  page = MainTabComponent;

  constructor() {
    function onDeviceReady() {
      console.log("deviceready");
      alert("app.component.ts onDeviceReady");
      console.log("after onDeviceReady");
      console.log((navigator as any).camera);
    }
    document.addEventListener("deviceready",onDeviceReady,false);
    console.log("script test2");
  }

  isSmartPhone() {
    return /iPad|iPhone|Android/i.test(navigator.userAgent);
  }
}
