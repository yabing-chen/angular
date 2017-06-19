import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import { Location} from '@angular/common';

import { Alert } from './models/alert';
import {AlertService } from './services/alert.service';

import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'alert-detail',  
  templateUrl: './html/alert.detail.html',
  styleUrls: ['./css/alert.detail.css']
  
})

export class AlertDetail implements OnInit{   
    @Input() alert: Alert;

    constructor(       
        private alertService: AlertService,
        private route: ActivatedRoute,
        private location: Location
        ) { }    
    
    ngOnInit():void{
        if(!this.alert){
            this.alert = new Alert();
////            this.alert.id = "test";
        }
        console.info(this.alert);
        
        this.route.params
            .switchMap((params: Params) => this.alertService.getAlert(params['id']))
            .subscribe(alert => this.alert = alert);
       
       
    }
    
    goBack(): void{
        this.location.back();
    }
    
    onSelect(id:string): void{
        console.info(id);
    }
   
}
