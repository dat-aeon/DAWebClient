import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/cores/services/auth.service';
import { DataService } from 'src/app/cores/helper/data.service';

@Component({
  selector: 'app-emergency-contact-detail',
  templateUrl: './emergency-contact-detail.component.html',
  styleUrls: ['./emergency-contact-detail.component.css']
})

export class EmergencyContactDetailComponent implements OnInit {

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

  ngOnInit() {
    this.authService.refreshToken();
    this.loadApplicationInfo();
  }

  loadApplicationInfo() {
    this.dataService.getApplicationInfoDetail(this.currentUser.data.access_token, this.id).subscribe( 
      (res: any) => {
        if(res.status === 'SUCCESS' && res.data !== null) {
          this.appInfo = res.data.emergencyContactInfoDto;
        }
      }
    );
  }

}
