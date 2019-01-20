import { Injectable } from '@angular/core';

interface PrescriptionRecord {
    id: number;
    createdDate: string;
    updatedDate: string;
    imagePath: string;
    note: string;
}


const DATABASE_NAME = 'prescription_record';

@Injectable({
    providedIn: 'root'
})
export class PrescriptionRecordRepository {
    private _database = null;
    constructor() {
        this._database = (window as any).openDatabase(DATABASE_NAME, 1.0, 'お薬手帳レコード', 1000000);
        this._database.transaction(
            (tx) => {
                tx.executeSql(`DROP TABLE IF EXISTS ${DATABASE_NAME}`, [], () => {}, () => {});
                const sql = `
                create table if not exists ${DATABASE_NAME} (
                    id integer not null primary key autoincrement,
                    created_date text not null,
                    updated_date text not null,
                    image_path text unique not null,
                    note text
                )
                `;
                tx.executeSql(
                    sql,
                    [],
                    (_, record) => {console.log('record1', record)},
                    (_, error) => {console.log('test1', error)}
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
                        `INSERT INTO ${DATABASE_NAME} (created_date, updated_date, image_path, note) VALUES (?, ?, ?, ?)`,
                        [record.createdDate, record.updatedDate, record.imagePath, record.note],
                        (_, result: any) => { resolve(result) },
                        (_, error: Error) => { reject(error) }
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
                        (_, result) => { resolve(Array.from(result.rows)) },
                        (_, error: Error) => { reject(error) }
                    );
                }
            );
        });
    }
}
