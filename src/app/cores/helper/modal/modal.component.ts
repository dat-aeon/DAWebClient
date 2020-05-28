import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() my_modal_title: any;
  @Input() my_modal_content: any;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
  ) { }

  ngOnInit() {
    
  }
  click(){
    this.activeModal.dismiss('Cross click'),
    this.router.navigate(['/login/']);
  }
}
