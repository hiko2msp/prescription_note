import {Component} from '@angular/core';
import {SettingComponent} from './setting';

@Component({
  selector: 'ons-page[setting-main]',
  template: `
  <ons-navigator swipable [page]="page"></ons-navigator>
  `,
  styleUrls: []
})
export class SettingMainComponent {
  page = SettingComponent;
  constructor() {}
}
