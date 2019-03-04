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
import { OnsenModule } from 'ngx-onsenui';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
  declarations: components,
  imports: [
    BrowserModule,
    AppRoutingModule,
    OnsenModule,
  ],
  providers: [
    PrescriptionRecordRepository,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
