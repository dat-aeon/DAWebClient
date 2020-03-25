import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/cores/helper/data.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/cores/services/auth.service';
import { languageValidator, minLength, numOnlyValidator, phoneNumValidator, guarantorPeriodValidator, servicePeriodValidator } from 'src/app/cores/helper/validators';
import { nrcFormat } from 'src/app/cores/configuration';

@Component({
  selector: 'app-applicationemguarantor-formm',
  templateUrl: './applicationemguarantor-formm.component.html',
  styleUrls: ['./applicationemguarantor-formm.component.css']
})
export class ApplicationemguarantorFormmComponent implements OnInit {


  guarantorForm: FormGroup;
  currentUser: any;
  saveObject: any = {};
  guarantorInfoDto: any = {};
  nrcTypeList: any = [];
  townshipCodeResDtoList: any = [];
  stateIdList: any = [];
  matchTownShip: any;

  maxDate: any = new Date(Date.now());

  currencyOption: any = {
    allowDecimalPadding: true,
    decimalCharacter: '.',
    decimalPlaces: '0',
    digitGroupSeparator: ',',
    digitalGroupSpacing: '3',
    maximumValue: '10000000000',
    selectNumberOnly: true
  }

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

  get getGuarantor() {
    return this.guarantorForm.controls;
  }
  
