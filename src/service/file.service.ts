
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { DeviceReadyService } from './device-ready.service';

type FileEntry = any;
type DirectoryEntry = any;

@Injectable({
    providedIn: 'root'
})
export class FileService {
    file: any;

    constructor(
        private _deviceReadyService: DeviceReadyService,
    ) {
        this._deviceReadyService.deviceReady().subscribe(() => {
            this.file = (window as any).cordova.file;
        });
    }

    async getDirectory(): Promise<string> {
        return new Promise((resolve, reject) => {
            this._deviceReadyService.deviceReady().subscribe(() => {
                resolve(this.file.dataDirectory);
            });
        });
    }

    async copyImage(fromPath: string, imgFileName: string): Promise<string> {
        const imageData: Blob = await this.readJpgImage(fromPath);
        return await this.createNewFile(imgFileName, imageData);
    }

    writeFileByEntry(fileEntry: FileEntry, dataObj: Blob, isAppend?: boolean): Promise<null> {
        return new Promise((resolve, reject) => {
            fileEntry.createWriter((fileWriter) => {
                fileWriter.onwriteend = () => {
                    console.log('Successful file read...');
                    resolve();
                };
                fileWriter.onerror = (e) => {
                    console.log('Failed file read: ' + e.toString());
                    reject(e);
                };
                // If we are appending data to file, go to the end of the file.
                if (isAppend) {
                    try {
                        fileWriter.seek(fileWriter.length);
                    } catch (e) {
                        console.log('file doesn\'t exist!');
                    }
                }
                fileWriter.write(dataObj);
            });
        });
    }

    async createNewFile(fileName: string, data: Blob): Promise<string> {
        const directoryName: string = await this.getDirectory();
        console.log(directoryName);
        const fileEntry: FileEntry = await new Promise<FileEntry>((resolve, reject) => {
            (window as any).resolveLocalFileSystemURL(directoryName,
                (dirEntry: DirectoryEntry) => {
                    dirEntry.getFile(fileName, { create: true, exclusive: false },
                        (fe: FileEntry) => {
                            console.log('file entry', fe);
                            resolve(fe);
                        },
                        (error: Error) => {reject(error); }
                    );
                },
                (error: Error) => {reject(error); }
            );
        });
        console.log('file entry', fileEntry);
        await this.writeFileByEntry(fileEntry, data);
        console.log('dirname', directoryName, 'filename', fileName);
        return directoryName + fileName;
    }

    readJpgImage(filePath: string): Promise<Blob> {
        console.log('flag', filePath);
        return new Promise((resolve, reject) => {
            (window as any).resolveLocalFileSystemURL(filePath, (fileEntry: FileEntry) => {
                fileEntry.file((file) => {
                    console.log('flag1', file);
                    const reader = new FileReader();
                    // ここのfunctionはthisのスコープを制限するためにアロー関数を使ってはいけない
                    reader.onloadend = function() {
                        console.log('flag2', this.result);
                        resolve(new Blob([this.result], { type: 'image/jpg'}));
                    };
                    reader.readAsArrayBuffer(file);
                }, (error) => {
                    console.log(error);
                    reject();
                });
            });
        });
    }
}
