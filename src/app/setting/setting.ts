import {Component} from '@angular/core';
import {OnsNavigator} from 'ngx-onsenui';
import {AboutComponent} from './about';
import {InquiryComponent} from './inquiry';
import {AccountComponent} from './account';

@Component({
  selector: 'ons-page[setting]',
  templateUrl: './setting.html',
  styleUrls: []
})
export class SettingComponent {
  constructor(
    private _navigator: OnsNavigator,
  ) {}

  onAboutClicked() {
    this._navigator.element.pushPage(AboutComponent, {animation: 'simpleslide'});
  }

  onAccountButtonClicked() {
    this._navigator.element.pushPage(AccountComponent, {animation: 'simpleslide'});
  }

  onInquiryClicked() {
    this._navigator.element.pushPage(InquiryComponent, {animation: 'lift'});
  }
}
