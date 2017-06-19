import { Alert } from '../models/alert';

export const ALERTS: Alert[] = [
                          {id: "001", title: "test", status: "Open", type:"test", priority:"low", incidentID:"aaa", eventID:"event", 
                              building:"aaa", body:"testbody", cameraID:"c001", updatedBy:"testupdated", timestamp:"2017-05-15", image:"testimage"},
                          {id: "002", title: "test02", status: "Assigned", type:"test", priority:"low", incidentID:"aaa", eventID:"event", 
                              building:"aaa", body:"testbody", cameraID:"c001", updatedBy:"testupdated", timestamp:"2017-05-15", image:"testimage"}                 
                    ];


 