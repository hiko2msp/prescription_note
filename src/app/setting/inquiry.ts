import {Component} from '@angular/core';
import {OnsNavigator} from 'ngx-onsenui'
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'ons-page[inquiry]',
  template: `
  <ons-toolbar [attr.modifier]="modifier">
    <div class="left" (click)="onBackButtonClicked()"><ons-toolbar-button><ons-icon icon="fa-times"></ons-icon></ons-toolbar-button></div>
    <div class="center">問い合わせ</div>
  </ons-toolbar>
  問い合わせは追加予定です
  `,
})
export class InquiryComponent {

  constructor(
    private _navigator: OnsNavigator,
    private _sanitizer: DomSanitizer,
  ) {
  }

  onBackButtonClicked() {
    this._navigator.element.popPage();
  }
}
