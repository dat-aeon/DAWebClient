import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { languageValidator, numOnlyValidator, minLength, currencyFormat, servicePeriodValidator } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { NumeralPipe } from 'ngx-numeral';
import { MatSnackBar } from '@angular/material';
import { ApplicationFormService } from 'src/app/cores/services/application-form.service';
import { appForm } from 'src/app/cores/helper/app-form';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';

@Component({
  selector: 'app-application-occupation-form',
  templateUrl: './application-occupation-form.component.html',
  styleUrls: ['./application-occupation-form.component.css']
})

export class ApplicationOccupationFormComponent implements OnInit {
  hideCompanyStatus:boolean =true;
  companyTownshipList: any = [];
  cityTownship: any = [];
  appForm: appForm;
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
    maximumValue: '99999999',
    minimumValue:'0',
    selectNumberOnly: true
  }
    totalCurrencyOption: any = {
    allowDecimalPadding: true,
    decimalCharacter: '.',
    decimalPlaces: '0',
    digitGroupSeparator: ',',
    digitalGroupSpacing: '3',
    
    minimumValue:'0',
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
    private fb: FormBuilder,
    private modalService: NgbModal,
    private applicationFormService: ApplicationFormService
  ) { }

  get getOccupation(){
    return this.occupationForm.controls;
  }

  private FormBuilder() {
    this.occupationForm = this.fb.group({
      companyName: ['', [Validators.required]],
      companyAddress:[''],
      companyAddressBuildingNo: [''],
      companyAddressRoomNo: [''],
      companyAddressFloor: [''],
      companyAddressStreet: ['', [Validators.required]],
      companyAddressQtr: ['', [ Validators.required]],
      companyAddressTownship: ['' , [Validators.required]],
      companyAddressCity: [2, [ Validators.required]],
      salaryDay: ['1'],
      companyTelNo: ['', [Validators.required]],
      contactTimeFrom: [''],
      contactTimeTo: [''],
      totalIncome: [''],
      yearOfServiceYear: ['0'],
      yearOfServiceMonth: ['0'],
      department: ['',[Validators.required]],
      position: ['', [Validators.required]],
      companyStatus: ['1'],
      companyStatusOther: ['', [Validators.required]],
      monthlyBasicIncome: ['', [currencyFormat]],
      otherIncome: ['']
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
        this.getOccupation.companyAddressBuildingNo.setValue(result.data.applicantCompanyInfoDto.companyAddressBuildingNo);
        this.getOccupation.companyAddressRoomNo.setValue(result.data.applicantCompanyInfoDto.companyAddressRoomNo);
        this.getOccupation.companyAddressFloor.setValue(result.data.applicantCompanyInfoDto.companyAddressFloor);
        this.getOccupation.companyAddressStreet.setValue(result.data.applicantCompanyInfoDto.companyAddressStreet);
        this.getOccupation.companyAddressQtr.setValue(result.data.applicantCompanyInfoDto.companyAddressQtr);
        this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {

          if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
           
    
            if (result.data.companyAddressCity !== null) {
            this.getOccupation.companyAddressCity.setValue(result.data.applicantCompanyInfoDto.companyAddressCity);
            
            dataLists.data.find( (key: any) => {
              if (Number(result.data.applicantCompanyInfoDto.companyAddressCity) === key.cityId) {
              
                this.companyTownshipList = key.townshipInfoList;
                this.getOccupation.companyAddressTownship.setValue(result.data.applicantCompanyInfoDto.companyAddressTownship);
               
    
              }
            });
          } else {
            dataLists.data.find( (key: any) => {
              if (Number(2) === key.cityId) {
                this.companyTownshipList = key.townshipInfoList;
    
    
              }
            });
      }} },(error: any) => {
        console.log('Error : ' + JSON.stringify(error))
        if(error) { this.modalService.open(ModalComponent); }
    });
       
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
          this.hideCompanyStatus=false;
          this.getOccupation.companyStatusOther.setValue(result.data.applicantCompanyInfoDto.companyStatusOther);
        } else {
          this.getOccupation.companyStatusOther.disable();
          this.hideCompanyStatus=true;
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
      this.hideCompanyStatus=false;
    } else {
      this.getOccupation.companyStatusOther.disable();
      this.hideCompanyStatus=true;
      this.getOccupation.companyStatusOther.setValue('');
    }
  }
  
  changeCity($event: any) {

    this.cityTownship.find( (key: any) => {
     if (Number($event.value) === key.cityId) {
  
         this.companyTownshipList = key.townshipInfoList;
     }
   });
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
    this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {

      if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
        for (const x of dataLists.data) {
          this.cityTownship.push(x);
        }
        dataLists.data.find( (key: any) => {
          if (Number(2) === key.cityId) {
            this.companyTownshipList = key.townshipInfoList;

          }
        });
     } },(error: any) => {
    console.log('Error : ' + JSON.stringify(error))
    if(error) { this.modalService.open(ModalComponent); }
});
    this.FormBuilder();
    this.lastApplicationInfo();

    this.occupationForm.valueChanges.subscribe((res: any) => {
      let data=res;
      if(this.occupationForm.invalid) {
        data.occupationFormError=true;
      }
      else{
        data.occupationFormError=false;
      }
      this.applicationFormService.applicantCompanyInfoDto.next(data);
    });
    
   


  }

}
