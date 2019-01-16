import {Component} from '@angular/core'
import {OnsNavigator, Params} from 'ngx-onsenui'
import {Edit} from './edit'
import {ListData} from './list_data'
import {Datas} from './list_data_sample'

@Component({
  selector: 'ons-page[preview]',
  templateUrl: 'src/app/home/preview.html',
  styles: [
  	'./preview.css'
  ]
})
export class Preview {

    num: number;

    get_list: ListData[] = Datas;

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
      console.log("get_data_from_db_table");
      // numからtableの情報を取ってきて代入してHTMLに表示
      this.get_list.img1 = '/www/assets/img/user.png';
      this.get_list.date_str = 'No.1 Date: 2018/12/13';
      this.get_list.memo_str = 'メモテスト';
      this.get_list.img2 = '/www/assets/img/test.jpeg';
    }

    onEditClicked() {
      console.log("Edit Button Clicked");
      this._navigator.element.pushPage(Edit, {animation: 'simpleslide', data: this.num, }, );
    }

    onCloseClicked() {
      console.log("Back Button Clicked");
      this._navigator.element.popPage();
    }

}
