import { Component, OnInit } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';
import { DeviceReadyService } from 'src/service/device-ready.service';

@Component({
    selector: 'ons-page[about]',
    templateUrl: './about.html',
    styleUrls: ['./about.css']
})
export class AboutComponent implements OnInit {

    currentVersion = 'X.X.X';

    constructor(
        private _navigator: OnsNavigator,
        private _deviceReadyService: DeviceReadyService,
    ) { }

    ngOnInit() {
        this._deviceReadyService.deviceReady().subscribe(() => {
            if ((window as any).cordova) {
                (window as any).cordova.getAppVersion.getVersionNumber().then((version) => {
                    console.log(version);
                    this.currentVersion = version;
                });
            }
        });
    }

    onCloseClicked() {
        this._navigator.element.popPage({
            animation: 'simpleslide',
        });
    }

}
