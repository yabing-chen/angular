import { Component, OnInit } from '@angular/core';


import {SOSService } from './services/sos.service';
import {CustomTypeFilter} from './CustomTypeFilter';


@Component({
  selector: 'app-alerts',  
  templateUrl: './html/sos.component.html',
  styleUrls: ['./css/sos.component.css']
})

export class SOSComponent implements OnInit{
    sosTitle: string;
    sosText: string;
    status: string;
    show:boolean
    
    
    constructor(       
        private sosService: SOSService) { }
    
    create(): void{               
        this.show = true;        
        
        this.status='';
        this.sosService.create(this.sosTitle, this.sosText).then((data) => { console.log(data); 
                                                                this.status = data;
                                                               this.show=false});        
    }
    
    ngOnInit(): void{
     
    }    
    
}
