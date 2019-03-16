
import { Injectable } from '@angular/core';
import { DeviceReadyService } from './device-ready.service';
import { FileService } from './file.service';
export const ALBUM_NAME = 'お薬手帳アプリ';

@Injectable({
    providedIn: 'root'
})
export class CameraService {
    cordova: any;
    camera: any;

    constructor(
        private _deviceReadyService: DeviceReadyService,
        private _fileService: FileService,
    ) {
        this._deviceReadyService.deviceReady().subscribe(() => {
            this.cordova = (window as any).cordova;
            this.camera = (navigator as any).camera;
        });
    }

    getPictureFrom(source: number): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.camera) {
                reject();
            }
            this.camera.getPicture(
                (imageURI: string) => { resolve(imageURI); },
                (error: Error) => { reject(error); },
                {
                    quality: 50,
                    destinationType: this.camera.DestinationType.FILE_URI,
                    sourceType: source,
                    saveToPhotoAlbum: false, // 別で保存するため、このタイミングでは保存しない
                    encodingType: this.camera.EncodingType.JPEG,
                }
            );
        });
    }

    async getPictureFromCamera(): Promise<string> {
        if (!/iPhone/.test(navigator.userAgent)) {
            return Promise.resolve('assets/img/test.jpeg');
        }
        const filename: string = Date.now() + '.jpg';
        const imageURI = await this.getPictureFrom(this.camera.PictureSourceType.CAMERA);
        return this._fileService.copyImage(imageURI, filename);
    }

    async getPictureFromAlbum(): Promise<string> {
        if (!/iPhone/.test(navigator.userAgent)) {
            return Promise.resolve('assets/img/test.jpeg');
        }
        const filename: string = Date.now() + '.jpg';
        const imageURI = await this.getPictureFrom(this.camera.PictureSourceType.SAVEDPHOTOALBUM);
        return this._fileService.copyImage(imageURI, filename);
    }
}
