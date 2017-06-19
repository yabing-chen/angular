import { Component, OnInit } from '@angular/core';

import { Alert } from './models/alert';
import {AlertService } from './services/alert.service';
import {CustomTypeFilter} from './CustomTypeFilter';


@Component({
  selector: 'app-alerts',  
  templateUrl: './html/alerts.component.html',
  styleUrls: ['./css/alert.component.css']
})

export class AlertsComponent implements OnInit{   
    alerts: Alert[] = [];
    filter: Alert = new Alert();

    constructor(       
        private alertService: AlertService) { }
    
    getAlerts(): void{
        this.alertService.getAlerts().then(
                alerts => 
                this.alerts = alerts);       
    }
    
    ngOnInit(): void{
        this.getAlerts();        
        console.log(this.alerts);
    }
    
    onSelect(alert: Alert): void{        
        console.info(alert.id);
    }
}
