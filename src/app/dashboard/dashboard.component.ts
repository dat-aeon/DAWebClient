import { Component, OnInit } from '@angular/core';
import { AuthService } from '../cores/services/auth.service';
import { User } from '../cores/models/user';
import { DataService } from '../cores/helper/data.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: any = User;
  dashboardData: any = {};
  modalOptions:NgbModalOptions;
  innerHeight: number;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { 

    this.modalOptions = { backdrop:'static', backdropClass:'customBackdrop' }
    this.authService.currentUser.subscribe( (user) => {
      this.currentUser = user;
    });

  }

  ngOnInit() {

    document.getElementById("row").style.minHeight = window.innerHeight + 'px';

    this.authService.refreshToken();
    this.dataService.getApplicationDashboardInfo(this.currentUser.data.access_token, this.currentUser.data.userInformationResDto.customerId).subscribe( 
      (res: any) => { this.dashboardData = res.data; },
      (error: any) => {
        if(error.status === 500 || error.status === 400 || error.status === 0) {
          this.modalService.open(ModalComponent);
        }
      }
    );
  }

}
