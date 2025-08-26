import { Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-status-modal',
  imports: [MatIconModule, CommonModule],
  templateUrl: './change-status-modal.html',
  styleUrl: './change-status-modal.css'
})
export class ChangeStatusModal {
  
  @Input() show = false;
  @Input() actionDetailTitle = "";
  @Input() Status = "";
  @Output() close = new EventEmitter<boolean>();

  constructor() {}
  
  onClose(): void {
     this.close.emit();
  }
  

}
