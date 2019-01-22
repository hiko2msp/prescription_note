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

    item: ListData;


    constructor(
      private _navigator: OnsNavigator,
      private params: Params
    ) {
      this.item = params.data;
      console.log('params.data : ' + this.item.date_str);
    }

    onEditClicked(item: ListData) {
      console.log('Edit Button Clicked');
      this._navigator.element.pushPage(EditComponent, {animation: 'simpleslide', data: this.item, }, );
    }

    onCloseClicked() {
      console.log('Back Button Clicked');
      this._navigator.element.popPage();
    }

}
