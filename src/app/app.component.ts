import { Component } from '@angular/core'; import { MainTabComponent } from './main-tab';
import { DeviceReadyService } from 'src/service/device-ready.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    page = MainTabComponent;
}
