import {Component} from '@angular/core';
import {HomeComponent} from './home';

@Component({
  selector: 'ons-page[home-main]',
  template: `
  <ons-navigator swipable [page]="page"></ons-navigator>
  `,
  styleUrls: []
})
export class HomeMainComponent {
  page = HomeComponent;
  constructor() {}
}
