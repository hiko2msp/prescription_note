import {Component, OnInit, OnDestroy} from '@angular/core';
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
    items: PrescriptionRecordViewModel[];

    constructor(
        private _navigator: OnsNavigator,
        private _prescriptionRecordRepository: PrescriptionRecordRepository,
    ) {}

    ngOnInit() {
        this._prescriptionRecordRepository.getRecords().then((records: PrescriptionRecord[]) => {
                this.items = records.map(prescriptionRecordToViewModel);
            })
            .catch(error => console.log('error', error));
        this.subscriptions.push(
            this._prescriptionRecordRepository.recordStateChanged().subscribe(() => {
                this._prescriptionRecordRepository.getRecords().then((records: PrescriptionRecord[]) => {
                    this.items = records.filter(x => !!x).map(prescriptionRecordToViewModel);
                });
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    onItemClicked(item: PrescriptionRecordViewModel) {
        console.log(`No.${item.id} item Clicked`);
        this._navigator.element.pushPage(PreviewComponent, { animation: 'simpleslide', data: item.id, });
    }

}
