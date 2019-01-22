import {Component} from '@angular/core';
import {OnsNavigator, Params} from 'ngx-onsenui';
import {ListData} from './list_data';
import {Datas} from './list_data_sample';
import * as ons from 'onsenui';

@Component({
  selector: 'ons-page[edit]',
  templateUrl: './edit.html',
  styleUrls: [
    './edit.css'
  ]
})
export class EditComponent {

    item: ListData;

    constructor(
      private _navigator: OnsNavigator,
      private params: Params,
    ) {
      this.item = params.data;
      console.log('params.data : ' + this.item.date_str);
    }

    onCloseClicked() {
      this._navigator.element.popPage();
    }

    // 画像をタッチした時に呼び出される
    onImgChange() {
      // 写真撮影かアルバムからか選択する画面を出す
      this.shootOrAlbum();
      const isImgChange = this.shootOrAlbum();
      if (isImgChange) {
        console.log('image changed');
      } else {
        console.log('image not changed (=canceled)');
      }
    }

    shootOrAlbum(): boolean {
      ons.notification.alert('撮影かアルバム画面になる');
      return true;
    }

    // 登録完了ボタンタッチで呼び出される
    onEditEndClicked() {
      const toast_timeout = 2000; // 2000msec
      const registration_success = this.databaseUpdate();
      if (registration_success) {
        ons.notification.toast('Registration Success !!', {timeout: toast_timeout});
      } else {
        // 今はこちらは表示されないようにしてある
        ons.notification.toast('Registration Failed ...', {timeout: toast_timeout});
      }

    }

    databaseUpdate(): boolean {
      console.log('database changing...');
      // TODO: 入力フォームなどにあるデータを更新後データとして更新する
      return true;
    }

}
