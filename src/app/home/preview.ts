import {Component} from '@angular/core';
import {OnsNavigator, Params} from 'ngx-onsenui';
import {EditComponent} from './edit';
import {ListData} from './list_data';
import {Datas} from './list_data_sample';

@Component({
  selector: 'ons-page[preview]',
  templateUrl: './preview.html',
  styleUrls: [
    './preview.css'
  ]
})
export class PreviewComponent {

    num: number;

    get_list: ListData;

    constructor(
      private _navigator: OnsNavigator,
      private params: Params
    ) {
      this.num = params.data;
      console.log(params.data);
      this.get_data_from_db_table();
    }

    // edit.tsでも流用
    get_data_from_db_table() {
      console.log('get_data_from_db_table');
      // numからtableの情報を取ってきて代入してHTMLに表示
      this.get_list = {
        img1: 'assets/img/test.jpeg',
        date_str: 'No.1 Date: 2018/12/13',
        memo_str: 'メモテスト',
        img2: 'assets/img/test.jpeg',
      } as ListData;
    }

    onEditClicked() {
      console.log('Edit Button Clicked');
      this._navigator.element.pushPage(EditComponent, {animation: 'simpleslide', data: this.num, }, );
    }

    onCloseClicked() {
      console.log('Back Button Clicked');
      this._navigator.element.popPage();
    }

}
