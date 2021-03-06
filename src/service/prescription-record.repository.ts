import { Injectable } from '@angular/core';
import { PrescriptionRecord } from '../app/prescription-record.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { DeviceReadyService } from './device-ready.service';


type RecordChangeStatue = 'add' | 'initial' | 'update' | 'updateImage' | 'delete';
const DATABASE_NAME = 'prescription_record';

@Injectable({
    providedIn: 'root'
})
export class PrescriptionRecordRepository {
    recordChangeStream = new BehaviorSubject<RecordChangeStatue>('initial');

    private _database = null;
    constructor(
        private _deviceReadyService: DeviceReadyService
    ) {
        this.createDatabase().then(() => {
            this._database.transaction(
                (tx) => {
                    // データベースをリセットしたいときはこのコメントアウトを外す
                    // tx.executeSql(`DROP TABLE IF EXISTS ${DATABASE_NAME}`, [], () => { }, () => { });
                    const sql = `
                    create table if not exists ${DATABASE_NAME} (
                        id integer not null primary key autoincrement,
                        createdDate text not null,
                        updatedDate text not null,
                        imagePath text,
                        note text
                    )
                    `;
                    tx.executeSql(
                        sql,
                        [],
                        (_, record) => {
                            this.recordChangeStream.next('initial');
                        },
                        (_, error) => { console.log('test1', error); }
                    );
                }
            );
        });
    }

    createDatabase(): Promise<void> {
        if (this._deviceReadyService.isSmartPhone()) {
            return new Promise((resolve, reject) => {
                this._deviceReadyService.deviceReady().subscribe(() => {
                    this._database = (window as any).sqlitePlugin.openDatabase({
                        name: DATABASE_NAME,
                        location: 'default',
                        androidDatabaseProvider: 'system'
                    });
                    resolve();
                });
            });
        } else {
            // ブラウザでの動作確認用
            this._database = (window as any).openDatabase(DATABASE_NAME, 1.0, 'お薬手帳レコード', 1000000);
            return Promise.resolve();
        }
    }

    addRecord(record: PrescriptionRecord): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this._database) {
                reject(new Error('database not found'));
            }
            this._database.transaction(
                (tx) => {
                    tx.executeSql(
                        `INSERT INTO ${DATABASE_NAME} (createdDate, updatedDate, imagePath, note) VALUES (?, ?, ?, ?)`,
                        [record.createdDate, record.updatedDate, record.imagePath, record.note],
                        (_, result: any) => {
                            resolve(result);
                            this.recordChangeStream.next('add');
                        },
                        (_, error: Error) => { reject(error); }
                    );
                }
            );
        });
    }

    updateImage(recordId: string, imagePath: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this._database) {
                reject(new Error('database not found'));
            }
            this._database.transaction(
                (tx) => {
                    tx.executeSql(
                        `UPDATE ${DATABASE_NAME} SET updatedDate = ?, imagePath = ? WHERE id = ?`,
                        [new Date().toISOString(), imagePath, recordId],
                        (_, result: any) => {
                            resolve(true);
                            this.recordChangeStream.next('updateImage');
                        },
                        (_, error: Error) => { reject(false); }
                    );
                }
            );
        });
    }

    updateRecord(record: PrescriptionRecord): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this._database) {
                reject(new Error('database not found'));
            }
            this._database.transaction(
                (tx) => {
                    tx.executeSql(
                        `UPDATE ${DATABASE_NAME} SET createdDate = ?, updatedDate = ?, imagePath = ?, note = ? WHERE id = ?`,
                        [record.createdDate, record.updatedDate, record.imagePath, record.note, record.id],
                        (_, result: any) => {
                            resolve(true);
                            this.recordChangeStream.next('update');
                        },
                        (_, error: Error) => { reject(error); }
                    );
                }
            );
        });
    }

    deleteById(recordId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this._database) {
                reject(new Error('database not found'));
            }
            this._database.transaction(
                (tx) => {
                    tx.executeSql(`delete from ${DATABASE_NAME} where id = ?`, [recordId],
                        (_, result) => {
                            this.recordChangeStream.next('delete');
                            resolve(true);
                        },
                        (_, error: Error) => { reject(error); }
                    );
                }
            );
        });
    }

    getRecords(): Promise<PrescriptionRecord[]> {
        return new Promise((resolve, reject) => {
            if (!this._database) {
                reject(new Error('database not found'));
            }
            this._database.transaction(
                (tx) => {
                    tx.executeSql(`select * from ${DATABASE_NAME}`, [],
                        (_, result) => {
                            const items = Array.from(result.rows).map((v, k) => result.rows.item(k));
                            resolve(items);
                        },
                        (_, error: Error) => { reject(error); }
                    );
                }
            );
        });
    }

    getRecordObservableById(recordId: string): Observable<PrescriptionRecord> {
        return this.recordChangeStream.asObservable().pipe(flatMap(() => {
            return new Promise<PrescriptionRecord>((resolve, reject) => {
                if (!this._database) {
                    reject(new Error('database not found'));
                }
                this._database.transaction(
                    (tx) => {
                        tx.executeSql(`select * from ${DATABASE_NAME} where id = ? limit 1;`, [recordId],
                            (_, result) => { resolve(result.rows.item(0) as PrescriptionRecord); },
                            (_, error: Error) => { reject(error); }
                        );
                    }
                );
            });
        }));
    }

    getRecordById(recordId: string): Promise<PrescriptionRecord> {
        return new Promise((resolve, reject) => {
            if (!this._database) {
                reject(new Error('database not found'));
            }
            this._database.transaction(
                (tx) => {
                    tx.executeSql(`select * from ${DATABASE_NAME} where id = ? limit 1`, [recordId],
                        (_, result) => { resolve(result.rows.item(0) as PrescriptionRecord); },
                        (_, error: Error) => { reject(error); }
                    );
                }
            );
        });
    }

    getLatestRecord(): Promise<PrescriptionRecord> {
        return new Promise((resolve, reject) => {
            if (!this._database) {
                reject(new Error('database not found'));
            }
            this._database.transaction(
                (tx) => {
                    tx.executeSql(`select * from ${DATABASE_NAME} order by id desc limit 1`, [],
                        (_, result) => { resolve(result.rows.item(0) as PrescriptionRecord); },
                        (_, error: Error) => { reject(error); }
                    );
                }
            );
        });
    }

    recordStateChanged(): Observable<RecordChangeStatue> {
        return this.recordChangeStream.asObservable();
    }
}
