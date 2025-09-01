import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage} from '@angular/common';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { NgxSpinnerService} from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserService } from '../services/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, NgxSpinnerModule, MatIconModule, NgOptimizedImage],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
    
    myForm!: FormGroup;

    constructor(private fb: FormBuilder, 
                private httpService: HttpService,
                private userService: UserService,
                private router: Router,
                private spinner: NgxSpinnerService) {}


    ngOnInit(): void {
        this.myForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });                  
    }


    onSubmit(): void {
        console.log("Executed");
        if (this.myForm.valid) {
           this.spinner.show(); // Show the loader
           var loginRequest = this.httpService.loginUser(this.myForm.value); 

           loginRequest.subscribe({
              // All 200 status codes are catched by next handler
              next: (response) => {
                 if (response.status == 200){
                    console.log("Login Successful");
                    console.log(response);
                    const token: string = response.body.details.token; 
                    const userFullName: string = response.body.details.name;
                    const userID: string = response.body.details.userID;
                    localStorage.setItem('token', token);

                    console.log(userFullName);

                    this.userService.setUserName(userFullName);
                    this.userService.setUserId(userID);

                    this.router.navigate(['/dashboard']);
                    this.spinner.hide();
                 }
              },
              // Error status codes (400's 500's) are catched by the error handler
              error: (err) => {
                  this.spinner.hide();
                  console.error(err);
              }
           });
        }
    }




}
