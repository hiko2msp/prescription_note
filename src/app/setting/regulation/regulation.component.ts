import { Component, OnInit } from '@angular/core';
import {OnsNavigator} from 'ngx-onsenui';

@Component({
    selector: 'ons-page[regulation]',
    templateUrl: './regulation.component.html',
    styleUrls: ['./regulation.component.scss']
})
export class RegulationComponent {
    constructor(
        private _navigator: OnsNavigator,
    ) { }

    onCloseClicked() {
        this._navigator.element.popPage({
            animation: 'simpleslide',
        });
    }
}
