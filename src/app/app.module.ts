import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainTabComponent } from './main-tab';
import { BrowserCameraComponent } from './browser-camera.component';
import { HomeComponent } from './home/home';
import { EditComponent } from './home/edit';
import { PreviewComponent } from './home/preview';
import { HomeMainComponent } from './home/home-main';
import { AboutComponent } from './setting/about';
import { AccountComponent } from './setting/account';
import { SettingComponent } from './setting/setting';
import { SettingMainComponent } from './setting/setting-main';
import { RegulationComponent } from './setting/regulation/regulation.component';
import { PrescriptionRecordRepository } from '../service/prescription-record.repository';
import { CameraService } from '../service/camera.service';
import { DeviceReadyService } from '../service/device-ready.service';
import { FileService } from '../service/file.service';
import { OnsenModule } from 'ngx-onsenui';
import { CDVFile } from '../pipe/cdvfile.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrderByPipe } from '../pipe/descending-order';

const components = [
    AppComponent,
    MainTabComponent,
    BrowserCameraComponent,
    HomeComponent,
    EditComponent,
    PreviewComponent,
    HomeMainComponent,
    AboutComponent,
    AccountComponent,
    SettingComponent,
    SettingMainComponent,
    RegulationComponent,
];

@NgModule({
    entryComponents: components,
    declarations: [
        ...components,
        OrderByPipe,
        CDVFile,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        OnsenModule,
    ],
    providers: [
        PrescriptionRecordRepository,
        CameraService,
        DeviceReadyService,
        FileService,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
