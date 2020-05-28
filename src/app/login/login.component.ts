
import { DashboardComponent } from './../dashboard/dashboard.component';
import { ModalComponent } from '../cores/helper/modal/modal.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from './../cores/helper/data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../cores/services/auth.service';
import { languageValidator, numLengthValidator, numOnlyValidator, errorMessage, phoneNumValidator } from '../cores/helper/validators';
import { first, filter } from 'rxjs/operators';

import { ApiService } from '../cores/services/api.service';
import { NewRegisterForm } from '../cores/models/newRegister';
export interface DialogData {
  title: string;
  body: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})

export class LoginComponent implements OnInit {
  duplicateNRC=false;
  newRegisterForm = new NewRegisterForm();
  loginForm: FormGroup;
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  errorMsg: any;
  townshipCodeResDtoList: any;
  closeResult: string;
  title: string;
  body: string;
  hideNewUser = false;
  stateIdList: any;
  nrcTypeList: any;
  townshipList: any;
  todayDate = new Date(Date.now());
  nowYear = this.todayDate.getFullYear();
  nowMonth = this.todayDate.getMonth();
  nowDay = this.todayDate.getDate();

  minDate = new Date((this.nowYear - 100), this.nowMonth, this.nowDay);
  maxDate = new Date((this.nowYear - 18), this.nowMonth, this.nowDay);

  constructor(

    private authService: AuthService,
    private api: ApiService,
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private dialog: MatDialog
  ) {

    localStorage.clear();
    if (this.authService.currentUserValue) { this.router.navigate(['dashboard']); }

  }

  ngOnInit() {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    this.errorMsg = errorMessage;
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, numLengthValidator(9, 11), numOnlyValidator, phoneNumValidator]],
      password: ['', [Validators.required, Validators.minLength(6), languageValidator]]

    });
    this.registerFormBuilder();
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.loading = true;

    if(this.loginForm.invalid) { 
      this.loading = false;
      return; 
    }

    this.authService.loginFromService(this.loginForm.value).subscribe((auth: any) => {

      if(auth.status === 'FAILED') {
        this.loginForm.controls.password.setErrors({ passwordDoesNotMatch: true });
      }

      if(auth.status === 'SUCCESS') {
        auth.data.password = this.loginForm.controls.password.value;
        localStorage.setItem('user_info', JSON.stringify(auth));
        this.authService.currentUserObject.next(auth);
        this.router.navigateByUrl('/dashboard');
      }
    });

    this.loading = false;
  }

  // openDialog(): void {
  //   this.dialog.open(DialogTemplate, {
  //     width: '350px',
  //     data: { title: this.title, body: this.body }
  //   });
  //  }

  public errorHandling = (control: string, error: string) => {
    return this.loginForm.controls[control].hasError(error);
  }

  showNewUser() {
    this.hideNewUser = this.hideNewUser ? false : true;
  }
  get ff() { return this.registerForm.controls; }
  registerFormBuilder() {


this.registerForm = this.fb.group({
  nrcCode: ['', [Validators.required, Validators.nullValidator]],
  nrcType: ['', [Validators.required, Validators.nullValidator]],

  dob:  ['', [Validators.required, Validators.nullValidator]] ,
  nrcTownshipCode: ['', [Validators.required, Validators.nullValidator]],
  nrcNo: ['', [Validators.required, Validators.minLength(6), numOnlyValidator]],
  phoneNo: ['', [Validators.required, numOnlyValidator, Validators.minLength(9), phoneNumValidator]],
});

this.dataService.townshipCodeList().subscribe((res: any) => {
 const rowStateId = [];
 for (const x of res.data.townshipCodeResDtoList) {
   rowStateId.push(x.stateId);
 }

 this.stateIdList = rowStateId;
 this.nrcTypeList = res.data.nrcTypeList;
 this.townshipCodeResDtoList = res.data.townshipCodeResDtoList;
 this.townshipList = this.townshipCodeResDtoList[0].townshipCodeList;
 this.ff.nrcTownshipCode.setValue(this.townshipList[0]);
 this.ff.nrcType.setValue(this.nrcTypeList[0]);
 this.ff.nrcCode.setValue(1);
}, (error: any) => {
  if (error) {
    this.modalService.open(ModalComponent);
  }
});
}
public changeNrcState($event: any) {
  this.duplicateNRC=false;
  const eventChangeValue = Number($event.value);

  this.townshipCodeResDtoList.filter( (res: any) => {
    if (res.stateId === eventChangeValue) {
      this.townshipList = res.townshipCodeList;
      this.ff.nrcTownshipCode.setValue(this.townshipList[0]);

    }
  });
}
  public errorHandlingForRegister = (control: string, error: string) => {
    return this.registerForm.controls[control].hasError(error);
  }
   public date(e: any) {
    let convertDate = new Date(e.target.value);
    this.registerForm.get('dob').setValue(convertDate, { onlyself: true });
  }
  register() {
    this.submitted = true;
    if (this.registerForm.invalid) { return; }
    this.loading = true;
    const checkMember = {
      dateOfBirth: this.ff.dob.value,
    nrcNo: this.ff.nrcCode.value + '/' + this.ff.nrcTownshipCode.value + this.ff.nrcType.value +  this.ff.nrcNo.value ,
    phoneNo: this.ff.phoneNo.value,

    };
    this.api.checkMember(checkMember).subscribe( (res: any) => {
      if (res.status === 'FAILED') {

        this.loading = false;

        if (res.messageCode==="DUPLICATED_PHONE_NO"){
  
          this.ff.phoneNo.setErrors({duplicatePhoneNo : true });
        }
        if (res.messageCode==="DUPLICATED_NRC_NO"){
  
          this.duplicateNRC=true;
          
        }
        // this.openDialog();

        return;
      }

      if ( res.status === 'SUCCESS') {
        this.loading = false;
        if (res.data.registeredFlag){
          this.title = 'Already Register';
          this.body = 'This Account was already registered.';
          // this.openDialog();
          return ;
        }
        const newRegisterForm = new NewRegisterForm();
        newRegisterForm.dob = this.ff.dob.value;
        newRegisterForm.nrcNo = this.ff.nrcCode.value + '/' + this.ff.nrcTownshipCode.value + this.ff.nrcType.value +  this.ff.nrcNo.value ;
        newRegisterForm.mobileNo = this.ff.phoneNo.value;
        localStorage.setItem('newRegister', JSON.stringify(newRegisterForm));

        this.router.navigate(['new-user'], { queryParams:  filter, skipLocationChange: true}); ;

      }
    });

  }



}
