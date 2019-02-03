import * as moment from 'moment';

export interface PrescriptionRecord {
    id: number;
    createdDate: string;
    updatedDate: string;
    imagePath: string;
    note: string;
}

export interface PrescriptionRecordViewModel {
    image: string;
    id: number;
    date: Date;
    memo: string;
}

export function prescriptionRecordToViewModel(record: PrescriptionRecord): PrescriptionRecordViewModel {
    return {
        id: record.id,
        date: moment(record.createdDate).toDate(),
        image: record.imagePath,
        memo: record.note,
    } as PrescriptionRecordViewModel;
}
