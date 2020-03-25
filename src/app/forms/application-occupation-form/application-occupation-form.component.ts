import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { languageValidator, numOnlyValidator, minLength, currencyFormat, servicePeriodValidator } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { Numeral, NumeralPipe } from 'ngx-numeral';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-application-occupation-form',
  templateUrl: './application-occupation-form.component.html',
  styleUrls: ['./application-occupation-form.component.css']
})

export class ApplicationOccupationFormComponent implements OnInit {

  occupationForm: FormGroup;
  currentUser: any;
  saveObject: any = {};
  applicantCompanyInfoDto: any = {};

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

  get getOccupation(){
    return this.occupationForm.controls;
  }

  private FormBuilder() {
    this.occupationForm = this.fb.group({
      companyName: ['', [Validators.required, languageValidator]],
      companyAddress: ['', [Validators.required, languageValidator]],
      salaryDay: ['1'],
      companyTelNo: ['', [Validators.required, numOnlyValidator, minLength(11)]],
      contactTimeFrom: ['', [Validators.required]],
      contactTimeTo: ['', [Validators.required]],
      totalIncome: [''],
      yearOfServiceYear: ['0'],
      yearOfServiceMonth: ['0'],
      department: ['',[Validators.required, languageValidator]],
      position: ['', [Validators.required, languageValidator]],
      companyStatus: ['1'],
      companyStatusOther: ['', [Validators.required, languageValidator]],
      monthlyBasicIncome: ['', [currencyFormat]],
      otherIncome: ['', [currencyFormat]]
    }, { validators: servicePeriodValidator });

    this.getOccupation.companyStatusOther.disable();
  }

  private lastApplicationInfo() {
    this.authService.currentUser.subscribe( (user: any) => { 
      this.currentUser = user.data; 
    });
    
    this.saveObject.daApplicationTypeId = 1;
    this.saveObject.channelType = 2;
    this.saveObject.customerId = this.currentUser.userInformationResDto.customerId;

    this.dataService.getLastApplicationInfo(this.currentUser.access_token, this.currentUser.userInformationResDto.customerId).subscribe((result: any) => {
      
      if((result.status === 'SUCCESS' && result.data === null) || result.status === 'SUCCESS' && result.data !== null && result.data.applicantCompanyInfoDto === null) {
        this.saveObject.name = this.currentUser.userInformationResDto.name;
        this.saveObject.dob = this.currentUser.userInformationResDto.dateOfBirth;
      }

      if(result.status === 'SUCCESS' && result.data !== null && result.data.applicantCompanyInfoDto !== null) {
        this.saveObject = result.data;
        this.getOccupation.companyName.setValue(result.data.applicantCompanyInfoDto.companyName);
        this.getOccupation.companyAddress.setValue(result.data.applicantCompanyInfoDto.companyAddress);
        this.getOccupation.companyTelNo.setValue(result.data.applicantCompanyInfoDto.companyTelNo);
        this.getOccupation.contactTimeFrom.setValue(result.data.applicantCompanyInfoDto.contactTimeFrom);
        this.getOccupation.contactTimeTo.setValue(result.data.applicantCompanyInfoDto.contactTimeTo);
        this.getOccupation.department.setValue(result.data.applicantCompanyInfoDto.department);
        this.getOccupation.position.setValue(result.data.applicantCompanyInfoDto.position);

        if(result.data.applicantCompanyInfoDto.monthlyBasicIncome === null || result.data.applicantCompanyInfoDto.monthlyBasicIncome === undefined) {
          this.getOccupation.monthlyBasicIncome.setValue(0);
        } else {
          this.getOccupation.monthlyBasicIncome.setValue(result.data.applicantCompanyInfoDto.monthlyBasicIncome);
        }

        if(result.data.applicantCompanyInfoDto.otherIncome === null || result.data.applicantCompanyInfoDto.otherIncome === undefined) {
          this.getOccupation.otherIncome.setValue(0);
        } else {
          this.getOccupation.otherIncome.setValue(result.data.applicantCompanyInfoDto.otherIncome);
        }

        if(result.data.applicantCompanyInfoDto.totalIncome === null || result.data.applicantCompanyInfoDto.totalIncome === undefined) {
          this.getOccupation.totalIncome.setValue(0);
        } else {
          this.getOccupation.totalIncome.setValue(result.data.applicantCompanyInfoDto.totalIncome);
        }
        
        if(result.data.applicantCompanyInfoDto.salaryDay !== null) {
          this.getOccupation.salaryDay.setValue(result.data.applicantCompanyInfoDto.salaryDay.toString());
        }

        if(result.data.applicantCompanyInfoDto.yearOfServiceYear === null) {
          this.getOccupation.yearOfServiceYear.setValue('');
        }else {
          this.getOccupation.yearOfServiceYear.setValue(result.data.applicantCompanyInfoDto.yearOfServiceYear.toString());
        }

        if(result.data.applicantCompanyInfoDto.yearOfServiceYear === null) {
          this.getOccupation.yearOfServiceYear.setValue('');
        }else {
          this.getOccupation.yearOfServiceYear.setValue(result.data.applicantCompanyInfoDto.yearOfServiceYear.toString());
        }

        if(result.data.applicantCompanyInfoDto.yearOfServiceMonth === null) {
          this.getOccupation.yearOfServiceMonth.setValue('');
        }else {
          this.getOccupation.yearOfServiceMonth.setValue(result.data.applicantCompanyInfoDto.yearOfServiceMonth.toString());
        }

        if(result.data.applicantCompanyInfoDto.companyStatus !== null) {
          this.getOccupation.companyStatus.setValue(result.data.applicantCompanyInfoDto.companyStatus.toString());
        }

        if(result.data.applicantCompanyInfoDto.companyStatus === 12) {
          this.getOccupation.companyStatusOther.enable();
          this.getOccupation.companyStatusOther.setValue(result.data.applicantCompanyInfoDto.companyStatusOther);
        } else {
          this.getOccupation.companyStatusOther.disable();
        }

        if(result.data.applicantCompanyInfoDto.monthlyBasicIncome === null) {
          this.getOccupation.monthlyBasicIncome.setValue('');
        }else {
          this.getOccupation.monthlyBasicIncome.setValue(result.data.applicantCompanyInfoDto.monthlyBasicIncome);
        }

        if(result.data.applicantCompanyInfoDto.otherIncome === null) {
          this.getOccupation.otherIncome.setValue('');
        }else {
          this.getOccupation.otherIncome.setValue(result.data.applicantCompanyInfoDto.otherIncome);
        }

        if(result.data.applicantCompanyInfoDto.totalIncome === null) {
          this.getOccupation.totalIncome.setValue('');
        }else {
          this.getOccupation.totalIncome.setValue((result.data.applicantCompanyInfoDto.otherIncome + result.data.applicantCompanyInfoDto.monthlyBasicIncome));
        }
      }
    });
  }

