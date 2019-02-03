import { Component, OnInit } from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui';
import { PrescriptionRecordViewModel } from '../prescription-record.model';
import {PrescriptionRecordRepository} from '../../service/prescription-record.repository';
import {BrowserCameraComponent} from '../browser-camera.component';
import * as ons from 'onsenui';

const TOAST_TIMEOUT = 2000; // 2000msec

@Component({
    selector: 'ons-page[edit]',
    templateUrl: './edit.html',
    styleUrls: [
        './edit.css'
    ]
})
export class EditComponent implements OnInit {

    item: PrescriptionRecordViewModel;

    constructor(
        private _navigator: OnsNavigator,
        private params: Params,
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
    ) {}

    ngOnInit() {
        this.item = this.params.data;
        console.log(this.item);
    }

    onCloseClicked() {
        this._navigator.element.popPage();
    }

    // 画像をタッチした時に呼び出される
    onImgChange() {
        // 写真撮影かアルバムからか選択する画面を出す
        const isImgChange = this.shootOrAlbum();
        if (isImgChange) {
            Promise.resolve()
                .then(() => this._navigator.element.pushPage(BrowserCameraComponent, { animation: 'lift', data: this.item.id}));
        } else {
            console.log('image not changed (=canceled)');
        }
    }

    shootOrAlbum(): boolean {
        return true;
    }

    // 登録完了ボタンタッチで呼び出される
    onEditEndClicked() {
        this._prescriptionRecordRepository.updateRecord({
            id: this.item.id,
            createdDate: this.item.date.toISOString(),
            updatedDate: new Date().toISOString(),
            imagePath: this.item.image,
            note: '',
        })
        .then(() => {
            ons.notification.toast('Registration Success !!', { timeout: TOAST_TIMEOUT });
            this._navigator.element.popPage();
        })
        .catch(error => console.log('error', error));
    }

}
