import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/cores/services/auth.service';
import { User } from '../../cores/models/user';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-edit-preview',
  templateUrl: './profile-edit-preview.component.html',
  styleUrls: ['./profile-edit-preview.component.css']
})

export class ProfileEditPreviewComponent implements OnInit {

  currentUser: any = User;
  dobFormat: any;
  profileEditData: any = {};
  customerSecurityQuestionDtoList: any = [];
  modalOptions: any;
  hideReject: boolean= false;

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private translateService: TranslateService
  ) { 

    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }

  }

  ngOnInit() {
    this.authService.refreshToken();
    this.loadData();
    this.changeLanaguage();
  }

  loadData() {

    this.authService.currentUser.subscribe( (res: any) => {
      this.currentUser = res;

      const d = new Date(this.currentUser.data.userInformationResDto.dateOfBirth);
      const yymmdd = {year: d.getFullYear(), month: (d.getUTCMonth()+1), day: d.getDate()};

      this.currentUser.data.userInformationResDto.dateOfBirth = yymmdd.year + '-' + yymmdd.month + '-' + yymmdd.day;
    });

    this.authService.getCustomerInfoEditReq(this.currentUser.data.access_token, this.currentUser.data.userInformationResDto.customerId).subscribe( 
      (res: any) => {
        if(res.data && res.status === 'SUCCESS') {
          this.profileEditData = res.data;

          const d = new Date(res.data.dob);
          const yymmdd = {year: d.getFullYear(), month: (d.getUTCMonth()+1), day: d.getDate()};

          this.profileEditData.dob = yymmdd.year + '-' + yymmdd.month + '-' + yymmdd.day;
          if(res.data.status===3){
            this.hideReject=true;

          }
        }
      },

    (error: any) => {
        if(error) {
         this.modalService.open(ModalComponent);
        }
      }
    );

    this.authService.getCustomerSecurityQuestionList(this.currentUser.data.access_token, this.currentUser.data.userInformationResDto.customerId).subscribe( 
      (res: any) => {
        this.customerSecurityQuestionDtoList = res.data.customerSecurityQuestionDtoList;

        if(this.translateService.store.currentLang === 'mm') {
          for(let x=0; x< this.customerSecurityQuestionDtoList.length; x++) {
            this.customerSecurityQuestionDtoList[x].selected = this.customerSecurityQuestionDtoList[x].questionMyan;
          }
        }

        if(this.translateService.store.currentLang === 'en') {
          for(let x=0; x< this.customerSecurityQuestionDtoList.length; x++) {
            this.customerSecurityQuestionDtoList[x].selected = this.customerSecurityQuestionDtoList[x].questionEng;
          }
        }
      },

      (error: any) => {
        if(error) {
          this.modalService.open(ModalComponent);
        }
      }
    );
  }

  changeLanaguage() {
    this.translateService.onLangChange.subscribe( (res: any) => {
      if(res.lang === 'mm') {
       for(let x=0; x < this.customerSecurityQuestionDtoList.length; x++) {
         this.customerSecurityQuestionDtoList[x].selected = this.customerSecurityQuestionDtoList[x].questionMyan;
       }
      }
 
      if(res.lang === 'en') {
       for(let x=0; x < this.customerSecurityQuestionDtoList.length; x++) {
         this.customerSecurityQuestionDtoList[x].selected = this.customerSecurityQuestionDtoList[x].questionEng;
       }
      }
    }); 
   }

}
