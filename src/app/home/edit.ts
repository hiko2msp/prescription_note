import { Component, OnInit } from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui';
import { PrescriptionRecordViewModel } from '../prescription-record.model';
import {PrescriptionRecordRepository} from '../../service/prescription-record.repository';
import {BrowserCameraComponent} from '../browser-camera.component';
import * as ons from 'onsenui';
import { CameraService } from 'src/service/camera.service';

// preview.tsとedit.ts共通なのでまとめたい
const TOAST_TIMEOUT = 2000; // 2000msec

@Component({
    selector: 'ons-page[edit]',
    templateUrl: './edit.html',
    styleUrls: [
        './edit.scss'
    ]
})
export class EditComponent implements OnInit {

    item: PrescriptionRecordViewModel;

    constructor(
        private _navigator: OnsNavigator,
        private params: Params,
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
        private _cameraService: CameraService,
    ) {}

    ngOnInit() {
        this.item = this.params.data;
        console.log(this.item);
    }

    onCloseClicked() {
        this._navigator.element.popPage();
    }

    onPlusButtonClick(event: Event, selectedType: string) {
        event.stopPropagation();

        if ( selectedType === 'Camera' ) {
            this._cameraService.getPictureFromCamera()
                .then(imagePath => {
                    this.item.image = imagePath;
                }).catch(error => {
                    console.log(error);
                });
        } else if ( selectedType === 'PhotoLibrary') {
            this._cameraService.getPictureFromAlbum()
                .then(imagePath => {
                    this.item.image = imagePath;
                }).catch(error => {
                    console.log(error);
                });
        } else {
            ons.notification.alert('カメラは使えません');
        }
    }

    // 登録完了ボタンタッチで呼び出される
    onEditEndClicked() {
        // 入力された時刻を取得してtoISOStringの形式にする
        let addDate = document.getElementById("addDate") as HTMLTextAreaElement;
        console.log("addDate -> "+ addDate.value);

        // memoの部分を取得する
        let memoText = document.getElementById("memo") as HTMLTextAreaElement;

        this._prescriptionRecordRepository.updateRecord({
            id: this.item.id,
            createdDate: new Date(addDate.value).toISOString(),
            updatedDate: new Date().toISOString(),
            imagePath: this.item.image,
            note: String(memoText.value),
        })
        .then(() => {
            ons.notification.toast('登録に成功しました', { timeout: TOAST_TIMEOUT });
            this._navigator.element.popPage();
        })
        .catch(error => console.log('error', error));
    }

}
