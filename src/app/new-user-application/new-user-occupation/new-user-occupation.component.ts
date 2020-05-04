import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { languageValidator, errorMessage, numOnlyValidator, servicePeriodValidator } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';

import { NumeralPipe } from 'ngx-numeral';

import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-new-user-occupation',
  templateUrl: './new-user-occupation.component.html',
  styleUrls: ['./new-user-occupation.component.css']
})

export class NewUserOccupationComponent implements OnInit {
  year: any;
  month: any;
  yearOfServiceError = true;
  applicantCompanyInfoDto : any= {};
  totalIncome: any;
  companyTownshipList: any = [];
  cityTownship: any = [];
  newRegister: any = {};
  hideCompanyStatus = true;
  occupationForm: FormGroup;

  guarantorInfoDto: any;
  saveObject: any;
  currentUser: any;
  errorMsg: any;
  submitted = false;
  loading = false;
  id: number;
  modalOptions: NgbModalOptions;
  nextLoading = false;
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
  
  @ViewChild('erorrSnack', { static: false })
  erorrSnack: any = TemplateRef;


  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private activeRouter: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.modalOptions = { backdrop: 'static', backdropClass: 'customBackdrop' };
    if (localStorage.getItem('newRegister')) {
      this.newRegister = JSON.parse(localStorage.getItem('newRegister'));

      if(!('name' in this.newRegister) || this.newRegister.applicantFormError){
        this.dataService.formError=true;
        this.router.navigate(['/new-user/']);
      }

    if(this.dataService.formError){
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
    this.dataService.formError=false;
    }

    } else {
      this.router.navigate(['login']);


  }

  }

  public errorHandling = (control: string, error: string) => {
    return this.occupationForm.controls[control].hasError(error);
  }

  ngOnInit() {


    this.errorMsg = errorMessage;
    this.authService.refreshToken();
    this.occupationFormBulider();

  }



  nextSubmit() {
    this.submitted = true;
    this.nextLoading = true;
    if (this.occupationForm.invalid) { this.nextLoading = false; return; }
    this.saveDraft();
    this.router.navigate(['/new-user-emergency/'], { queryParams:  filter, skipLocationChange: true});
  }

  get f() { return this.occupationForm.controls; }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  occupationFormBulider() {
    if ('applicantCompanyInfoDto' in this.newRegister){
   this.applicantCompanyInfoDto=this.newRegister.applicantCompanyInfoDto;
  }
    this.occupationForm = this.fb.group({
      companyName: [this.applicantCompanyInfoDto.companyName, [Validators.required]],

      companyBuildingNo: [this.applicantCompanyInfoDto.companyAddressBuildingNo],
      companyRoomNo: [this.applicantCompanyInfoDto.companyAddressRoomNo],
      companyFloor: [this.applicantCompanyInfoDto.companyAddressFloor],
      companyStreet: [this.applicantCompanyInfoDto.companyAddressStreet, [Validators.required]],
      companyQtr: [this.applicantCompanyInfoDto.companyAddressQtr, [ Validators.required]],
      companyTownship: [ , [Validators.required]],
      companyCity: [2, [ Validators.required]],
      salaryDay: ['1', [ Validators.required]],
      companyTelNo: [this.applicantCompanyInfoDto.companyTelNo, [Validators.required, numOnlyValidator]],
      contactTimeFrom: [this.applicantCompanyInfoDto.contactTimeFrom],
      contactTimeTo: [this.applicantCompanyInfoDto.contactTimeTo],

      yearOfServiceYear: ['0'],
      yearOfServiceMonth: ['0'] ,
      department: [this.applicantCompanyInfoDto.department, [Validators.required]],
      position: [this.applicantCompanyInfoDto.position, [Validators.required]],
      companyStatus: ['1'],
      companyStatusOther: [this.applicantCompanyInfoDto.companyStatusOther, [Validators.required]],
      monthlyBasicIncome: [this.applicantCompanyInfoDto.monthlyBasicIncome, [Validators.required] ],
      otherIncome: [this.applicantCompanyInfoDto.otherIncome ]
    }, { validators: servicePeriodValidator });
    this.totalIncome =this.applicantCompanyInfoDto.totalIncome;
    this.f.companyStatusOther.disable();
    if ('companyStatus' in this.applicantCompanyInfoDto) {
        this.f.companyStatus.setValue(this.applicantCompanyInfoDto.companyStatus);
        if (Number(this.applicantCompanyInfoDto.companyStatus) === 12) {
          this.hideCompanyStatus = false;
          this.f.companyStatusOther.enable();

        } else {
          this.hideCompanyStatus = true;
          this.f.companyStatusOther.disable();
          this.f.companyStatusOther.setValue('');
        }

      }
    if ('yearOfServiceYear' in this.applicantCompanyInfoDto) {
        this.f.yearOfServiceYear.setValue(this.applicantCompanyInfoDto.yearOfServiceYear);

      }
    if ('yearOfServiceMonth' in this.applicantCompanyInfoDto) {
        this.f.yearOfServiceMonth.setValue(this.applicantCompanyInfoDto.yearOfServiceMonth);

      }
    this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {

      if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
        for (const x of dataLists.data) {
          this.cityTownship.push(x);
        }

        if ('companyAddressCity' in this.applicantCompanyInfoDto) {
        this.f.companyCity.setValue(this.applicantCompanyInfoDto.companyAddressCity);

        dataLists.data.find( (key: any) => {
          if (Number(this.applicantCompanyInfoDto.companyAddressCity) === key.cityId) {
            console.log('Hello');
            this.companyTownshipList = key.townshipInfoList;
            this.f.companyTownship.setValue(this.applicantCompanyInfoDto.companyAddressTownship);


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
}



    saveDraft() {
    const  applicantCompanyInfoDto={
      daApplicantCompanyInfoId: null,
      companyName : this.f.companyName.value,
      companyAddressBuildingNo :this.f.companyBuildingNo.value,
      companyAddressRoomNo : this.f.companyRoomNo.value,
      companyAddressFloor : this.f.companyFloor.value,
      companyAddressStreet : this.f.companyStreet.value,
      companyAddressQtr : this.f.companyQtr.value,
      companyAddressCity : this.f.companyCity.value,
      companyAddressTownship : this.f.companyTownship.value,
      companyTelNo : this.f.companyTelNo.value,
      contactTimeFrom : this.f.contactTimeFrom.value,
      contactTimeTo : this.f.contactTimeTo.value,
      department : this.f.department.value,
      position : this.f.position.value,
      yearOfServiceYear : this.f.yearOfServiceYear.value,
      yearOfServiceMonth : this.f.yearOfServiceMonth.value,
      companyStatus : this.f.companyStatus.value,
      companyStatusOther : this.f.companyStatusOther.value,
      monthlyBasicIncome : this.f.monthlyBasicIncome.value,
      otherIncome : this.f.otherIncome.value,

      totalIncome : new NumeralPipe(this.totalIncome).value(),
      salaryDay : this.f.salaryDay.value,

    }
   
    this.newRegister.applicantCompanyInfoDto = applicantCompanyInfoDto;

    if (this.occupationForm.invalid){
      this.newRegister.applicantCompanyInfoDto.occupationFormError=true;
    }
    else{
      this.newRegister.applicantCompanyInfoDto.occupationFormError=false;
    }
   localStorage.setItem('newRegister', JSON.stringify(this.newRegister));
  }

    yearAndMonth(n: number): any[] {
    return Array(n);
  }
    changeCompanyStatus($event: any) {
    if (Number($event.value) === 12) {
      this.hideCompanyStatus = false;
      this.f.companyStatusOther.enable();
    } else {
      this.hideCompanyStatus = true;
      this.f.companyStatusOther.disable();
      this.f.companyStatusOther.setValue('');
    }
  }

    changeCity($event: any) {
  console.log($event.value);
  this.cityTownship.find( (key: any) => {
   if (Number($event.value) === key.cityId) {

       this.companyTownshipList = key.townshipInfoList;
   }
 });
 }
 calculate($event: any, type: any) {

   if (type === 'monthly') {

this.totalIncome = new NumeralPipe($event.target.value).value() + new NumeralPipe(this.f.otherIncome.value).value();
   } else if (type === 'other') {
    this.totalIncome =  new NumeralPipe($event.target.value).value() +  new NumeralPipe(this.f.monthlyBasicIncome.value).value();
   }


 }
changeContactTime($event: any, type: any){
  console.log($event.target.value);
  console.log(type);

}
clickLink($event: any){
  this.submitted = true;
  this.nextLoading = true;
  if (this.occupationForm.invalid) { 
    this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
    this.nextLoading = false; return; }
  this.saveDraft();
  console.log('Next');
  this.router.navigate(['/'+$event.target.id+'/'], { queryParams:  filter, skipLocationChange: true});

}
clickBackLink($event: any){
  this.saveDraft();
  this.router.navigate(['/'+$event.target.id+'/'], { queryParams:  filter, skipLocationChange: true});
}
back(){
  this.saveDraft();  this.router.navigate(['/new-user/'], { queryParams:  filter, skipLocationChange: true});
}


}
