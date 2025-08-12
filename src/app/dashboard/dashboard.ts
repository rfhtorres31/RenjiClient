import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule} from '@angular/common';
import { NewIncidentReportModal } from '../modals/new-incident-report-modal/new-incident-report-modal';
import { NewReport } from '../interfaces/report';
import { NgxSpinnerService} from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpService } from '../services/http.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NewIncidentReportModal, NgxSpinnerModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  isMenuOpen: boolean = true;
  showModal: boolean = false;

  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private httpService: HttpService,){}
  
  ngOnInit(): void {
     console.log(this.isMenuOpen);  
  }

  toggleMenu(): void {
     this.isMenuOpen = !this.isMenuOpen;
     console.log(this.isMenuOpen);
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
