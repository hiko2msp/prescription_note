import { Component, OnInit } from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui';
import { PrescriptionRecordViewModel } from '../prescription-record.model';
import { PrescriptionRecordRepository } from '../../service/prescription-record.repository';
import { BrowserCameraComponent } from '../browser-camera.component';
import * as ons from 'onsenui';
import { CameraService } from 'src/service/camera.service';


// TOAST_TIMEOUTはpreview.tsとedit.ts共通なのでまとめたい
const TOAST_TIMEOUT = 2000; // 2000msec
const NO_DATETIME_ALERT = '日時を入力してください';
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

    value_check() {
        const addDate = document.getElementById('addDate') as HTMLTextAreaElement;
        if (!addDate.value) {
            ons.notification.alert('日時を入力してください');
        }
    }

    // 登録完了ボタンタッチで呼び出される
    onEditEndClicked() {
        // 入力された時刻を取得してtoISOStringの形式にする
        const addDate = document.getElementById('addDate') as HTMLTextAreaElement;
        console.log('addDate -> ' + addDate.value);

        if (!addDate.value) {
            ons.notification.alert('日時を入力してください');
        } else {
            // memoの部分を取得する
            const memoText = document.getElementById('memo') as HTMLTextAreaElement;

            // 日本の時差9時間分減算
            const currentUnixtime = new Date(addDate.value).valueOf() - 9 * 60 * 60 * 1000;

            this._prescriptionRecordRepository.updateRecord({
                id: this.item.id,
                createdDate: new Date(currentUnixtime).toISOString(),
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

}
