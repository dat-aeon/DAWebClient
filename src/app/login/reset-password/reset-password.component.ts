import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { numLengthValidator, phoneNumValidator, numOnlyValidator } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/cores/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {
  
  resetForm: FormGroup;
  nrcTypeList: any;
  townshipCodeResDtoList: any;
  stateIdList: any;
  matchTownShip: any;
  userRegInfo: any;
  regObj: any = {};
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dataServe: DataService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
  ) {

    if(this.authService.currentUserValue) { 
      this.router.navigate(['dashboard']); 
    }
  }

  get f() { 
    return this.resetForm.controls; 
  }

  private loadingData() {
    this.dataServe.townshipCodeList().subscribe( (res: any) => {
      const rowStateId = [];

      for (const x of res.data.townshipCodeResDtoList) {
        rowStateId.push(x.stateId);
      }

      this.nrcTypeList = res.data.nrcTypeList;
      this.townshipCodeResDtoList = res.data.townshipCodeResDtoList;
      this.stateIdList = rowStateId;

      this.matchTownShip = res.data.townshipCodeResDtoList[0].townshipCodeList;
      this.f.nrcList.setValue(res.data.townshipCodeResDtoList[0].townshipCodeList[0]);

    });
  }

  private resetFormBuilder () {
    this.resetForm = this.fb.group({
      phoneNo: ['', [Validators.required, numLengthValidator(9,11), phoneNumValidator, numOnlyValidator]],
      nrcType: ['', Validators.required],
      nrcCode: ['', Validators.required],
      nrcList: ['', [Validators.required]],
      nrcNo: ['', [Validators.required, numOnlyValidator, Validators.minLength(6)]]
    });

    this.f.nrcType.setValue('(N)');
    this.f.nrcCode.setValue(1);
  }

  changeNrcState($event: any){
    this.townshipCodeResDtoList.find( (key: any) => {
      if(Number($event.value) === key.stateId) {
        this.matchTownShip = key.townshipCodeList;
        this.f.nrcList.setValue(key.townshipCodeList[0]);
      }
    });
  }

  errorHandling = (control: string, error: string) => {
    return this.resetForm.controls[control].hasError(error);
  }

  onSubmit() {
    this.loading = true;
    if (this.resetForm.invalid) { 
      this.loading = false;
      return; 
    }

    let body: any = {};

    body.phoneNo = this.f.phoneNo.value;
    body.nrcNo = this.f.nrcCode.value + '/' + this.f.nrcList.value + this.f.nrcType.value + this.f.nrcNo.value;

    this.authService.checkAccountLock(body).subscribe((res: any) => {
      if(res.status === 'FAILED') {
        this.loading = false;
      }

      if(res.status === 'SUCCESS' && res.data !== null && res.data.lockStatus === 0) {
        this.regObj.phoneNo = this.f.phoneNo.value;
        this.regObj.nrcType = this.f.nrcType.value;
        this.regObj.nrcCode = this.f.nrcCode.value;
        this.regObj.nrcList = this.f.nrcList.value;
        this.regObj.nrcNo = this.f.nrcNo.value;
        this.regObj.customerSecurityQuestionDtoList = [];
        this.userService.resetUser.next(this.regObj);

        this.loading = false;

       this.router.navigate(['reset-questions']);
      }
    });
  }

  ngOnInit() {
    this.resetFormBuilder();
    this.loadingData();
  }

}
