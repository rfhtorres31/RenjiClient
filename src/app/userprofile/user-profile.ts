import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule} from '@angular/common';
import { NewIncidentReportModal } from '../modals/new-incident-report-modal/new-incident-report-modal';
import { NewReport } from '../interfaces/report';
import { NgxSpinnerService} from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpService } from '../services/http.service';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../services/user.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ReportsService } from '../services/reports.service';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, NewIncidentReportModal, NgxSpinnerModule, MatIconModule, BaseChartDirective],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {

  isMenuOpen: boolean = true;
  showModal: boolean = false;
  userFullName: string = "";
  userId: string = "";
  chartYLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  incidentsArr: Array<any> = [];

  constructor(private router: Router,
              private userService: UserService,
              private reportsService: ReportsService,
              private spinner: NgxSpinnerService,
              private httpService: HttpService,){}
  
  ngOnInit(): void {
      this.spinner.show();

      this.userService.userName$.subscribe(name => {
            this.userFullName = name?.toUpperCase() ?? "";
      });

      this.userService.userId$.subscribe(userId => {
            this.userId = userId ?? "";
            console.log(this.userId);
      });
      
      const userID = localStorage.getItem('userId') ?? "0";

      this.reportsService.retrieveReports(parseInt(userID)).subscribe({
         next: (response) => {
            if (response.ok){
              this.spinner.hide();
              this.incidentsArr = response.body.details.data;
              console.log(this.incidentsArr);
            }
            
         },
         error: (err) => {
            console.error(err);
         }
      })

  }
  
   // Setting up the Chart
  public lineChartData: ChartConfiguration<'line', { x: Date; y: number }[]>['data'] = {
      datasets: [
        {
          label: 'Temperature',
          data: [
            { x: new Date('2025-08-01'), y: 28 },
            { x: new Date('2025-08-02'), y: 31 },
            { x: new Date('2025-08-03'), y: 29 },
            { x: new Date('2025-08-04'), y: 32 },
            { x: new Date('2025-08-05'), y: 30 }
          ],
          borderColor: 'blue',
          backgroundColor: 'rgba(54,162,235,0.3)',
          fill: true,
          tension: 0.4
        }
      ]
    };

  // Chart options with a time scale
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      }
    },
    plugins: {
      legend: { position: 'top' }
    }
  };







  toggleMenu(): void {
     this.isMenuOpen = !this.isMenuOpen;
  }
  
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  reportSubmit(newReport:NewReport){
    this.spinner.show();
    console.log(newReport);

    var reportSubmit = this.httpService.submitNewReport(newReport); // Observable

    reportSubmit.subscribe({
        next: (response)=>{
            if (response.status === 200){
              this.spinner.hide();
            }
        },

        error: (err)=>{
          console.error(err);
        } 
    })
    

  }
}
