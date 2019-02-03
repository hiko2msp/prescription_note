import {Component} from '@angular/core';
import {PrescriptionRecordRepository} from '../../service/prescription-record.repository';
import {OnsNavigator} from 'ngx-onsenui';
import {PreviewComponent} from './preview';
import {ListData} from './list_data';
import {ListDatas} from './list_data_sample';

@Component({
  selector: 'ons-page[home]',
  templateUrl: './home.html',
  styleUrls: [
    './home.scss'
  ]
})
export class HomeComponent {

  list3: ListData[] = ListDatas;

  user_image = 'assets/img/test.jpeg';
  big_image = 'assets/img/test.jpeg';
  title = 'No.1 Date: 2018/12/13';
  memo = '桜病院での処方';

  constructor(
    private _navigator: OnsNavigator,
    private _prescriptionRecordRepository: PrescriptionRecordRepository,
  ) {
    Promise.resolve()
      .then(() =>
        this._prescriptionRecordRepository.addRecord({
            id: null,
            createdDate: new Date(2017, 12, 12).toISOString(),
            updatedDate: new Date(2017, 12, 13).toISOString(),
            imagePath: '/tmp/path1',
            note: 'test note',
          }))
      .then(() =>
        this._prescriptionRecordRepository.addRecord({
            id: null,
            createdDate: new Date(2017, 12, 14).toISOString(),
            updatedDate: new Date(2017, 12, 14).toISOString(),
            imagePath: '/tmp/path2',
            note: 'test note',
          }))
      .then(() =>
        this._prescriptionRecordRepository.addRecord({
            id: null,
            createdDate: new Date(2017, 12, 15).toISOString(),
            updatedDate: new Date(2017, 12, 15).toISOString(),
            imagePath: '/tmp/path3',
            note: 'test note',
          }))
      .then((result) => this._prescriptionRecordRepository.getRecords())
      .then(result => console.log('record', result))
      .catch(error => console.log('error', error));
  }

  onListClicked(item: ListData) {
    console.log(`No.${item.date_str} List Clicked`);
    this._navigator.element.pushPage(PreviewComponent, {animation: 'simpleslide', data: item, }, );
  }

}
