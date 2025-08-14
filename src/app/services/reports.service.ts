import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({providedIn: 'root'})
export class ReportsService {

   private apiURL = 'http://localhost:5101/api';

   constructor(private http: HttpClient) {}

   retrieveReports(userID: number): Observable<any>{
       const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        })

      return this.http.get(this.apiURL + `/reports/get?userID=${userID}`, {headers, observe: 'response'}); 

   }

   aggregatedReports_1(): Observable<any>{
       const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        })

      return this.http.get(this.apiURL + '/reports/summaryreports-1', {headers, observe: 'response'}); 
   }

   aggregatedReports_2(): Observable<any>{
       const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        })

      return this.http.get(this.apiURL + '/reports/summaryreports-2', {headers, observe: 'response'}); 
   }

}