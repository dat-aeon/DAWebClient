import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/cores/services/auth.service';
import { DataService } from 'src/app/cores/helper/data.service';

@Component({
  selector: 'app-application-data',
  templateUrl: './application-data.component.html',
  styleUrls: ['./application-data.component.css']
})
export class ApplicationDataComponent implements OnInit {

  id: string;
  currentUser: any;
  appInfo: any = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
  ) { 

    const navigation = this.router.getCurrentNavigation();

    if(navigation.extras.state) {
      this.id = navigation.extras.state.orderId;
    } else {
      this.router.navigateByUrl('/inquery');
    }

    this.authService.currentUser.subscribe( (res: any) => {
      this.currentUser = res.data;
    });
  }

  ngOnInit() {
    this.authService.refreshToken();
    this.loadApplicationInfo();
  }

  loadApplicationInfo() {
    this.dataService.getApplicationInfoDetail(this.currentUser.access_token, this.id).subscribe( (res: any) => {

      if(res.status === 'SUCCESS' && res.data !== null ) { 
        this.appInfo = res.data;
      

      }
    });
  }

}
