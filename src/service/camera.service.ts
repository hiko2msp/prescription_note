
import { Injectable } from '@angular/core';
export const ALBUM_NAME = 'お薬手帳アプリ';

@Injectable({
    providedIn: 'root'
})
export class CameraService {
    cordova: any;
    camera: any;
    library: any;

    constructor() {
        document.addEventListener('deviceready',
            () => {
                this.cordova = (window as any).cordova;
                this.camera = (navigator as any).camera;
                this.library = this.cordova.plugins.photoLibrary;
            },
            {once: true}
        );
    }

    getPhotoLibPermission() {
        return new Promise((resolve, reject) => {
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

    getLibrary() {
        if (!this.library) {
            console.log('library not found');
            return;
        }
        this.library.getLibrary(
            (chunk: any) => {
                console.log('chunk', chunk);
            },
            (err: any) => {
                this.library.requestAuthorization(
                    () => {},
                    (err2: any) => {console.log(err2); },
                    {read: true, write: true}
                );
            },
            {
                chunkTimeSec: 0.3
            }
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
                }
            );
        });
    }

    getPictureFromCamera(): Promise<string> {
        if (!/iPhone/.test(navigator.userAgent)) {
            return Promise.resolve('assets/img/test.jpeg');
        }
        return this.getPictureFrom(this.camera.PictureSourceType.CAMERA)
            .then((imageURI) => this.savePhoto(imageURI))
            .then((libraryItem) => this.getPhotoURL(libraryItem));
    }

    getPictureFromAlbum(): Promise<string> {
        if (!/iPhone/.test(navigator.userAgent)) {
            return Promise.resolve('assets/img/test.jpeg');
        }
        return this.getPictureFrom(this.camera.PictureSourceType.SAVEDPHOTOALBUM);
    }
}
