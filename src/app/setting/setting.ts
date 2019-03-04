import {Component} from '@angular/core';
import {OnsNavigator} from 'ngx-onsenui';
import {AboutComponent} from './about';
import {AccountComponent} from './account';
import {RegulationComponent} from './regulation/regulation.component';
import * as ons from 'onsenui';

@Component({
    selector: 'ons-page[setting]',
    templateUrl: './setting.html',
    styleUrls: []
})
export class SettingComponent {
    formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeeU7LE1TN6o7pqNd9H8sxz5-NSQ1AcdQdd3tCGHjKo__WzQA/viewform?embedded=true';
    constructor(
        private _navigator: OnsNavigator,
    ) {
        document.addEventListener('deviceready', onDeviceReady, false);
        function onDeviceReady() {
            window.open = (window as any).cordova.InAppBrowser.open;
        }
    }

    onAboutClicked() {
        this._navigator.element.pushPage(AboutComponent, { animation: 'simpleslide' });
    }

    onAccountButtonClicked() {
        this._navigator.element.pushPage(AccountComponent, { animation: 'simpleslide' });
    }

    onInquiryClicked() {
        ons.notification.confirm({
            title: null,
            buttonLabels: ['いいえ', 'はい'],
            message: 'ブラウザで<br>問い合わせフォームを開きます',
            cancelable: true,
            callback: answerIndex => {
                if (answerIndex === 1) {
                    window.open(this.formUrl, '_system', 'location=yes');
                }
            }
          });
    }

    onRegulationClicked() {
        this._navigator.element.pushPage(RegulationComponent, { animation: 'simpleslide' });
    }
}
