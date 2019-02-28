import { Component } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';
import * as ons from 'onsenui';

@Component({
    selector: 'ons-page[inquiry]',
    template: `
    <ons-toolbar [attr.modifier]="modifier">
    <div class="left" (click)="onBackButtonClicked()"><ons-toolbar-button><ons-icon icon="fa-times"></ons-icon></ons-toolbar-button></div>
    <div class="center">問い合わせ</div>
    </ons-toolbar>
    <ons-button style="width:80%; margin: 120% 10% 0 10%" modifier="large--cta" (click)="onMailButtonClicked()">
      メールで問い合わせる
    </ons-button>
    `,
})
export class InquiryComponent {

    constructor(
        private _navigator: OnsNavigator,
    ) {}

    onMailButtonClicked() {
        document.addEventListener('deviceready', function () {
            console.log('device ready', (window as any).cordova);
            (window as any).cordova.plugins.email.isAvailable(isAvailable => {
                console.log('Is email available:', isAvailable);
                if (isAvailable) {
                    (window as any).cordova.plugins.email.open(
                        {
                            to:      'hiko2msp+apple@gmail.com',
                            subject: 'Test',
                            body:    'Test'
                        },
                        () => {console.log('email open failed'); },
                    );
                } else {
                    ons.notification.alert('Service is not available');
                }
            });
        }, false);
    }

    onBackButtonClicked() {
        this._navigator.element.popPage();
    }
}
