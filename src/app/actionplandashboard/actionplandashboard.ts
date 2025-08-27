import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenu } from '../shared/nav-menu/nav-menu';
import { NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import { UserService } from '../services/user.service';
import { ActionPlanService } from '../services/action.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actionplandashboard',
  imports: [CommonModule,
           NavMenu,
           NgxSpinnerModule,
  ],
  templateUrl: './actionplandashboard.html',
  styleUrl: './actionplandashboard.css'
})
export class Actionplandashboard implements OnInit {
  
  userFullName: string = "";

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

        this.actionService.retrieveActionPLanKPI().subscribe({
            
            next: (res)=>{
               console.log(res);
            },

            error: (err)=>{
                console.error(err);
                if(err.status == 401){
                  this.router.navigate(['login']);
                }
            }
  
        });


  }



}
