import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Alert} from '../models/alert';
import {ALERTS} from './mock-alerts';

@Injectable()
export class AlertService{
    private alertsUrl = 'http://localhost:9081/commonservices-rest/webapi/v2/alerts';
    
    constructor(private http:Http){}

    //use local mock up alerts service
//    getAlerts(): Promise<Alert[]> {            
//            return Promise.resolve(ALERTS);            
//    }
    
    //use REST API alerts service
      getAlerts(): Promise<Alert[]>{
          return this.http.get(this.alertsUrl)
                  .toPromise()
                  .then(response => 
                          response.json() as Alert[])
                  .catch(this.handleError);
      }
      
      private handleError(error: any): Promise<any> {
          console.error('An error occurred', error); // for demo purposes only
          return Promise.reject(error.message || error);
        }
    
    getAlert(id: string): Promise<Alert> {
        return this.getAlerts()
                   .then(alerts => alerts.find(alert => alert.id === id));
    }
}