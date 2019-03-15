import {Component, ViewChild, OnInit} from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui';
import { CameraService } from 'src/service/camera.service';
import { Observable } from 'rxjs';
import { PrescriptionRecordRepository } from 'src/service/prescription-record.repository';


@Component({
    selector: 'ons-page[library]',
    template: `
    <ons-toolbar [attr.modifier]="modifier">
        <div class="left" (click)="onCloseClicked()"><ons-toolbar-button><ons-icon icon="fa-times"></ons-icon></ons-toolbar-button></div>
        <div class="center">アルバム</div>
    </ons-toolbar>

    <div class="library-item" *ngFor="let item of (items$ | async)">
      <img class="library-item__img" [src]="item.thumbnailURL | cdvphotolibrary" (click)="onItemClicked(item)" />
    </div>

    `,
    styleUrls: [
        './main-tab.css',
        './list-library.component.scss',
    ]
})
export class ListLibraryComponent implements OnInit {

    items$: Observable<any[]> = this._cameraService.getLibrary();

    constructor(
        private _navigator: OnsNavigator,
        private params: Params,
        private _cameraService: CameraService,
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
    ) { }

    ngOnInit() {}

    onCloseClicked() {
        this._navigator.element.popPage();
    }

    onItemClicked(libraryItem: any) {
        Promise.resolve()
            .then(() =>
                this._prescriptionRecordRepository.addRecord({
                    id: null,
                    createdDate: new Date().toISOString(),
                    updatedDate: new Date().toISOString(),
                    imagePath: libraryItem.photoURL,
                    note: '',
                }))
            .then(() => {
                this._navigator.element.popPage();
            })
            .catch(error => console.log('error', error));
    }
}
