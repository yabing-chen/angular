//declare var getAllCameras: any;
//declare var requestAllStreams: any;
//declare var connect: any;
//declare var loading: any;
//
//declare var liveMessage: any;
//
//declare var login: any;

import { Component, OnInit } from '@angular/core';


import {SOSService } from './services/sos.service';
import {CustomTypeFilter} from './CustomTypeFilter';



//import '../js/security/aes.js'
//
//import '../js/security/base64.js'
//import '../js/security/BigInt.js'
//import '../js/security/sha256.js'
//import '../js/security/DiffieHellman.js'
//
//
//import '../js/VideoConnectionItem.js'
//
//
//
//import '../js/commandChannel.js'
//import '../js/videoChannel.js'
//
//
//import '../js/connect.js'
//import '../js/liveMessage.js'
//import '../js/login.js'
//import '../js/getAllCameras.js'
//import '../js/requestStream.js'
//import '../js/requestAllStreams.js'
//import '../js/requestFrames.js'
//
//import '../js/main.js'

@Component({
  selector: 'app-alerts',  
  templateUrl: './html/videoStreaming.component.html',
  styleUrls: ['./css/videoStreaming.component.css']
})

export class VideoStreamComponent implements OnInit{
    
    show:boolean
    
    ngOnInit(): void{
//        this.show = true;    
//        setTimeout(function(){this.show = false;}, 10000);
    }    
    
}
