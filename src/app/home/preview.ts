import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui';
import { EditComponent } from './edit';
import { PrescriptionRecordViewModel, prescriptionRecordToViewModel } from '../prescription-record.model';
import { PrescriptionRecordRepository } from '../../service/prescription-record.repository';
import { Subject, Observable, of } from 'rxjs';
import * as op from 'rxjs/operators';
import * as ons from 'onsenui';

// preview.tsとedit.ts共通なのでまとめたい
const TOAST_TIMEOUT = 2000; // 2000msec

@Component({
    selector: 'ons-page[preview]',
    templateUrl: './preview.html',
    styleUrls: [
        './preview.scss'
    ]
})
export class PreviewComponent implements OnInit {

    itemId: string;
    itemIdSubject: Subject<string> = new Subject<string>();
    item$: Observable<PrescriptionRecordViewModel>;

    constructor(
        private _navigator: OnsNavigator,
        private params: Params,
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
    ) {}

    ngOnInit() {
        this.itemId = this.params.data;
        this.item$ = this._prescriptionRecordRepository.getRecordObservableById(this.itemId).pipe(
            op.map(prescriptionRecordToViewModel),
            op.startWith({id: null, image: null, date: null, memo: null}),
        );
    }

    onEditClicked() {
        console.log('Edit Button Clicked');
        this.item$.pipe(op.skip(1), op.first()).subscribe(item => {
            this._navigator.element.pushPage(EditComponent, { animation: 'simpleslide', data: item });
        });
    }

    onCloseClicked() {
        console.log('Back Button Clicked');
        this._navigator.element.popPage();
    }

    onDeleteClicked() {
        Promise.resolve()
            .then(() => this._navigator.element.popPage())
            .then(() => this._prescriptionRecordRepository.deleteById(this.itemId))
            .then(() => ons.notification.toast('削除しました', { timeout: TOAST_TIMEOUT }));
    }
}