  errorHandling = (control: string, error: string) => {
    return this.occupationForm.controls[control].hasError(error);
  }

  enableOtherComapnyStatus($event: any) {
    if( Number($event.value) === 12) {
      this.getOccupation.companyStatusOther.enable();
    } else {
      this.getOccupation.companyStatusOther.disable();
    }
  }

  calculateTotalIncome($event: any, type: string) {
    let getMonthlyIncome = this.getOccupation.monthlyBasicIncome.value;
    let getOtherIncome = this.getOccupation.otherIncome.value;

    if(type === 'monthly') {
      getMonthlyIncome = new NumeralPipe($event.target.value).value();
    }

    if(type === 'other') {
      getOtherIncome = new NumeralPipe($event.target.value).value();
    }

    this.getOccupation.totalIncome.setValue(getMonthlyIncome + getOtherIncome);
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  formSave() {

    this.loading = true;

    if(this.occupationForm.invalid) {
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.loading = false;
      return;
    }

    this.applicantCompanyInfoDto = this.occupationForm.value;

    this.saveObject.applicantCompanyInfoDto = this.occupationForm.value;
    this.saveObject.applicantCompanyInfoDto.monthlyBasicIncome = this.getOccupation.monthlyBasicIncome.value.toString();
    this.saveObject.applicantCompanyInfoDto.otherIncome = this.getOccupation.otherIncome.value.toString();
    this.saveObject.applicantCompanyInfoDto.totalIncome = this.getOccupation.totalIncome.value.toString();

    if( Number(this.getOccupation.companyStatus.value) === 12) {
      this.saveObject.applicantCompanyInfoDto.companyStatusOther = this.getOccupation.companyStatusOther.value;
    } else {
      this.saveObject.applicantCompanyInfoDto.companyStatusOther = '';
    }

    this.dataService.saveDraft(this.currentUser.access_token, this.saveObject).subscribe((res: any) => {
      this.snackBar.openFromTemplate(this.saveSnackBar, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
    }); 

    this.loading = false;
  }

  ngOnInit() {
    this.FormBuilder();
    this.lastApplicationInfo();
  }

}
