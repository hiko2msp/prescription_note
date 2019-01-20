import {Component} from '@angular/core';
import {OnsNavigator} from 'ngx-onsenui';

@Component({
  selector: 'ons-page[about]',
  templateUrl: './about.html',
  styles: ['./about.css']
})
export class AboutComponent {
  constructor(
    private _navigator: OnsNavigator,
  ) {}

  onCloseClicked() {
    this._navigator.element.popPage();
  }
}
