import { Injectable } from '@angular/core';
import { PrescriptionRecord } from '../app/prescription-record.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';


type RecordChangeStatue = 'add' | 'initial' | 'update' | 'updateImage' | 'delete';
const DATABASE_NAME = 'prescription_record';

@Injectable({
    providedIn: 'root'
})
export class PrescriptionRecordRepository {
    recordChangeStream = new BehaviorSubject<RecordChangeStatue>('initial');

    private _database = null;
    constructor() {
        this._database = (window as any).openDatabase(DATABASE_NAME, 1.0, 'お薬手帳レコード', 1000000);
        this._database.transaction(
            (tx) => {
                tx.executeSql(`DROP TABLE IF EXISTS ${DATABASE_NAME}`, [], () => {}, () => {});
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
                    (_, record) => {console.log('record1', record); },
                    (_, error) => {console.log('test1', error); }
                );
            }
        );
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
                        (_, error: Error) => { reject(false); }
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
                        (_, result) => { resolve(Array.from(result.rows)); },
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
                            (_, result) => { resolve(Array.from(result.rows)[0] as PrescriptionRecord); },
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
                        (_, result) => { resolve(Array.from(result.rows)[0] as PrescriptionRecord); },
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
                        (_, result) => { resolve(Array.from(result.rows)[0] as PrescriptionRecord); },
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
