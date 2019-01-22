import {Component} from '@angular/core';
import {OnsNavigator} from 'ngx-onsenui';
import {AboutComponent} from './about';

@Component({
  selector: 'ons-page[account]',
  template: `
  <ons-toolbar [attr.modifier]="modifier">
    <div class="left" (click)="onCloseClicked()"><ons-toolbar-button><ons-icon icon="fa-times"></ons-icon></ons-toolbar-button></div>
    <div class="center">個人情報設定</div>
  </ons-toolbar>
  個人情報設定は追加予定です
  `,
})
export class AccountComponent {
  constructor(
    private _navigator: OnsNavigator,
  ) {}

  onCloseClicked() {
    this._navigator.element.popPage();
  }
}
