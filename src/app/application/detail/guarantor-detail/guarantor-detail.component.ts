import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/cores/services/auth.service';
import { DataService } from 'src/app/cores/helper/data.service';
import { NumeralPipe } from 'ngx-numeral';

@Component({
  selector: 'app-guarantor-detail',
  templateUrl: './guarantor-detail.component.html',
  styleUrls: ['./guarantor-detail.component.css']
})

export class GuarantorDetailComponent implements OnInit {

  id: any;
  appInfo: any = {};
  currentUser: any;

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

    this.authService.currentUser.subscribe( (user: any) => { 
      this.currentUser = user; 
    });
  }

  private loadApplicationInfo() {
    this.dataService.getApplicationInfoDetail(this.currentUser.data.access_token, this.id).subscribe((res: any) => {

      if(res.status === 'SUCCESS' && res.data !== null) {
        this.appInfo = res.data.guarantorInfoDto;
        this.appInfo.monthlyBasicIncome = new NumeralPipe(res.data.guarantorInfoDto.monthlyBasicIncome).format('0,0');
        this.appInfo.totalIncome = new NumeralPipe(res.data.guarantorInfoDto.totalIncome).format('0,0');
      }

    });
  }

  ngOnInit() {
    this.authService.refreshToken();
    this.loadApplicationInfo();
  }
}
