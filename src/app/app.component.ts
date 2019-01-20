import { Component } from '@angular/core';
import { MainTabComponent } from './main-tab';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  page = MainTabComponent;

  isSmartPhone() {
    return /iPad|iPhone|Android/i.test(navigator.userAgent);
  }
}
