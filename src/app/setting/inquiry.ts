import { Component } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';
import * as ons from 'onsenui';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
    selector: 'ons-page[inquiry]',
    template: `
    <ons-toolbar [attr.modifier]="modifier">
    <div class="left" (click)="onBackButtonClicked()"><ons-toolbar-button><ons-icon icon="fa-times"></ons-icon></ons-toolbar-button></div>
    <div class="center">問い合わせ</div>
    </ons-toolbar>
    <iframe [src]="safeSite" width="640" height="730" frameborder="0" marginheight="0" marginwidth="0">
        読み込んでいます...
    </iframe>
    `,
})
export class InquiryComponent {
    safeSite: SafeResourceUrl;
    formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeeU7LE1TN6o7pqNd9H8sxz5-NSQ1AcdQdd3tCGHjKo__WzQA/viewform?embedded=true';

    constructor(
        private _navigator: OnsNavigator,
        private _sanitizer: DomSanitizer,
    ) {
        this.safeSite = this._sanitizer.bypassSecurityTrustResourceUrl(this.formUrl);
        window.open(this.formUrl, '_system', 'location=yes');
    }

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
