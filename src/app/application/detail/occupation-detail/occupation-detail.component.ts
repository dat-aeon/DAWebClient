import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/cores/services/auth.service';
import { DataService } from 'src/app/cores/helper/data.service';
import { NumeralPipe } from 'ngx-numeral';

@Component({
  selector: 'app-occupation-detail',
  templateUrl: './occupation-detail.component.html',
  styleUrls: ['./occupation-detail.component.css']
})
export class OccupationDetailComponent implements OnInit {

  currentUser: any;
  id: string;
  appInfo: any = {};

  constructor(
    private router: Router,
    private authService: AuthService,
    private dataService: DataService
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
    this.dataService.getApplicationInfoDetail(this.currentUser.access_token, this.id).subscribe( 
      (res: any) => {
        if(res.data.applicantCompanyInfoDto !== null) {
          this.appInfo = res.data.applicantCompanyInfoDto; 
          this.appInfo.totalIncome = new NumeralPipe(res.data.applicantCompanyInfoDto.totalIncome).format('0,0'); 
          this.appInfo.monthlyBasicIncome = new NumeralPipe(res.data.applicantCompanyInfoDto.monthlyBasicIncome).format('0,0');
          this.appInfo.otherIncome = new NumeralPipe(res.data.applicantCompanyInfoDto.otherIncome).format('0,0');
        }
      });
  }
  
}
