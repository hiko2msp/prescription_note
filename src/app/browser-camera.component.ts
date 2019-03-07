import {Component, ViewChild, OnInit} from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui';
import {prescriptionRecordToViewModel} from './prescription-record.model';
import {PrescriptionRecordRepository} from '../service/prescription-record.repository';
import {PreviewComponent} from './home/preview';
import {EditComponent} from './home/edit';


@Component({
    selector: 'ons-page[camera]',
    template: `
    <ons-toolbar [attr.modifier]="modifier">
        <div class="left" (click)="onCloseClicked()"><ons-toolbar-button><ons-icon icon="fa-times"></ons-icon></ons-toolbar-button></div>
        <div class="center">ダミーカメラ</div>
    </ons-toolbar>

    <div id="canvas-wrapper" [ngClass]="{'not-preview': !isPreview}">
        <canvas #imgCanvas class="preview"></canvas>
    </div>
    <video autoplay #video class="camera" [ngClass]="{'not-preview': isPreview}"></video>
    <button (click)="onShootClicked()" *ngIf="!isPreview">撮影</button>
    <div *ngIf="isPreview">
        これでいいですか？
        <button (click)="onConfirmClicked()">はい</button>
        <button (click)="onCancelClicked()">いいえ</button>
    </div>
  `,
    styleUrls: [
        './main-tab.css'
    ]
})
export class BrowserCameraComponent implements OnInit {

    recordId: string;
    base64Img: string;
    isPreview = false;
    @ViewChild('video') video;
    @ViewChild('imgCanvas') imgCanvas;

    constructor(
        private _navigator: OnsNavigator,
        private params: Params,
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
    ) { }

    ngOnInit() {
        this.recordId = this.params.data;
        navigator.getUserMedia(
            { video: true },
            (stream) => {
                (this.video.nativeElement as HTMLVideoElement).srcObject = stream;
            },
            (error) => { console.log(error); }
        );
    }

    onShootClicked() {
        const canvas = this.imgCanvas.nativeElement;
        const context = canvas.getContext('2d');

        canvas.setAttribute('height', canvas.width * this.video.nativeElement.videoHeight / this.video.nativeElement.videoWidth);
        context.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        this.isPreview = true;
        this.base64Img = dataURL;
    }
    onConfirmClicked() {
        this.isPreview = false;
        const isNavigatedFromHome = (this.recordId === 'no data');
        if (isNavigatedFromHome) {
            this._prescriptionRecordRepository
                .addRecord({
                    id: null,
                    createdDate: new Date(2017, 12, 12).toISOString(),
                    updatedDate: new Date(2017, 12, 13).toISOString(),
                    imagePath: this.base64Img,
                    note: '',
                })
                .then(() => this._prescriptionRecordRepository.getLatestRecord())
                .then(record => {
                    return Promise.resolve()
                        // 先にプレビューページをスタックしておく
                        .then(() => this._navigator.element.pushPage(PreviewComponent, { animation: 'none', data: record.id}))
                        // 編集ページに遷移する
                        .then(() => this._navigator.element.pushPage(EditComponent,
                            { animation: 'simpleslide', data: prescriptionRecordToViewModel(record)}))
                        // このページを消す
                        .then(() => this._navigator.element.removePage(1));
                });
        } else {
            this._prescriptionRecordRepository
                .updateImage(this.recordId, this.base64Img)
                .then(() => this._prescriptionRecordRepository.getRecordById(this.recordId))
                .then(record => {
                    return Promise.resolve()
                        // 以前の編集ページを破棄
                        .then(() => this._navigator.element.removePage(2))
                        // このページを編集ページに置き換える
                        .then(() => this._navigator.element.replacePage(EditComponent,
                            { animation: 'simpleslide', data: prescriptionRecordToViewModel(record)}));
                });
        }
    }

    onCancelClicked() {
        this.isPreview = false;
    }

    onCloseClicked() {
        const isNavigatedFromHome = (this.recordId === null);
        if (isNavigatedFromHome) {
            Promise.resolve()
                .then(() => this._prescriptionRecordRepository.deleteById(this.recordId))
                .then(() => this._navigator.element.popPage({times: 2}));
        } else {
           this._navigator.element.popPage();
        }
    }
}
