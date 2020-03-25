import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { languageValidator, numOnlyValidator, passwordMatchValidator, phoneNumValidator, minLength } from '../cores/helper/validators';
import { AuthService } from '../cores/services/auth.service';
import { DataService } from '../cores/helper/data.service';
import { MatSnackBar } from '@angular/material';
import { UserService } from '../cores/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  nrcTypeList: any;
  townshipCodeResDtoList: any;
  stateIdList: any;
  matchTownShip: any;
  requestObject: any = {};
  loading: boolean = false;
  maxDate: any = new Date(Date.now());

  @ViewChild('registrationSnackBar', { static: false })
  registrationSnackBar: any = TemplateRef; 

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
    private dataService: DataService,
  ) {

    this.maxDate.setDate(this.maxDate.getDate());
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

    this.authService.currentUser.subscribe( (res: any) => {
      if(res !== null) {
        this.router.navigate(['dashboard']);
      }
    });

    this.registrationFormBuilder();
  }

  get f() { return this.registerForm.controls; }

  private registrationFormBuilder() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, languageValidator]],
        dob: ['', [Validators.required]],
        nrcType: ['', Validators.required],
        nrcCode: ['', Validators.required],
        nrcList: ['', [Validators.required]],
        nrcNo: ['', [Validators.required, minLength(6), numOnlyValidator]],
        phoneNo: ['', [Validators.required, numOnlyValidator, phoneNumValidator, minLength(11)]],
        password: ['', [Validators.required, languageValidator]],
        compwd: ['', [Validators.required, languageValidator]]
      },
      { validator: passwordMatchValidator }
    );

    this.dataService.townshipCodeList().subscribe( (res: any) => {
      const rowStateId = [];

      for (const x of res.data.townshipCodeResDtoList) {
        rowStateId.push(x.stateId);
      }

      this.nrcTypeList = res.data.nrcTypeList;
      this.townshipCodeResDtoList = res.data.townshipCodeResDtoList;
      this.stateIdList = rowStateId;
      this.matchTownShip = this.townshipCodeResDtoList[0].townshipCodeList;
      this.f.nrcList.setValue(this.matchTownShip[0]);
      this.f.nrcType.setValue(this.nrcTypeList[0]);
      this.f.nrcCode.setValue(1);

    });
  }

  changeNrcState($event: any) {
    const eventChangeValue = Number($event.value);

    this.townshipCodeResDtoList.filter( (res: any) => {
      if (res.stateId === eventChangeValue) {
        this.matchTownShip = res.townshipCodeList;
        this.f.nrcList.setValue(this.matchTownShip[0]);
      }
    });
  }

  errorHandling = (control: string, error: string) => {
    return this.registerForm.controls[control].hasError(error);
  }

  private registration() {
    this.loading = true;
    this.requestObject.name = this.f.name.value;
    this.requestObject.dob =  this.f.dob.value;
    this.requestObject.phoneNo = this.f.phoneNo.value;
    this.requestObject.nrcType = this.f.nrcType.value;
    this.requestObject.nrcCode = this.f.nrcCode.value;
    this.requestObject.nrcList = this.f.nrcList.value;
    this.requestObject.nrcNo = this.f.nrcNo.value;
    this.requestObject.password = this.f.password.value;
    this.requestObject.customerSecurityQuestionDtoList = [];

    this.userService.registrationUser.next(this.requestObject);
    this.loading = false;

    this.router.navigateByUrl('/security-question');
  }

  ngOnInit() { 
    this.userService.registrationUser.subscribe((subscribe: any) => {
      if(subscribe) {
        this.dataService.townshipCodeList().subscribe( (res: any) => {
          const rowStateId = [];
    
          for (const x of res.data.townshipCodeResDtoList) {
            rowStateId.push(x.stateId);
          }
    
          this.nrcTypeList = res.data.nrcTypeList;
          this.townshipCodeResDtoList = res.data.townshipCodeResDtoList;
          this.stateIdList = rowStateId;
          this.matchTownShip = this.townshipCodeResDtoList[(subscribe.nrcCode-1)].townshipCodeList;

          this.f.nrcList.setValue(subscribe.nrcList);
          this.f.name.setValue(subscribe.name);
          this.f.dob.setValue(subscribe.dob);
          this.f.nrcType.setValue(subscribe.nrcType);
          this.f.nrcCode.setValue(subscribe.nrcCode);
          this.f.nrcNo.setValue(subscribe.nrcNo);
          this.f.phoneNo.setValue(subscribe.phoneNo);
          this.f.password.setValue(subscribe.password);
    
        });
      }
      
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) { 
      this.snackBar.openFromTemplate(this.registrationSnackBar, { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center' });
      return; 
    }

    this.registration();
  }
  
}
