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
  <iframe [src]="safeSite" frameborder="0" width="100%" height="100%" >テスト</iframe>
  `,
})
export class InquiryComponent {

  siteURL = 'https://crowi-site.herokuapp.com/%E5%AE%9A%E4%BE%8B%E3%83%9F%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0/1';
  safeSite: SafeResourceUrl;

  constructor(
    private _navigator: OnsNavigator,
    private _sanitizer: DomSanitizer,
  ) {
    this.safeSite = this._sanitizer.bypassSecurityTrustResourceUrl(this.siteURL);
  }

  onBackButtonClicked() {
    this._navigator.element.popPage();
  }
}
