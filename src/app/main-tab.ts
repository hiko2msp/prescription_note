import {Component} from '@angular/core';
import * as ons from 'onsenui';

import {OnsNavigator} from 'ngx-onsenui';
import {HomeComponent} from './home/home';
import {SettingComponent} from './setting/setting';
import {PrescriptionRecordRepository} from '../service/prescription-record.repository';
import {prescriptionRecordToViewModel} from './prescription-record.model';
import {BrowserCameraComponent} from './browser-camera.component';
import { PrescriptionRecord } from './prescription-record.model';
import {PreviewComponent} from './home/preview';
import {EditComponent} from './home/edit';

@Component({
    selector: 'ons-page[main-tab]',
    templateUrl: './main-tab.html',
})
export class MainTabComponent {
    home = HomeComponent;
    setting = SettingComponent;

    animation = ons.platform.isAndroid() ? 'slide' : 'none';
    modifier = ons.platform.isAndroid() ? 'material noshadow' : '';

    constructor(
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
        private _navigator: OnsNavigator,
    ) { }

    onPlusButtonClick(event: Event) {
        event.stopPropagation();
        const ua = navigator.userAgent;
        console.log(ua);

        if (/iPad|iPhone|Android/i.test(ua) && !/Mozilla/.test(ua)) {
            (navigator as any).camera.getPicture(
                (imageURI) => {
                    // this.addPictureFile(imageURI);
                },
                (message) => { console.log('error:', message); },
                {
                    quality: 50,
                    destinationType: (navigator as any).camera.DestinationType.DATA_URL,
                }
            );
        } else {
            const imageURI = 'click : ' + new Date();
            this._navigator.element.pushPage(BrowserCameraComponent, { animation: 'lift', data: 'no data'});
        }
    }

    addPictureFile(imageURI) {
        Promise.resolve()
            .then(() =>
                this._prescriptionRecordRepository.addRecord({
                    id: null,
                    createdDate: new Date().toISOString(),
                    updatedDate: new Date().toISOString(),
                    imagePath: imageURI,
                    note: '',
                }))
            .then(result => this._prescriptionRecordRepository.getRecords())
            .then(result => console.log('record', result))
            .catch(error => console.log('error', error));
    }
}
