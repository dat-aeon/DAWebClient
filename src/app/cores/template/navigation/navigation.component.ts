import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../helper/data.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {

  loggedin: boolean;
  clock: any;
  currentUser: any = User;
  applicationType: any;
  activeProfile: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) { 
    
    this.authService.currentUserObject.subscribe((state: any) => {
      if(state === null) {
        this.activeProfile = false;
      } else {
        this.activeProfile = true;
      }
    });


    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;

      if(this.currentUser) {
        this.authService.getUserInformation(this.currentUser.data.access_token, this.currentUser.data.userInformationResDto.phoneNo).subscribe( (res: any) => {
          this.currentUser.data.userInformationResDto = res.data;
        });

        this.authService.getCustomerSecurityQuestionList(this.currentUser.data.access_token, this.currentUser.data.userInformationResDto.customerId).subscribe( (res: any) => {
          this.currentUser.customerSecurityQuestionDtoList = res.data.customerSecurityQuestionDtoList;
          this.currentUser.numOfAnsChar = res.data.numOfAnsChar;
          this.currentUser.numOfSecQues = res.data.numOfSecQues;
        });

        localStorage.setItem('user_info', JSON.stringify(this.currentUser));
      }
    });

  }

  ngOnInit() {
    setInterval(() => {
      this.clock = new Date();
   }, 1000);
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
}