  private dataInit() {
    this.authService.currentUser.subscribe( (user: any) => { 
      this.currentUser = user.data; 
    });

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
      this.getGuarantor.nrcList.setValue(this.matchTownShip[0]);
      this.getGuarantor.nrcType.setValue(this.nrcTypeList[0]);
    });

    this.saveObject.daApplicationTypeId = 1;
    this.saveObject.channelType = 2;
    this.saveObject.customerId = this.currentUser.userInformationResDto.customerId;
    
  }

  private lastApplicationInfo() {
    this.dataService.getLastApplicationInfo(this.currentUser.access_token, this.currentUser.userInformationResDto.customerId).subscribe((result: any) => {

      if(result.status === 'SUCCESS' && result.data === null) {
        this.saveObject.name.setValue(this.currentUser.userInformationResDto.name);
        this.saveObject.dob.setValue(new Date(this.currentUser.userInformationResDto.dateOfBirth));
      }

      if(result.status === 'SUCCESS' && result.data.guarantorInfoDto !== null) {
        this.getGuarantor.name.setValue(result.data.guarantorInfoDto.name);
        this.getGuarantor.dob.setValue(new Date(result.data.guarantorInfoDto.dob));
        this.getGuarantor.mobileNo.setValue(result.data.guarantorInfoDto.mobileNo);
        this.getGuarantor.residentTelNo.setValue(result.data.guarantorInfoDto.residentTelNo);
        this.getGuarantor.currentAddress.setValue(result.data.guarantorInfoDto.currentAddress);
        this.getGuarantor.companyName.setValue(result.data.guarantorInfoDto.companyName);
        this.getGuarantor.companyTelNo.setValue(result.data.guarantorInfoDto.companyTelNo);
        this.getGuarantor.companyAddress.setValue(result.data.guarantorInfoDto.companyAddress);
        this.getGuarantor.department.setValue(result.data.guarantorInfoDto.department);
        this.getGuarantor.position.setValue(result.data.guarantorInfoDto.position);

        if(result.data.guarantorInfoDto.monthlyBasicIncome === null || result.data.guarantorInfoDto.monthlyBasicIncome === undefined) {
          this.getGuarantor.monthlyBasicIncome.setValue(0);
        } else {
          this.getGuarantor.monthlyBasicIncome.setValue(result.data.guarantorInfoDto.monthlyBasicIncome);
        }

        if(result.data.guarantorInfoDto.totalIncome === null || result.data.guarantorInfoDto.totalIncome === undefined) {
          this.getGuarantor.totalIncome.setValue(0);
        } else {
          this.getGuarantor.totalIncome.setValue(result.data.guarantorInfoDto.totalIncome);
        }
        

        if(result.data.guarantorInfoDto.nationality === null) {
          this.getGuarantor.nationality.setValue(1);
        } else {
          this.getGuarantor.nationality.setValue(result.data.guarantorInfoDto.nationality);
        }

        const nrc = nrcFormat(result.data.guarantorInfoDto.nrcNo);

        this.getGuarantor.nrcType.setValue(nrc.type);
        this.getGuarantor.nrcCode.setValue(nrc.no);
        this.getGuarantor.nrcList.setValue(nrc.list);
        this.getGuarantor.nrcNo.setValue(nrc.code);

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

        if(result.data.guarantorInfoDto.maritalStatus === null || result.data.guarantorInfoDto.maritalStatus === undefined) {
            this.getGuarantor.maritalStatus.setValue('1');
        } else {
          this.getGuarantor.maritalStatus.setValue(result.data.guarantorInfoDto.maritalStatus);
        }
    
        if(result.data.guarantorInfoDto.relationship === null || result.data.guarantorInfoDto.relationship === undefined) {
          this.getGuarantor.relationship.setValue('1');
        } else {
          this.getGuarantor.relationship.setValue(result.data.guarantorInfoDto.relationship.toString());
        }
  
          if(result.data.guarantorInfoDto.gender === null || result.data.guarantorInfoDto.gender === undefined) {
            this.getGuarantor.gender.setValue('1');
          } else {
            this.getGuarantor.gender.setValue(result.data.guarantorInfoDto.gender);
          }
    
          if(result.data.guarantorInfoDto.typeOfResidence === null || result.data.guarantorInfoDto.typeOfResidence === undefined) {
            this.getGuarantor.typeOfResidence.setValue('1');
          } else {
            this.getGuarantor.typeOfResidence.setValue(result.data.guarantorInfoDto.typeOfResidence.toString());
            
          }
  
          if(result.data.guarantorInfoDto.livingWith === null || result.data.guarantorInfoDto.livingWith === undefined) {
            this.getGuarantor.livingWith.setValue('1');
          } else {
            this.getGuarantor.livingWith.setValue(result.data.guarantorInfoDto.livingWith.toString());
          }
    
          if(result.data.guarantorInfoDto.yearOfStayYear === null || result.data.guarantorInfoDto.yearOfStayYear === undefined) {
            this.getGuarantor.yearOfStayYear.setValue('1');
          } else {
            this.getGuarantor.yearOfStayYear.setValue(result.data.guarantorInfoDto.yearOfStayYear.toString());
          }
    
          if(result.data.guarantorInfoDto.yearOfStayMonth === null || result.data.guarantorInfoDto.yearOfStayMonth === undefined) {
            this.getGuarantor.yearOfStayMonth.setValue('1');
          } else {
            this.getGuarantor.yearOfStayMonth.setValue(result.data.guarantorInfoDto.yearOfStayMonth.toString());
          }
          
          if(result.data.guarantorInfoDto.yearOfServiceYear === null || result.data.guarantorInfoDto.yearOfServiceYear === undefined) {
            this.getGuarantor.yearOfServiceYear.setValue('1');
          } else {
            this.getGuarantor.yearOfServiceYear.setValue(result.data.guarantorInfoDto.yearOfServiceYear.toString());
          }
    
          if(result.data.guarantorInfoDto.yearOfServiceMonth === null || result.data.guarantorInfoDto.yearOfServiceMonth === undefined) {
            this.getGuarantor.yearOfServiceMonth.setValue('0');
          } else {
            this.getGuarantor.yearOfServiceMonth.setValue(result.data.guarantorInfoDto.yearOfServiceMonth.toString());
          }
          
          if(result.data.guarantorInfoDto.nationality !== 1 && result.data.guarantorInfoDto.nationality !== null) {
            this.getGuarantor.nationalityOther.setValue(result.data.guarantorInfoDto.nationalityOther);
            this.getGuarantor.nationalityOther.enable();
          }
    
          if(result.data.guarantorInfoDto.relationship === 5 && result.data.guarantorInfoDto.relationship !== null) {
            this.getGuarantor.relationshipOther.setValue(result.data.guarantorInfoDto.relationshipOther);
            this.getGuarantor.relationshipOther.enable();
          }
    
          if(result.data.guarantorInfoDto.typeOfResidence === 5 && result.data.guarantorInfoDto.typeOfResidence !== null) {
            this.getGuarantor.typeOfResidenceOther.setValue(result.data.guarantorInfoDto.typeOfResidenceOther);
            this.getGuarantor.typeOfResidenceOther.enable();
          }
      }

    });
  }

  private guarantorFormBuilder() {
    this.guarantorForm = this.fb.group({
      name: ['', [Validators.required, languageValidator]],
      dob: ['', [Validators.required]],
      nrcType: ['(N)'],
      nrcCode:[1],
      nrcList:[],
      nrcNo:['', [Validators.required,  minLength(6), numOnlyValidator]],
      nationality: [1, [Validators.required]],
      nationalityOther: ['', [Validators.required, languageValidator]],
      mobileNo: ['', [Validators.required, numOnlyValidator, phoneNumValidator, minLength(11)]],
      residentTelNo: ['', [Validators.required, numOnlyValidator, phoneNumValidator, minLength(11) ]],
      relationship: [1],
      relationshipOther: ['', [Validators.required, languageValidator]],
      currentAddress: ['', [Validators.required, languageValidator]],
      typeOfResidence: [1],
      typeOfResidenceOther: ['', [Validators.required, languageValidator]],
      livingWith: [1],
      livingWithOther: ['', [Validators.required, languageValidator]],
      gender: [1],
      maritalStatus: [1, [Validators.required]],
      yearOfStayYear: ['0'],
      yearOfStayMonth: ['0'],
      companyName: ['', [Validators.required, languageValidator]],
      companyTelNo: ['', [Validators.required, numOnlyValidator]],
      companyAddress: ['', [Validators.required, languageValidator]],
      department: ['', [Validators.required, languageValidator]],
      position: ['', [Validators.required, languageValidator]],
      yearOfServiceYear: ['0', [Validators.required, numOnlyValidator]],
      yearOfServiceMonth: ['0', [Validators.required, numOnlyValidator]],
      monthlyBasicIncome: [''],
      totalIncome: [''],
    }, { validators: [guarantorPeriodValidator, servicePeriodValidator] });

    this.getGuarantor.nationalityOther.disable();
    this.getGuarantor.typeOfResidenceOther.disable();
    this.getGuarantor.relationshipOther.disable();
    this.getGuarantor.livingWithOther.disable();
  }

  errorHandling = (control: string, error: string) => {
    return this.guarantorForm.controls[control].hasError(error);
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  enableOtherNationality($event: any) {
    if($event.value === 1) {
      this.getGuarantor.nationalityOther.disable();
    }

    if($event.value === 2) {
      this.getGuarantor.nationalityOther.enable();
    }
  }

  relationshipChange($event: any){
    if(Number($event.value) === 5) {
      this.getGuarantor.relationshipOther.enable();
    } else {
      this.getGuarantor.relationshipOther.disable();
    }
  }

  typeOfResidenceChange($event: any) {
    if(Number($event.value) === 5) {
      this.getGuarantor.typeOfResidenceOther.enable();
    }else {
      this.getGuarantor.typeOfResidenceOther.disable();
    }
  }

  changeNrcState($event: any) {
    const eventChangeValue = Number($event.value);

    this.townshipCodeResDtoList.find( (key: any) => {
      if(key.stateId === eventChangeValue) {
        this.matchTownShip = key.townshipCodeList;
        this.getGuarantor.nrcList.setValue(key.townshipCodeList[0]);
      }
    });

    this.townshipCodeResDtoList.filter( (res: any) => {
      if (res.stateId === eventChangeValue) {
        this.matchTownShip = res.townshipCodeList;
      }
    });
  }

  guarantorTotalIncomeChange($event: any) {
    this.getGuarantor.totalIncome.setValue($event.target.value);
  }

  guarantorSave() {
    
    this.loading = true;

    if(this.guarantorForm.invalid) {
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      this.loading = false;
      return;
    }

    this.saveObject.daApplicationTypeId = 1;
    this.saveObject.channelType = 2;
    this.saveObject.customerId = this.currentUser.userInformationResDto.customerId;


    this.guarantorInfoDto.name = this.getGuarantor.name.value;
    this.guarantorInfoDto.dob = this.getGuarantor.dob.value;
    this.guarantorInfoDto.nrcNo = this.getGuarantor.nrcCode.value + '/' + this.getGuarantor.nrcList.value  + this.getGuarantor.nrcType.value + this.getGuarantor.nrcNo.value;
    this.guarantorInfoDto.nationality = Number(this.getGuarantor.nationality.value);
    this.guarantorInfoDto.mobileNo = this.getGuarantor.mobileNo.value;
    this.guarantorInfoDto.residentTelNo = this.getGuarantor.residentTelNo.value;
    this.guarantorInfoDto.relationship = Number(this.getGuarantor.relationship.value);
    this.guarantorInfoDto.currentAddress = this.getGuarantor.currentAddress.value;
    this.guarantorInfoDto.typeOfResidence = Number(this.getGuarantor.typeOfResidence.value);
    this.guarantorInfoDto.livingWith = Number(this.getGuarantor.livingWith.value);
    this.guarantorInfoDto.gender = Number(this.getGuarantor.gender.value);
    this.guarantorInfoDto.maritalStatus = Number(this.getGuarantor.maritalStatus.value);
    this.guarantorInfoDto.yearOfStayYear = Number(this.getGuarantor.yearOfStayYear.value);
    this.guarantorInfoDto.yearOfStayMonth = Number(this.getGuarantor.yearOfStayMonth.value);
    this.guarantorInfoDto.companyName = this.getGuarantor.companyName.value;
    this.guarantorInfoDto.companyTelNo = this.getGuarantor.companyTelNo.value;
    this.guarantorInfoDto.companyAddress = this.getGuarantor.companyAddress.value;
    this.guarantorInfoDto.department = this.getGuarantor.department.value;
    this.guarantorInfoDto.position = this.getGuarantor.position.value;
    this.guarantorInfoDto.yearOfServiceYear = Number(this.getGuarantor.yearOfServiceYear.value);
    this.guarantorInfoDto.yearOfServiceMonth = Number(this.getGuarantor.yearOfServiceMonth.value);
    this.guarantorInfoDto.monthlyBasicIncome =  this.getGuarantor.monthlyBasicIncome.value.toString();
    this.guarantorInfoDto.totalIncome = this.getGuarantor.monthlyBasicIncome.value.toString();

    if(Number(this.guarantorInfoDto.nationality.value) !== 1) {
      this.guarantorInfoDto.nationalityOther = this.getGuarantor.nationalityOther.value;
    } else {
      this.guarantorInfoDto.nationalityOther = '';
    }

    if(Number(this.guarantorInfoDto.relationship.value) !== 1) {
      this.guarantorInfoDto.relationshipOther = this.getGuarantor.relationshipOther.value;
    } else {
      this.guarantorInfoDto.relationshipOther = '';
    }

    if(Number(this.guarantorInfoDto.typeOfResidence) !== 1) {
      this.guarantorInfoDto.typeOfResidenceOther = this.getGuarantor.typeOfResidenceOther.value;
    } else {
      this.guarantorInfoDto.typeOfResidenceOther = '';
    }

    this.saveObject.guarantorInfoDto = this.guarantorInfoDto;
    
    this.dataService.saveDraft(this.currentUser.access_token, this.saveObject).subscribe((res: any) => {
      if(res.status === 'SUCCESS') {
        this.snackBar.openFromTemplate(this.saveSnackBar, { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center' });
      }
    }); 

    this.loading = false;
  }

  
  ngOnInit() {
    this.dataInit();
    this.guarantorFormBuilder();
    this.lastApplicationInfo();
  }

}
