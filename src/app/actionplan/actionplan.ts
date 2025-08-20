import { Component, OnInit } from '@angular/core';
import { NavMenu } from '../shared/nav-menu/nav-menu';
import { UserService } from '../services/user.service';
import { NgxSpinnerService} from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgGridModule } from 'ag-grid-angular';
import { ActionPlanService } from '../services/action.service';

@Component({
  selector: 'app-actionplan',
  imports: [NavMenu, 
            NgxSpinnerModule, 
            AgGridModule
       
  ],
  templateUrl: './actionplan.html',
  styleUrl: './actionplan.css'
})
export class Actionplan implements OnInit{
   
   userFullName: string = "";
   userId: string = "";

   // ======================= Action Plan Grid ================================= // 
      columnDefs = [
      { 
        headerName: 'No', 
        valueGetter: (params:any) => params.node.rowIndex + 1, 
        width: 80,
        sortable: false,
        filter: false
      },
      { field: 'ActionDetail', headerName: 'Action Detail', sortable: true, filter: true },
      { field: 'IncidentReportTitle', headerName: 'Incident Report Title', sortable: true, filter: true },
      { field: 'Location', headerName: 'Location', sortable: true, filter: true },
      { field: 'Priority', headerName: 'Priority', sortable: true, filter: true },
      { field: 'ReportedDate', headerName: 'Reported Date', sortable: true, filter: true, valueFormatter: (params:any) => {
            if (!params.value) return '';
            return new Date(params.value).toLocaleString(); 
      }},
      { field: 'ActionType', headerName: 'Action Type', sortable: true, filter: true },
      { field: 'CreatedAt', headerName: 'Created At', sortable: true, filter: true,  valueFormatter: (params:any) => {
            if (!params.value) return '';
            return new Date(params.value).toLocaleString(); 
      }},
      { field: 'MaintenanceTeam', headerName: 'Maintenance Staff', sortable: true, filter: true },
      { field: 'AccidentType', headerName: 'Accident Type', sortable: true, filter: true },
   ]
   
    defaultColDef = {
      minWidth: 120,
      resizable: true,
      autoHeaderHeight: true,
      cellStyle: { textAlign: 'center' }
    };

    onGridReady(params: any) {
      setTimeout(() => {
        params.columnApi.autoSizeAllColumns();
      }, 0);
    }

    rowData: any[] = [];
   // ========================================================================== //

   constructor(private userService: UserService,
               private spinner: NgxSpinnerService,
               private actionPlanService: ActionPlanService
   ){}

   ngOnInit(): void {
     this.loadData();
   }

     loadData() : void {
        this.spinner.show();
        
        this.userService.userName$.subscribe(name => {
              this.userFullName = name?.toUpperCase() ?? "";
        });
        

        // Retrieve Action Plan Records
        this.actionPlanService.retrieveActionPlan().subscribe({
          next: (res)=>{
              this.spinner.show();
              if (res.ok){
                 console.log(res.body.details);
                 this.rowData = res.body.details.data;                 
                 if(this.rowData.length > 0) {
                    this.spinner.hide();
                 }
              }

          },
          error: (err)=>{
               console.error(err);
          },
        })
        



   }
}
