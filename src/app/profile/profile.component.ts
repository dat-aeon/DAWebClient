import { Component, OnInit } from '@angular/core';
import { AuthService } from '../cores/services/auth.service';
import { User } from '../cores/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { errorMessage, languageValidator, removeSpacesValidator, numLengthValidator, numOnlyValidator, phoneNumValidator } from '../cores/helper/validators';
import { Router } from '@angular/router';
import { DataService } from '../cores/helper/data.service';
import { TranslateService } from '@ngx-translate/core';
import { nrcFormat } from '../cores/configuration';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../cores/helper/modal/modal.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  duplicateNRC=false;
  hidePreviewButton: boolean=true;
  hideUpdateButton: boolean=true;
  title: string;
  body: string;
  currentUser: any = User;
  profileEditForm: FormGroup;
  customerSecurityQuestionDtoList: any = [];
  townshipCodeResDtoList: any;
  stateIdList: any;
  matchTownShip: any;
  nrcTypeList: any;
  editStatus: boolean;
  errorMsg: any;
  year: any;
  month: any;
  bday: any;
  modalOptions: any;
  submitted: boolean = false;
  loading: boolean = false;
  todayDate = new Date(Date.now());
  nowYear = this.todayDate.getFullYear();
  nowMonth = this.todayDate.getMonth();
  nowDay = this.todayDate.getDate();

  minDate = new Date((this.nowYear - 100), this.nowMonth, this.nowDay);
  maxDate = new Date((this.nowYear - 18), this.nowMonth, this.nowDay);

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private translateService: TranslateService,
    private modalService: NgbModal,
    private dialog: MatDialog,
  ) { 

    this.modalOptions = { backdrop:'static', backdropClass:'customBackdrop' }
    this.authService.currentUser.subscribe((user: any) => { this.currentUser = user; });
    this.dataService.getCustomerSecurityQuestionList(this.currentUser.data.access_token, this.currentUser.data.userInformationResDto.customerId).subscribe(
      (res: any) => {
        this.customerSecurityQuestionDtoList = res.data.customerSecurityQuestionDtoList;

        if(this.translateService.store.currentLang === 'mm') {
          for(let x=0; x < this.customerSecurityQuestionDtoList.length; x++) {
            this.customerSecurityQuestionDtoList[x].selected = this.customerSecurityQuestionDtoList[x].questionMyan;
          }
        }

        if(this.translateService.store.currentLang === 'en') {
          for(let x=0; x < this.customerSecurityQuestionDtoList.length; x++) {
            this.customerSecurityQuestionDtoList[x].selected = this.customerSecurityQuestionDtoList[x].questionEng;
          }
        }
      },

      (error: any) => {
        if(error.status === 500 || error.status === 400) { this.modalService.open(ModalComponent); }
      }
    );

    this.authService.getCustomerInfoEditReq(this.currentUser.data.access_token, this.currentUser.data.userInformationResDto.customerId).subscribe( 
      (res: any) => {
        console.log(this.hidePreviewButton);
          if(res.status === 'SUCCESS' && res.data !== null) {
            if(res.data.status===1){
              this.hidePreviewButton=false;
            this.hideUpdateButton=false;
          
          }
          if(res.data.status===3){
            this.hidePreviewButton=false;
            this.hideUpdateButton=true;
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

  ngOnInit() {
    this.authService.refreshToken();
    this.editStatus = true;
    this.errorMsg = errorMessage;

    this.profileEditFormBuilder();
    this.dataLoad();
    this.changeLanaguage();
  }

  public errorHandling = (control: string, error: string) => {
    return this.profileEditForm.controls[control].hasError(error);
  }

  public date(e: any) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.profileEditForm.get('dob').setValue(convertDate, { onlyself: true });
  }

  onSubmit() {
    this.submitted = true;
    if(this.profileEditForm.invalid) { return; }
    this.loading = true;

    const requestObject = {
      customerId: this.currentUser.data.userInformationResDto.customerId,
      name: this.f.username.value,
      dob: this.f.dob.value,
      nrcNo: this.f.nrcCode.value + '/' + this.f.nrcList.value + this.f.nrcType.value + this.f.nrcNo.value,
      phoneNo: this.f.phoneNo.value
    };

    this.authService.updateCustomerProfile(this.currentUser.data.access_token, requestObject).subscribe((result: any) => {
      if (result.status === 'FAILED') {

        this.loading = false;
     
        if (result.messageCode==="DUPLICATED_PHONE_NO"){
  
          this.f.phoneNo.setErrors({duplicatePhoneNo : true });
        }
        if (result.messageCode==="DUPLICATED_NRC_NO"){
  
          this.duplicateNRC=true;
          
        }

        return;
      }

        if(result.status === 'SUCCESS' && result.data === null) {
          this.router.navigate(['profile-edit-preview']);
        }
      },

      (error: any) => {
        if(error) {
          this.loading = false;
          this.modalService.open(ModalComponent);
        }
      }
    );
  }

  get f() { return this.profileEditForm.controls; }

  profileEditFormBuilder() {
    this.profileEditForm = this.fb.group({
      username: ['', [Validators.required, ]],
      dob: ['', [Validators.required]],
      nrcCode: [''],
      nrcList: [''],
      nrcType: [''],
      nrcNo: ['',[Validators.required, numOnlyValidator]],
      phoneNo: ['', [Validators.required, phoneNumValidator, numOnlyValidator]]
    });

    this.f.username.disable();
    this.f.dob.disable();
    this.f.nrcCode.disable();
    this.f.nrcList.disable();
    this.f.nrcType.disable();
    this.f.nrcNo.disable();
    this.f.phoneNo.disable();
  }

  dataLoad() {
    const nrcData = nrcFormat(this.currentUser.data.userInformationResDto.nrcNo);

    this.dataService.townshipCodeList().subscribe( (response: any) => {
      const rowStateId = [];

      for (const x of response.data.townshipCodeResDtoList) {
        rowStateId.push(x.stateId);
      }

      this.nrcTypeList = response.data.nrcTypeList;
      this.townshipCodeResDtoList = response.data.townshipCodeResDtoList;
      this.stateIdList = rowStateId;

      this.townshipCodeResDtoList.find( (key: any) => {
        if(Number(nrcData.no) === key.stateId) {
          this.matchTownShip = key.townshipCodeList;
        }
      });
    });

    this.f.username.setValue(this.currentUser.data.userInformationResDto.name);
    this.f.dob.setValue(new Date(this.currentUser.data.userInformationResDto.dateOfBirth));
    this.f.nrcCode.setValue(nrcData.no);
    this.f.nrcList.setValue(nrcData.list);
    this.f.nrcType.setValue(nrcData.type);
    this.f.nrcNo.setValue(nrcData.code);
    this.f.phoneNo.setValue(this.currentUser.data.userInformationResDto.phoneNo);
  }

  changeNrcState($event: any){
    this.duplicateNRC=false;
    this.townshipCodeResDtoList.find( (key: any) => {
      if(Number($event.value) === key.stateId) {
        this.matchTownShip = key.townshipCodeList;
        this.f.nrcList.setValue(key.townshipCodeList[0]);
      }
    });
  }

  editProfileStatus() {
    this.editStatus = false;
    Object.keys(this.f).forEach((key) => {
      this.f[key].enable();
    });
  }

  cancle() {
    this.editStatus = true;
    Object.keys(this.f).forEach((key) => {
      this.f[key].disable();
    });
  }

  changeLanaguage() {
   this.translateService.onLangChange.subscribe( (translateResult: any) => {
     if(translateResult.lang === 'mm') {
      for(let x=0; x < this.customerSecurityQuestionDtoList.length; x++) {
        this.customerSecurityQuestionDtoList[x].selected = this.customerSecurityQuestionDtoList[x].questionMyan;
      }
     }

     if(translateResult.lang === 'en') {
      for(let x=0; x < this.customerSecurityQuestionDtoList.length; x++) {
        this.customerSecurityQuestionDtoList[x].selected = this.customerSecurityQuestionDtoList[x].questionEng;
      }
     }
   }); 
  }
  previewEdit(){
    this.router.navigate(['profile-edit-preview']);
  }

}
