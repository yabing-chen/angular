import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';



@Injectable()
export class SOSService{
    private sosRESTUrl = 'http://localhost:8080/commonservices-rest/webapi/v2/notification/sosAlert/';
    
    constructor(private http:Http){}

    //use local mock up alerts service
//    getAlerts(): Promise<Alert[]> {            
//            return Promise.resolve(ALERTS);            
//    }
    
    //use REST API alerts service
      create(sosTitle:string, sosText:string): Promise<string>{          
          var url = this.sosRESTUrl + sosTitle + "/" + sosText;
          var data
          return this.http.post(url, null, null)
                  .toPromise()
                  .then((response) => response.json().id)
                  .catch(this.handleError);
          
          //response.json() as string         
      }
      
      private handleError(error: any): Promise<any> {
          console.error('An error occurred', error); // for demo purposes only
          return Promise.reject(error.message || error);
        }    
   
}