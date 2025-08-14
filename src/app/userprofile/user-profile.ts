import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import { ChartConfiguration, ChartOptions, ChartData, ChartType, Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ReportsService } from '../services/reports.service';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ViewChild } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ModuleRegistry.registerModules([AllCommunityModule]);
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);
@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, 
            NewIncidentReportModal, 
            NgxSpinnerModule, 
            MatIconModule, 
            BaseChartDirective,
            AgGridModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {

  isMenuOpen: boolean = true;
  showModal: boolean = false;
  userFullName: string = "";
  userId: string = "";
  chartYLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  barCharData: { x: string; y: number }[] = [];
  noOfOpenReports: number = 0;
  noOfInProgressReports: number = 0;
  noOfResolvedReports: number = 0;
    
   // ======================= Incident Report Grid ================================= // 
   columnDefs = [
      { field: 'id', headerName: 'ID', sortable: true, filter: true },
      { field: 'type', headerName: 'Type', sortable: true, filter: true },
      { field: 'location', headerName: 'Location', sortable: true, filter: true },
      { field: 'reportedDate', headerName: 'Reported Date', sortable: true, filter: true },
      { field: 'status', headerName: 'Status', sortable: true, filter: true },
   ]
   
    defaultColDef = {
      flex: 1,
      minWidth: 100,
      resizable: true,
    };

    rowData: any[] = [];

    
 // ============================================================================== //

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective; // This gives an access to the canvas bar chart on the HTML Template

 //==================== Bar Chart (Number of Accidents Per Type) ========================= //
  public barChartData: ChartConfiguration<'bar', { x: string; y: number }[]>['data'] = {
      datasets: [
        {
          label: 'Count',
          data: [],
          backgroundColor: 'rgba(54,162,235,0.7)',
          borderColor: 'blue',
          borderWidth: 1,
        }
      ]
    };

  // Chart options with a time scale
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        title: { display: true, text: 'Accident Type' }
      },
      y: {
          beginAtZero: true,
          title: { display: true, text: 'Count' }
      }
    },
    plugins: {
      legend: { position: 'top' },
      datalabels: { display: false }
    }
  };

  pieChartType: 'pie' = 'pie';
 // =================================================================================== //

 //==================== Pie Chart (Number of Accidents Per Type) ========================= //
   pieChartData!: ChartData<'pie', number[], string | string[]>;

   pieChartOptions: ChartOptions<'pie'> = {
         responsive: true,
         maintainAspectRatio: false,
         layout: {
           padding: 10 // extra space so pie isn't cramped
         },
         plugins: {
         legend: { position: 'right',
                    labels: {
              font: {
                size: 14 // smaller text size (default is ~12–14)
              },
              boxWidth: 12, // size of the color box
              padding: 5 // space between legend items
            }
          }, // controls the legend (color labels)
          tooltip: {                   // controls the hover info
            callbacks: {
              label: (context) => {
                const dataset = context.dataset.data; // array of values
                const total = dataset.reduce((sum, value) => sum + value, 0);
                const value = context.parsed; // current segment's value
                const percentage = ((value / total) * 100).toFixed(2);

                return `${context.label}, ${percentage}%`;
              }
            }
          },
         datalabels: {
           color: '#ffffffff',
           font: {
             weight: 'bold',
             size: 12
           },
           align: 'end',
           offset: 10,
           formatter: (value, context) => {
               const data = context.chart.data.datasets[0].data as number[];
               const total = data.reduce((sum, val) => sum + val, 0);
               const percentage = Math.ceil((value / total) * 100) + '%';
               return percentage;
           }
        }
       },
     }

   

 // ====================================================================================== //

  constructor(private router: Router,
              private userService: UserService,
              private reportsService: ReportsService,
              private spinner: NgxSpinnerService,
              private httpService: HttpService,){}
  
  ngOnInit(): void {
    this.loadData();
  }

  
   loadData() : void {
        this.spinner.show();
        
        this.userService.userName$.subscribe(name => {
              this.userFullName = name?.toUpperCase() ?? "";
        });

        this.userService.userId$.subscribe(userId => {
              this.userId = userId ?? "";
              console.log(this.userId);
        });
        
        const userID = localStorage.getItem('userId') ?? "0";
        
        // Retrieve Reports Summary 
        this.reportsService.retrieveReports(parseInt(userID)).subscribe({
          next: (response) => {

              if (response.ok){
                this.spinner.hide();
                this.rowData = response.body.details.data;
                console.log(this.rowData);
              }


              for (let i=0; i<this.rowData.length; i++){
                  const obj = this.rowData[i];

                  if (obj.status === 'Open'){
                      this.noOfOpenReports = this.noOfOpenReports + 1;
                  }   
                  
                  if (obj.status === 'In Progress'){
                    this.noOfInProgressReports = this.noOfInProgressReports + 1;
                  }

                  if (obj.status === 'Resolved'){
                    this.noOfResolvedReports = this.noOfResolvedReports + 1;
                  }
              }            
          },
          error: (err) => {
              console.error(err);
          }
        })

        // Retrieve Aggregate Reports for Bar Chart
        this.reportsService.aggregatedReports_1().subscribe({
          next: (response) => {
              if (response.ok){
                this.spinner.hide();
                const barChartData = response.body.details.data1;
                const pieChartData = response.body.details.data2;
                
                const pieLabels = pieChartData.map((d: any) => d.label);
                const pieValue = pieChartData.map((d:any) => d.value);
                console.log(pieLabels);

                this.barChartData.datasets[0].data = barChartData;

                this.pieChartData = {
                  labels: pieLabels,
                  datasets: [{
                    data: pieValue,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FFCE56', '#56ff7bff', '#4f3800ff'],
                 }]
                }


                this.chart?.update()
              }         
          },
          error: (err) => {
              console.error(err);
          }
        });

   }

  getRandomColor(): string {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}   
  refresh(): void  {
     this.loadData() 
  }

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
              this.refresh();
              this.spinner.hide();
            }
        },

        error: (err)=>{
          console.error(err);
        } 
    })
    

  }
}
