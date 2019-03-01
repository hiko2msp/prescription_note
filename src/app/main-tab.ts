import {Component} from '@angular/core';
import * as ons from 'onsenui';

import {OnsNavigator} from 'ngx-onsenui';
import {HomeComponent} from './home/home';
import {SettingComponent} from './setting/setting';
import {PrescriptionRecordRepository} from '../service/prescription-record.repository';
import {prescriptionRecordToViewModel} from './prescription-record.model';
import {BrowserCameraComponent} from './browser-camera.component';
import {PrescriptionRecord} from './prescription-record.model';
import {PreviewComponent} from './home/preview';
import {EditComponent} from './home/edit';

declare let cordova: any;
var pictureSource;   // 写真ソース
var destinationType; // 戻り値のフォーマット

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
    ) { }

    // 写真の撮影に成功した場合 (URI  形式)
    onPhotoURISuccess(imageURI) {
    }

    // ボタンがクリックされた場合の処理
    getPhoto(source) {
      // 写真をファイル URI として取得する場合
      (navigator as any).camera.getPicture(
        function (imageURI) {
          alert('success');
        },
        function (err) {
          alert('error');
        },
        { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source
        }
      );
    }

    photoGetLib() {
      cordova.plugins.photoLibrary.getLibrary(
        function ({library}) { },
        function (err) {
          if (err.startsWith('Permission')) {
            // call requestAuthorization, and retry
          }
          // Handle error - it's not permission-related
        }
      );
    }

    photoLibGet() {
      console.log("photoLibGet");
      console.log(cordova);
      cordova.plugins.photoLibrary.getLibrary(
        function (result) {
          var library = result.library;
          // Here we have the library as array
          library.forEach(function(libraryItem) {
            console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            console.log(libraryItem.fileName);
            console.log(libraryItem.width);
            console.log(libraryItem.height);
            console.log(libraryItem.creationDate);
            console.log(libraryItem.latitude);
            console.log(libraryItem.longitude);
            console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
        },
        function (err) {
          if (err.startsWith('Permission')) {
            // call requestAuthorization, and retry
              console.log('permission error');
          }
          console.log('Error occured');
        },
        { // optional options
          thumbnailWidth: 512,
          thumbnailHeight: 384,
          quality: 0.8,
          includeAlbumData: false // default
        }
      );
    }

    getPermission(){
      console.log('getPermission');
      cordova.plugins.photoLibrary.requestAuthorization(
        function () {
          // User gave us permission to his library, retry reading it!
          console.log('permission : success?');
        },
        function (err) {
          // User denied the access
          console.log('permission : error');
        }, // if options not provided, defaults to {read: true}.
        {
          read: true,
          write: true
        }
      );
    }

    onPlusButtonClick(event: Event) {

        event.stopPropagation();
        const ua = navigator.userAgent;
        console.log(ua);

        document.addEventListener('deviceready',()=>{
          pictureSource=(navigator as any).camera.PictureSourceType;
          destinationType=(navigator as any).camera.DestinationType;
          this.getPermission();
          // this.photoLibGet();
          this.getPhoto(pictureSource.SAVEDPHOTOALBUM);
          //this.photoGetLib();
        },{once: true,});

        // とりあえずtrueにしているだけ
        // if (/iPad|iPhone|Android/i.test(ua) && !/Mozilla/.test(ua)) {
        // if (false) {
        //   document.addEventListener('deviceready',()=>{
        //     console.log('camera in');
        //     console.log((navigator as any).camera);
        //
        //     (navigator as any).camera.getPicture(
        //         (imageURI) => {
        //             // this.addPictureFile(imageURI);
        //         },
        //         (message) => { console.log('error:', message); },
        //         {
        //             quality: 50,
        //             destinationType: (navigator as any).camera.DestinationType.DATA_URL,
        //         }
        //     );
        //   },{once: true,}); // for prevention of memory leak
        // } else {
        //     alert('test');
        //     this.photoLibGet();
        //     // const imageURI = 'click : ' + new Date();
        //     // this._navigator.element.pushPage(BrowserCameraComponent, { animation: 'lift', data: 'no data'});
        // }
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
