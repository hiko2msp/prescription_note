import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DeviceReadyService {
    deviceReadySubject = new BehaviorSubject(false);

    constructor() {
        document.addEventListener('deviceready',
            () => {
                this.deviceReadySubject.next(true);
            },
            {once: true}
        );
    }

    deviceReady(): Observable<boolean> {
        return this.deviceReadySubject.asObservable().pipe(
            filter(x => !!x),
            first()
        );
    }
}
