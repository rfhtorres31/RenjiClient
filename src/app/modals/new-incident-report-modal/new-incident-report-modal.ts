import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewReport } from '../../interfaces/report';

@Component({
  selector: 'app-new-incident-report-modal',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-incident-report-modal.html',
  styleUrls: ['./new-incident-report-modal.css']
})
export class NewIncidentReportModal implements OnInit{

  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<NewReport>();

  myForm! : FormGroup;

  constructor(private fb: FormBuilder){}
  
  onClose(): void {
    this.close.emit(); // This will send signal to its callback function counterpart on the parents component (closeModal()) to run
  }

  ngOnInit(): void {
            this.myForm = this.fb.group({
            title: ['', [Validators.required]],
            accidentTypeId: ['', [Validators.required]],
            description: ['', Validators.required],
            location: ['', Validators.required],         
        });    
  }
   
  onSubmit(event:Event) {
    console.log(this.myForm.valid);
    if (this.myForm.valid){
      event.preventDefault();
      this.formSubmit.emit(this.myForm.value as NewReport);
      this.myForm.reset();
      this.onClose(); // close the modal after submit
    }
  }



}
