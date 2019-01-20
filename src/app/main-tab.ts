import {Component} from '@angular/core';
import * as ons from 'onsenui';

import {HomeComponent} from './home/home';
import {SettingComponent} from './setting/setting';
import {PrescriptionRecordRepository} from '../service/prescription-record.repository';

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
  ) {}

  onPlusButtonClick() {
    const ua = navigator.userAgent;

    if (ua.indexOf('iPad') > 0 || ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0) {
      (navigator as any).camera.getPicture(
        (imageURI) => {
          this.addPictureFile(imageURI);
        },
        (message) => {console.log('error:', message); },
        {
          quality: 50,
          destinationType: (navigator as any).camera.DestinationType.DATA_URL,
        }
      );
    } else {
      const imageURI = 'click : ' + new Date();
      this.addPictureFile(imageURI);
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
