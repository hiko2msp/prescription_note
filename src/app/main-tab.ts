import {Component} from '@angular/core';
import * as ons from 'onsenui';

import {OnsNavigator} from 'ngx-onsenui';
import {HomeComponent} from './home/home';
import {SettingComponent} from './setting/setting';
import {PrescriptionRecordRepository} from '../service/prescription-record.repository';
import {CameraService} from 'src/service/camera.service';
import {ListLibraryComponent} from 'src/app/list-library.component';

@Component({
    selector: 'ons-page[main-tab]',
    templateUrl: './main-tab.html',
})
export class MainTabComponent {
    home = HomeComponent;
    setting = SettingComponent;

    animation = 'default';
    modifier = ons.platform.isAndroid() ? 'material noshadow' : '';

    constructor(
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
        private _navigator: OnsNavigator,
        private _cameraService: CameraService,
    ) {}

    onPlusButtonClick(event: Event, selectedType: string) {
        event.stopPropagation();

        if ( selectedType === 'Camera' ) {
            this._cameraService.getPictureFromCamera()
                .then(imagePath => {
                    this.addPictureFile(imagePath);
                }).catch(error => {
                    console.log(error);
                });
        } else if ( selectedType === 'PhotoLibrary') {
            this._navigator.element.pushPage(ListLibraryComponent, { animation: 'lift' });
        } else {
            ons.notification.alert('カメラは使えません');
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
            .then(result => {
                console.log('record', result);
            })
            .catch(error => console.log('error', error));
    }
}
