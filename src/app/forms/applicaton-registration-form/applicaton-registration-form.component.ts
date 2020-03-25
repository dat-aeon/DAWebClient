import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { languageValidator, minLength, numOnlyValidator, phoneNumValidator, stayPeriodValidator } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { nrcFormat } from 'src/app/cores/configuration';

@Component({
  selector: 'app-applicaton-registration-form',
  templateUrl: './applicaton-registration-form.component.html',
  styleUrls: ['./applicaton-registration-form.component.css']
})

export class ApplicatonRegistrationFormComponent implements OnInit {

  applicationRegistrationForm: FormGroup;
  nrcTypeList: any = [];
  townshipCodeResDtoList: any = [];
  stateIdList: any = [];
  matchTownShip: any;
  saveObject: any = {};

  maxDate: any = new Date(Date.now());
  currentUser: any;

  loading: boolean = false;

  @ViewChild('erorrSnack', { static: false })
  erorrSnack: any = TemplateRef; 

  @ViewChild('successfullSave', { static: false })
  saveSnackBar: any = TemplateRef;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  get f () {
    return this.applicationRegistrationForm.controls;
  }

  private dataInit() {
    this.authService.currentUser.subscribe( (user: any) => { 
      this.currentUser = user.data; 
    });

    this.f.name.setValue(this.currentUser.userInformationResDto.name);
    this.f.dob.setValue(new Date(this.currentUser.userInformationResDto.dateOfBirth));

    this.maxDate.setDate( this.maxDate.getDate() );
    this.maxDate.setFullYear( this.maxDate.getFullYear() - 18);

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
    });
  }

  private lastApplicationInfo() {
    this.dataService.getLastApplicationInfo(this.currentUser.access_token, this.currentUser.userInformationResDto.customerId).subscribe((result: any) => {

      if(result.status === 'SUCCESS' && result.data === null) {
        this.f.name.setValue(this.currentUser.userInformationResDto.name);
        this.f.dob.setValue(new Date(this.currentUser.userInformationResDto.dateOfBirth));
      }

      if(result.status === 'SUCCESS' && result.data !== null) {

        const nrc = nrcFormat(result.data.nrcNo);

        this.dataService.townshipCodeList().subscribe((dataLists: any) => {
          const rowStateId = [];

          for (const x of dataLists.data.townshipCodeResDtoList) {
            rowStateId.push(x.stateId);
          }

          this.stateIdList = rowStateId;

          dataLists.data.townshipCodeResDtoList.findIndex((lists: any) => {
           
            if(lists.stateId === nrc.no) {
              this.matchTownShip = lists.townshipCodeList;
            }
          });

          this.nrcTypeList = dataLists.data.nrcTypeList;

        });

        this.f.maritalStatus.setValue(result.data.maritalStatus);
        this.f.name.setValue(result.data.name);
        this.f.dob.setValue(new Date(result.data.dob));
        this.f.nrcCode.setValue(nrc.no);
        this.f.nrcList.setValue(nrc.list);
        this.f.nrcType.setValue(nrc.type);
        this.f.nrcNo.setValue(nrc.code);
        this.f.fatherName.setValue(result.data.fatherName);
        this.f.nationality.setValue(result.data.nationality);
        this.f.gander.setValue(result.data.gender);
        this.f.currentAddress.setValue(result.data.currentAddress);
        this.f.permanentAddress.setValue(result.data.permanentAddress);
        this.f.livingWith.setValue(result.data.livingWith.toString());
        this.f.typeOfResidence.setValue(result.data.typeOfResidence.toString());

        if(result.data.nationalityOther === null) {
          this.f.nationalityOther.setValue('');
        } else {
          this.f.nationalityOther.setValue(result.data.nationalityOther);
        }

        if(result.data.typeOfResidenceOther === null) {
          this.f.typeOfResidenceOther.setValue('');
        } else {
        this.f.typeOfResidenceOther.setValue(result.data.typeOfResidenceOther);
        }

        if(result.data.livingWithOther === null) {
          this.f.livingWithOther.setValue('');
        } else {
          this.f.livingWithOther.setValue(result.data.livingWithOther);
        }
        
        this.f.yearOfStayYear.setValue(result.data.yearOfStayYear.toString());
        this.f.yearOfStayMonth.setValue(result.data.yearOfStayMonth.toString());
        this.f.mobileNo.setValue(result.data.mobileNo);
        this.f.otherPhoneNo.setValue(result.data.otherPhoneNo);
        this.f.residentTelNo.setValue(result.data.residentTelNo);
        this.f.email.setValue(result.data.email);

        this.townshipCodeResDtoList.find( (key: any) => {
          if(key.stateId === nrc.no) {
            this.matchTownShip = key.townshipCodeList;
            this.f.nrcList.setValue(nrc.list);
          }
        });

        if(result.data.nationality === 1) {
          this.f.nationalityOther.disable();
        } else {
          this.f.nationalityOther.enable();
        }

        if(result.data.typeOfResidence === 5) {
          this.f.typeOfResidenceOther.enable();
        } else {
          this.f.typeOfResidenceOther.disable();
        }
      }

    });
  }

  private FormBuilder () {
    this.applicationRegistrationForm = this.fb.group({
      name: ['', [Validators.required, languageValidator]],
      dob: ['', [Validators.required]],
      nrcType: ['(N)', Validators.required],
      nrcCode: [1,Validators.required],
      nrcList: ['', Validators.required],
      nrcNo: ['', [Validators.required, minLength(6), numOnlyValidator]],
      fatherName: ['', [Validators.required, languageValidator]],
      nationality: [1, [Validators.required]],
      nationalityOther: ['', [Validators.required, languageValidator]],
      gander: [1, [Validators.required]],
      maritalStatus: [1, [Validators.required]],
      currentAddress: ['', [Validators.required, languageValidator]],
      permanentAddress: ['', [Validators.required, languageValidator]],
      typeOfResidence: ['1', [Validators.required]],
      typeOfResidenceOther: ['', [ Validators.required, languageValidator]],
      livingWith: ['1', [Validators.required]],
      livingWithOther: ['', [ Validators.required, languageValidator]],
      yearOfStayYear: ['0'],
      yearOfStayMonth: ['0'],
      mobileNo: ['', [Validators.required, numOnlyValidator, phoneNumValidator, minLength(11)]],
      residentTelNo: ['', [Validators.required, numOnlyValidator, phoneNumValidator, minLength(11)]],
      otherPhoneNo: ['', [ numOnlyValidator ]],
      email: ['', [Validators.required, Validators.email, languageValidator]]
    }, { validators: stayPeriodValidator });

    this.f.nationalityOther.disable();
    this.f.typeOfResidenceOther.disable();
    this.f.livingWithOther.disable();
  }

  errorHandling = (control: string, error: string) => {
    return this.applicationRegistrationForm.controls[control].hasError(error);
  }

  changeNrcState($event: any) {
    const eventChangeValue = Number($event.value);

    this.townshipCodeResDtoList.find( (key: any) => {
      if(key.stateId === eventChangeValue) {
        this.matchTownShip = key.townshipCodeList;
        this.f.nrcList.setValue(key.townshipCodeList[0]);
      }
    });

    this.townshipCodeResDtoList.filter( (res: any) => {
      if (res.stateId === eventChangeValue) {
        this.matchTownShip = res.townshipCodeList;
      }
    });
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  enableOtherNationality($event: any) {
    if($event.value === 1) {
      this.f.nationalityOther.disable();
    }

    if($event.value === 2) {
      this.f.nationalityOther.enable();
    }
  }

  typeOfResidenceChange($event: any) {
    if(Number($event.value) === 5) {
      this.f.typeOfResidenceOther.enable(); 
    }else {
      this.f.typeOfResidenceOther.disable();
    }
  }

  applicationDataSave() {

    this.loading = true;

    if(this.applicationRegistrationForm.invalid) {
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      this.loading = false;
      return;
    }

    this.saveObject.daApplicationTypeId = 1;
    this.saveObject.name = this.f.name.value;
    this.saveObject.dob =  this.f.dob.value;
    this.saveObject.nrcNo = this.f.nrcCode.value + '/' + this.f.nrcList.value + this.f.nrcType.value + this.f.nrcNo.value;
    this.saveObject.fatherName = this.f.fatherName.value;
    this.saveObject.nationality = this.f.nationality.value;

    if( this.saveObject.nationality === 1) {
      this.saveObject.nationalityOther = '';
    } else {
      this.saveObject.nationalityOther = this.f.nationalityOther.value;
    }

    this.saveObject.gender = this.f.gander.value;
    this.saveObject.maritalStatus = this.f.maritalStatus.value;
    this.saveObject.currentAddress = this.f.currentAddress.value;
    this.saveObject.permanentAddress = this.f.permanentAddress.value;
    this.saveObject.typeOfResidence = Number(this.f.typeOfResidence.value);

    if(Number(this.f.typeOfResidence.value) !== 5) {
      this.saveObject.typeOfResidenceOther = '';
    } else {
      this.saveObject.typeOfResidenceOther = this.f.typeOfResidenceOther.value;
    }

    this.saveObject.livingWith = Number(this.f.livingWith.value);
    this.saveObject.livingWithOther = '';

    this.saveObject.yearOfStayYear = Number(this.f.yearOfStayYear.value);
    this.saveObject.yearOfStayMonth = Number(this.f.yearOfStayMonth.value);
    this.saveObject.mobileNo = this.f.mobileNo.value;
    this.saveObject.residentTelNo = this.f.residentTelNo.value;
    this.saveObject.otherPhoneNo = this.f.otherPhoneNo.value;
    this.saveObject.email = this.f.email.value;
    this.saveObject.daApplicationTypeId = 1;
    this.saveObject.customerId = this.currentUser.userInformationResDto.customerId;
    this.saveObject.channelType = 2;

    this.dataService.saveDraft(this.currentUser.access_token, this.saveObject).subscribe((res: any) => {
      if(res.status === 'SUCCESS') {
        this.snackBar.openFromTemplate(this.saveSnackBar, { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    });
    
    this.loading = false;
  }

  ngOnInit() {
    this.FormBuilder();
    this.dataInit();
    this.lastApplicationInfo();
  }

}
