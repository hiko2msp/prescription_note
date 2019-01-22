import {Component, ViewChild, OnInit} from '@angular/core';
import * as ons from 'onsenui';

import {OnsNavigator, Params} from 'ngx-onsenui';
import {HomeComponent} from './home/home';
import {SettingComponent} from './setting/setting';
import {PrescriptionRecordRepository} from '../service/prescription-record.repository';

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

  base64Img: string;
  isPreview = false;
  @ViewChild('video') video;
  @ViewChild('imgCanvas') imgCanvas;

  constructor(
    private _navigator: OnsNavigator,
  ) {}

  ngOnInit() {
    navigator.getUserMedia(
      {video: true},
      (stream) => {
        (this.video.nativeElement as HTMLVideoElement).srcObject = stream;
      },
      (error) => {console.log(error); }
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
    console.log(this.base64Img);
    this._navigator.element.popPage();
  }
  onCancelClicked() {
    this.isPreview = false;
  }
  onCloseClicked() {
    this._navigator.element.popPage();
  }
}


@Component({
  selector: 'ons-page[main-tab]',
  templateUrl: './main-tab.html',
})
export class MainTabComponent {
  home = HomeComponent;
  setting = SettingComponent;

  animation = ons.platform.isAndroid() ? 'slide' : 'none';
  modifier = ons.platform.isAndroid() ? 'material noshadow' : '';

  constructor(
    private _prescriptionRecordRepository: PrescriptionRecordRepository,
    private _navigator: OnsNavigator,
  ) {}

  onPlusButtonClick() {
    const ua = navigator.userAgent;
    console.log(ua);

    if (/iPad|iPhone|Android/i.test(ua) && !/Mozilla/.test(ua)) {
      (navigator as any).camera.getPicture(
        (imageURI) => {
          this.addPictureFile(imageURI);
        },
        (message) => {console.log('error:', message); },
        {
          quality: 50,
          destinationType: (navigator as any).camera.DestinationType.DATA_URL,
        }
      );
    } else {
      const imageURI = 'click : ' + new Date();
      this._navigator.element.pushPage(BrowserCameraComponent, {animation: 'lift'});
    }
  }

  addPictureFile(imageURI) {
    Promise.resolve()
      .then(() =>
        this._prescriptionRecordRepository.addRecord({
          id: null,
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
          imagePath: imageURI,
          note: '',
        }))
      .then(result => this._prescriptionRecordRepository.getRecords())
      .then(result => console.log('record', result))
      .catch(error => console.log('error', error));
  }
}
