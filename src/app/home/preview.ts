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

    item: ListData;

    constructor(
      private _navigator: OnsNavigator,
      private params: Params
    ) {
      this.item = params.data;
      console.log("params.data : " + this.item.date_str);
    }

    onEditClicked(item) {
      this._navigator.element.pushPage(Edit,
        {
          animation: 'simpleslide',
          data: this.item,
        },
      );
    }

    // onBackClickedに変更すること
    onCloseClicked() {
      this._navigator.element.popPage();
    }

}
