
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CameraService {
    cordova: any;
    camera: any;

    constructor() {
        document.addEventListener('deviceready',
            () => {
                this.camera = (navigator as any).camera;
            },
            {once: true}
        );
    }

    getPhotoLibPermission() {
        return new Promise((resolve, reject) => {
            console.log(this.cordova);
            if (!this.cordova) {
                reject();
            }
            this.cordova.plugins.photoLibrary.requestAuthorization(
                () => { resolve(); },
                (err) => {
                    console.log('error:', err);
                    resolve(); // ここでエラーになるのは問題ない
                },
                 // if options not provided, defaults to {read: true}.
                {
                    read: true,
                    write: true
                }
            );
        });
    }

    getPictureFrom(source: number): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.camera) {
                reject();
            }
            this.camera.getPicture(
                (imageURI) => { resolve(imageURI); },
                (message) => { reject(); },
                {
                    quality: 50,
                    destinationType: this.camera.DestinationType.FILE_URI,
                    sourceType: source
                }
            );
        });
    }

    getPictureFromCamera(): Promise<string> {
        if (!/iPhone/.test(navigator.userAgent)) {
            return Promise.resolve('assets/img/test.jpeg');
        }
        return this.getPictureFrom(this.camera.PictureSourceType.CAMERA);
    }

    getPictureFromAlbum(): Promise<string> {
        if (!/iPhone/.test(navigator.userAgent)) {
            return Promise.resolve('assets/img/test.jpeg');
        }
        return this.getPictureFrom(this.camera.PictureSourceType.SAVEDPHOTOALBUM);
    }
}
