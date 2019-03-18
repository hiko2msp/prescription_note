import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {
    PrescriptionRecord,
    PrescriptionRecordViewModel,
    prescriptionRecordToViewModel
} from '../prescription-record.model';
import {PrescriptionRecordRepository} from '../../service/prescription-record.repository';
import {OnsNavigator} from 'ngx-onsenui';
import {PreviewComponent} from './preview';
import {Subscription} from 'rxjs';


@Component({
    selector: 'ons-page[home]',
    templateUrl: './home.html',
    styleUrls: [
        './home.scss'
    ]
})
export class HomeComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];
    items: PrescriptionRecordViewModel[] = [];

    constructor(
        private _navigator: OnsNavigator,
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this._prescriptionRecordRepository.getRecords().then((records: PrescriptionRecord[]) => {
                this.items = records.map(prescriptionRecordToViewModel);
            })
            .catch(error => console.log('error', error));
        this.subscriptions.push(
            this._prescriptionRecordRepository.recordStateChanged().subscribe((flag) => {
                this._prescriptionRecordRepository.getRecords().then((records: PrescriptionRecord[]) => {
                    this.items = records.filter(x => !!x).map(prescriptionRecordToViewModel);
                    this._changeDetectorRef.detectChanges();
                })
                .catch(error => console.log('error', error));
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    onItemClicked(item: PrescriptionRecordViewModel) {
        this._navigator.element.pushPage(PreviewComponent, { animation: 'simpleslide', data: item.id, });
    }

}
