import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {AlertModule} from 'ng2-bootstrap/ng2-bootstrap';
import {CustomTypeFilter} from './CustomTypeFilter'


import { AppComponent } from './app.component';
import { AlertsComponent } from './alerts.component';
import { AlertDetail } from './alert.detail';
import { CreateIncidentComponent } from './createIncident.component';

import { SOSComponent } from './sos.component';

import { VideoStreamComponent } from './videoStreaming.component';

import { AlertService }         from './services/alert.service';
import { SOSService }         from './services/sos.service';

import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent,
    CreateIncidentComponent,
    CustomTypeFilter,  
    AlertDetail,
    SOSComponent,
    VideoStreamComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,    
    AlertModule.forRoot(),
    RouterModule.forRoot([
                          {
                              path: 'alerts',
                              component: AlertsComponent
                          },
                          {
                              path: 'createIncident',
                              component: CreateIncidentComponent
                          },
                          {
                              path: 'alertDetail/:id',
                              component: AlertDetail
                          },
                          {
                              path: 'createSOS',
                              component: SOSComponent
                          },
                          {
                              path: 'streamingVideo',
                              component: VideoStreamComponent
                          }
                    ])
  ],
  providers: [AlertService, SOSService],
  bootstrap: [AppComponent]
})
export class AppModule { }
