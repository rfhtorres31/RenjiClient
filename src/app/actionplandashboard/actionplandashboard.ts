import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenu } from '../shared/nav-menu/nav-menu';
import { NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import { UserService } from '../services/user.service';
import { ActionPlanService } from '../services/action.service';
import { Router } from '@angular/router';
import { ChartOptions, ChartType, ChartData, Chart  } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
@Component({
  selector: 'app-actionplandashboard',
  imports: [CommonModule,
           NavMenu,
           NgxSpinnerModule,
           BaseChartDirective    
  ],
  templateUrl: './actionplandashboard.html',
  styleUrl: './actionplandashboard.css'
})

export class Actionplandashboard implements OnInit {

  userFullName: string = "";
  averageDaysOverDue: string = "";
  percentageOnTime: string = "";
  noOfActivePlans: string = "";
  @ViewChild(BaseChartDirective) donutChart?: BaseChartDirective;

  //=============== Initialize Donut chart ========================//
    public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
    maintainAspectRatio: false,
    layout: {
        padding: {
          top: 30   // adds 30px padding on top
        }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
            usePointStyle: true, // optional: make legend circles
            padding: 20
        }
      },
      tooltip: {
        enabled: true
      },
      datalabels: {   // 👈 plugin settings
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value, ctx) => {
            const dataset = ctx.chart.data.datasets[0].data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return percentage + '%'; // 👈 show % on slices
          }
    }
    }
  };

  public doughnutChartLabels: string[] = ['Completed Plans', 'Pending Plans'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [], backgroundColor: ['#FF6384', '#36A2EB'] }
    ]
  };

  public doughnutChartType: 'doughnut' = 'doughnut';
  //===============================================================//

  constructor(private spinner: NgxSpinnerService,
              private actionService: ActionPlanService,
              private router: Router,
              private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  

  loadData(): void {
        this.spinner.show();
        
        this.userService.userName$.subscribe(name => {
              this.userFullName = name?.toUpperCase() ?? "";
        });

        this.spinner.show();
        
       //================  API call for KPI ==================//
        this.actionService.retrieveActionPlanKPI().subscribe({
            
            next: (res)=>{
                  
                if (res.ok){
                    this.spinner.hide();
                    this.averageDaysOverDue = res.body.details.averageDueDays;
                    this.percentageOnTime = res.body.details.percentageOnTime;
                    this.noOfActivePlans = res.body.details.noOfActivePlans;
                    console.log(res.body.details);

                }
            },

            error: (err)=>{
                console.error(err);
                if(err.status == 401){
                  this.router.navigate(['login']);
                }
            }
  
        });
    // ====================================================== //

    // =========== API call for chart ======================= //
       this.actionService.retrieveActionPlanChart().subscribe({
            
            next: (res)=>{
                  
                if (res.ok){
                    this.spinner.hide();
                    var donutChartArray = res.body.details.donutChart;
                    this.doughnutChartData.datasets[0].data = [...donutChartArray];
                    this.donutChart?.update(); // Update the donut chart after new array values
                }
            },

            error: (err)=>{
                console.error(err);
                if(err.status == 401){
                  this.router.navigate(['login']);
                }
            }
  
        });
    // ====================================================== //




  }



}
