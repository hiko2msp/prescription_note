import {Component} from '@angular/core';
import * as ons from 'onsenui';

import {OnsNavigator} from 'ngx-onsenui';
import {HomeComponent} from './home/home';
import {SettingComponent} from './setting/setting';
import {PrescriptionRecordRepository} from '../service/prescription-record.repository';
import {prescriptionRecordToViewModel} from './prescription-record.model';
import {BrowserCameraComponent} from './browser-camera.component';
import {PrescriptionRecord} from './prescription-record.model';
import {PreviewComponent} from './home/preview';
import {EditComponent} from './home/edit';

@Component({
    selector: 'ons-page[main-tab]',
    templateUrl: './main-tab.html',
})
export class MainTabComponent {

    cordova: any;
    pictureSource;

    home = HomeComponent;
    setting = SettingComponent;

    animation = ons.platform.isAndroid() ? 'slide' : 'default';
    modifier = ons.platform.isAndroid() ? 'material noshadow' : '';

    constructor(
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
        private _navigator: OnsNavigator,
    ) {
        document.addEventListener('deviceready', () => {
            this.pictureSource = (navigator as any).camera.PictureSourceType;
            },
            {
                once: true,
            }
        );
    }

    // should be renamed to [dispPhotoLib]
    dispPhotoLib(source) {
        (navigator as any).camera.getPicture(
            (imageURI) => { this.addPictureFile(imageURI); },
            (message) => { console.log('error:', message); },
            {
                quality: 50,
                destinationType: (navigator as any).camera.DestinationType.DATA_URI,
                sourceType: source
            }
        );
    }

    getPhotoLibPermission(){
        return new Promise((resolve,reject) => {
            this.cordova.plugins.photoLibrary.requestAuthorization(
                () => { resolve(); },
                (err) => { reject(); },
                 // if options not provided, defaults to {read: true}.
                {
                    read: true,
                    write: true
                }
            );
        });
    }

    onPlusButtonClick(event: Event, selectedType: string) {
        event.stopPropagation();
        const ua = navigator.userAgent;
        console.log(ua);

        if ( selectedType === "Camera" ) {
            document.addEventListener('deviceready', () => {
                this.dispPhotoLib(this.pictureSource.CAMERA);
                },
                { once: true, }  // for prevention of memory leak
            );
        } else if ( selectedType === "PhotoLibrary" ) {
            // destinationType=(navigator as any).camera.DestinationType;
            this.getPhotoLibPermission().then(() => {
                this.dispPhotoLib(this.pictureSource.SAVEDPHOTOALBUM);
            });
        }
    }

    //成功したらユーザーに対して通知（Toastなど）を行いたい
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
