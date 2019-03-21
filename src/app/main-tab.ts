import {Component} from '@angular/core';
import * as ons from 'onsenui';

import {OnsNavigator} from 'ngx-onsenui';
import {HomeComponent} from './home/home';
import {SettingComponent} from './setting/setting';
import {PrescriptionRecordRepository} from '../service/prescription-record.repository';
import {CameraService} from 'src/service/camera.service';
import {PrescriptionRecord, prescriptionRecordToViewModel} from '../app/prescription-record.model';
import {EditComponent} from './home/edit';

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
    ) {
        this.beforeMount();
    }

    beforeMount() {
        const html = document.documentElement;
            if (!ons.platform.isIPhoneX()) {
            } else {
                html.setAttribute('onsflag-iphonex-portrait', 'true');
            }
    }

    onPlusButtonClick(event: Event, selectedType: string) {
        event.stopPropagation();

        if ( selectedType === 'Camera' ) {
            this._cameraService.getPictureFromCamera()
                .then(imagePath => this.addPictureFile(imagePath))
                .then((record: PrescriptionRecord) => {
                    this._navigator.element.pushPage(EditComponent,
                        { animation: 'simpleslide', data: prescriptionRecordToViewModel(record) });
                })
                .catch(error => {
                    console.log(error);
                });
        } else if ( selectedType === 'PhotoLibrary') {
            this._cameraService.getPictureFromAlbum()
                .then(imagePath => this.addPictureFile(imagePath))
                .then((record: PrescriptionRecord) => {
                    this._navigator.element.pushPage(EditComponent,
                        { animation: 'simpleslide', data: prescriptionRecordToViewModel(record) });
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            ons.notification.alert('カメラは使えません');
        }
    }

    async addPictureFile(imageURI: string): Promise<PrescriptionRecord> {
        await this._prescriptionRecordRepository.addRecord({
            id: null,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            imagePath: imageURI,
            note: '',
        });
        return this._prescriptionRecordRepository.getLatestRecord();
    }
}
