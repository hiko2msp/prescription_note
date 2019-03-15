
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DeviceReadyService } from './device-ready.service';
import { FileService } from './file.service';
export const ALBUM_NAME = 'お薬手帳アプリ';

@Injectable({
    providedIn: 'root'
})
export class CameraService {
    cordova: any;
    camera: any;
    library: any;
    libraryItemSubject = new Subject<any[]>();

    constructor(
        private _deviceReadyService: DeviceReadyService,
        private _fileService: FileService,
    ) {
        this._deviceReadyService.deviceReady().subscribe(() => {
            this.cordova = (window as any).cordova;
            this.camera = (navigator as any).camera;
            this.library = this.cordova.plugins.photoLibrary;
        });
    }

    getPhotoLibPermission() {
        return new Promise((resolve, reject) => {
            if (!this.cordova) {
                reject();
            }
            this.library.requestAuthorization(
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

    getLibrary(): Observable<any[]> {
        return this._deviceReadyService.deviceReady().pipe(
            switchMap(() => {
                let acc: any = [];
                this.library.getLibrary(
                    (chunk: any) => {
                        console.log('chunk', chunk);
                        acc = [...acc, ...chunk.library];
                        console.log(acc);
                        this.libraryItemSubject.next(acc);
                    },
                    (err: any) => {
                        if (err.startsWith('Permission')) {
                            this.library.getPhotoLibPermission();
                        }
                    },
                    {
                        chunkTimeSec: 0.3,
                        thumbnailWidth: 90,
                        thumbnailHeight: 90,
                        maxItems: 20,
                    }
                );
                return this.libraryItemSubject.asObservable();
            })
        );
    }

    savePhoto(imageURI: string): Promise<any> {
        if (!this.library) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            this.library.saveImage(
                imageURI,
                ALBUM_NAME,
                (libraryItem: any) => {
                    resolve(libraryItem);
                },
                (err: Error) => {
                    reject(err);
                });
        });
    }

    getPhotoURL(libraryItem: any): Promise<string> {
        if (!this.library) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            this.library.getPhotoURL(
                libraryItem,
                (photoURL: string) => { resolve(photoURL); },
                (error: Error) => { reject(error); }
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
                    sourceType: source,
                    saveToPhotoAlbum: false, // 別で保存するため、このタイミングでは保存しない
                    encodingType: this.camera.EncodingType.JPEG,
                }
            );
        });
    }

    getPictureFromCamera(): Promise<string> {
        if (!/iPhone/.test(navigator.userAgent)) {
            return Promise.resolve('assets/img/test.jpeg');
        }
        const filename: string = Date.now() + '.jpg';
        return this.getPictureFrom(this.camera.PictureSourceType.CAMERA)
            .then((imageURI) => this._fileService.copyImage(imageURI, filename));
    }

    getPictureFromAlbum(): Promise<string> {
        if (!/iPhone/.test(navigator.userAgent)) {
            return Promise.resolve('assets/img/test.jpeg');
        }
        const filename: string = Date.now() + '.jpg';
        return this.getPictureFrom(this.camera.PictureSourceType.SAVEDPHOTOALBUM)
            .then((imageURI) => this._fileService.copyImage(imageURI, filename));
    }
}
