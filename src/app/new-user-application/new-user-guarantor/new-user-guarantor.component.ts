import { NationalityPipe } from './../../pipes/nationality.pipe';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import {  errorMessage, numOnlyValidator, phoneNumValidator, guarantorPeriodValidator, servicePeriodValidator, minLength } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { nrcFormat } from 'src/app/cores/configuration';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NumeralPipe } from 'ngx-numeral';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-new-user-guarantor',
  templateUrl: './new-user-guarantor.component.html',
  styleUrls: ['./new-user-guarantor.component.css']
})
export class NewUserGuarantorComponent implements OnInit {
  currentTownshipList: any =[];
  companyTownshipList: any = [];
  cityTownship: any = [];
  totalIncome: any;
  yearOfStayError=true;
  yearOfServiceError=true;
  year : any;
  month :any;
  newRegister: any = {};
    hideNationality = true;
    hideTypeOfResidence = true;
    hideRelationship = true;
    hideLivingWith  = true;

  guarantorForm: FormGroup;
  saveObject: any = {};
  guarantorInfoDto: any = {};
  nrcTypeList: any;
  townshipCodeResDtoList: any;
  stateIdList: any;
  matchTownShip: any;
  currentUser: any;
  submitted: any = false;
  loading: any = false;
  nextLoading: any = false;
  errorMsg: any;
  id: any;
  modalOptions: NgbModalOptions;
  todayDate = new Date(Date.now());
  nowYear = this.todayDate.getFullYear();
  nowMonth = this.todayDate.getMonth();
  nowDay = this.todayDate.getDate();

  minDate = new Date((this.nowYear - 100), this.nowMonth, this.nowDay);
  maxDate = new Date((this.nowYear - 18), this.nowMonth, this.nowDay);
  currencyOption: any = {
    allowDecimalPadding: true,
    decimalCharacter: '.',
    decimalPlaces: '0',
    digitGroupSeparator: ',',
    digitalGroupSpacing: '3',
    maximumValue: '99999999',
    selectNumberOnly: true
  }
  
  @ViewChild('erorrSnack', { static: false })
  erorrSnack: any = TemplateRef;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private authService: AuthService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    console.log('Constructor');
    this.modalOptions = { backdrop: 'static', backdropClass: 'customBackdrop' };   if (localStorage.getItem('newRegister')) {
      this.newRegister = JSON.parse(localStorage.getItem('newRegister'));
      console.log(this.newRegister);
      if(!('emergencyContactInfoDto' in this.newRegister) ||this.newRegister.applicantFormError || this.newRegister.applicantCompanyInfoDto.occupationFormError || this.newRegister.emergencyContactInfoDto.emergencyFormError){
        this.dataService.formError=true;
        this.router.navigate(['/new-user-emergency/']);
      }
      if(this.dataService.formError){
        this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.dataService.formError=false;
      }
  

    } else {
      this.router.navigate(['login']);


  }


  }

  ngOnInit() {
    this.errorMsg = errorMessage;

    this.guarantorFormBuilder();


  }



  nextSubmit() {
    this.submitted = true;
    this.nextLoading = true;
    console.log(this.guarantorForm.invalid);
    console.log(this.guarantorForm);
    if (this.guarantorForm.invalid) { this.nextLoading = false; return; }
    this.saveDraft();
    console.log('Hello');
    this.router.navigate(['/new-user-loan/'], { queryParams:  filter, skipLocationChange: true});
  }

  get f() { return this.guarantorForm.controls; }

  guarantorFormBuilder() {
    if('guarantorInfoDto' in this.newRegister){
      this.guarantorInfoDto = this.newRegister.guarantorInfoDto;

    }
    this.guarantorForm = this.fb.group({
      name: [this.guarantorInfoDto.name, [Validators.required]],
      dob: [this.guarantorInfoDto.dob, [Validators.required]],
      nrcType: ['(N)'],
      nrcCode: [1],
      nrcList: [],
      nrcNo: [, [Validators.required, numOnlyValidator]],
      nationality: [1, [Validators.required]],
      nationalityOther: [this.guarantorInfoDto.nationalityOther, [Validators.required]],
      mobileNo: [this.guarantorInfoDto.mobileNo, [Validators.required, numOnlyValidator, phoneNumValidator, minLength(9)]],
      residentTelNo: [this.guarantorInfoDto.residentTelNo],
      relationship: [1],
      relationshipOther: [this.guarantorInfoDto.relationshipOther, [Validators.required]],

      currentBuildingNo: [this.guarantorInfoDto.currentAddressBuildingNo],
      currentRoomNo: [this.guarantorInfoDto.currentAddressRoomNo],
      currentFloor: [this.guarantorInfoDto.currentAddressFloor],
      currentStreet: [this.guarantorInfoDto.currentAddressStreet,[Validators.required]],
      currentQtr: [this.guarantorInfoDto.currentAddressQtr, [ Validators.required]],
      currentTownship: [ ,Validators.required],
      currentCity: [2 ],
      typeOfResidence: [1],
      typeOfResidenceOther: [this.guarantorInfoDto.typeOfResidenceOther, [Validators.required]],
      livingWith: [1],
      gender: [1],
      maritalStatus: [1, [Validators.required]],
      yearOfStayYear: ['0', [Validators.required]],
      yearOfStayMonth: ['0', [Validators.required]],
      companyName: [this.guarantorInfoDto.companyName, [Validators.required,]],
      companyTelNo: [this.guarantorInfoDto.companyTelNo, [Validators.required, numOnlyValidator,phoneNumValidator]],
      companyBuildingNo: [this.guarantorInfoDto.companyAddressBuildingNo],
      companyRoomNo: [this.guarantorInfoDto.companyAddressRoomNo],
      companyFloor: [this.guarantorInfoDto.companyAddressFloor],
      companyStreet: [this.guarantorInfoDto.companyAddressStreet, [ Validators.required]],
      companyQtr: [this.guarantorInfoDto.compnayAddressQtr, [ Validators.required]],
      companyTownship: [ ,[Validators.required]] ,
      companyCity: [2],
      department: [this.guarantorInfoDto.department, [Validators.required]],
      position: [this.guarantorInfoDto.position, [Validators.required]],
      yearOfServiceYear: ['0', [Validators.required ]],
      yearOfServiceMonth: ['0', [Validators.required]],
      monthlyBasicIncome: ['', [Validators.required]],

    } ,{validators: [guarantorPeriodValidator, servicePeriodValidator]});
    this.f.nationalityOther.disable();
    this.f.relationshipOther.disable();
    this.f.typeOfResidenceOther.disable();

    this.dataService.townshipCodeList().subscribe( (res: any) => {
      if(res.status === 'SUCCESS' && res.data !== null) {
      const rowStateId = [];

      for (const x of res.data.townshipCodeResDtoList) {
        rowStateId.push(x.stateId);
      }

      this.nrcTypeList = res.data.nrcTypeList;
      this.townshipCodeResDtoList = res.data.townshipCodeResDtoList;
      this.stateIdList = rowStateId;
      this.matchTownShip = res.data.townshipCodeResDtoList[0].townshipCodeList;
      this.f.nrcList.setValue(res.data.townshipCodeResDtoList[0].townshipCodeList[0]);
 
      if ('nrcNo' in this.guarantorInfoDto){
      const nrc=nrcFormat(this.guarantorInfoDto.nrcNo);
      this.f.nrcType.setValue(nrc.type); 
      this.f.nrcCode.setValue(nrc.no);    
      this.f.nrcNo.setValue(nrc.code);
      res.data.townshipCodeResDtoList.find((key: any)=> {
        if (nrc.no===key.stateId){
            this.matchTownShip=key.townshipCodeList;
            this.f.nrcList.setValue(nrc.list);
        }});
    }}},(error: any) => {
      console.log('Error : ' + JSON.stringify(error))
      if(error) { this.modalService.open(ModalComponent); }});


    if('nationality' in this.guarantorInfoDto){
      this.f.nationality.setValue(this.guarantorInfoDto.nationality);
      if (this.guarantorInfoDto.nationality=== 2){
        this.hideNationality=false;
        this.f.nationalityOther.enable();
      }
      else{
        this.hideNationality=true;
        this.f.nationalityOther.disable();
        this.f.nationalityOther.setValue('');

      }

    }
    if('gender' in this.guarantorInfoDto){
      this.f.gender.setValue(this.guarantorInfoDto.gender);
    }
    if('maritalStatus' in this.guarantorInfoDto){
      this.f.maritalStatus.setValue(this.guarantorInfoDto.maritalStatus);
    }
    if('relationship' in this.guarantorInfoDto){
      this.f.relationship.setValue(this.guarantorInfoDto.relationship);
      if(this.guarantorInfoDto.relationship === 5){
        this.hideRelationship=false;
        this.f.relationshipOther.enable();
      }
      else{
        this.hideRelationship=true;
        this.f.relationshipOther.disable();
        this.f.relationshipOther.setValue('');
      }

    }
    if('typeOfResidence' in this.guarantorInfoDto){
      this.f.typeOfResidence.setValue(this.guarantorInfoDto.typeOfResidence);
      if(this.guarantorInfoDto.typeOfResidence=== 5){
        this.hideTypeOfResidence = false;
        this.f.typeOfResidenceOther.enable();
      } else {
        this.hideTypeOfResidence = true;
        this.f.typeOfResidenceOther.disable();
        this.f.typeOfResidenceOther.setValue('');
      }
    }
    if ('livingWith' in this.guarantorInfoDto){
      this.f.livingWith.setValue(this.guarantorInfoDto.livingWith);

    }
    this.totalIncome=this.guarantorInfoDto.totalIncome;
    this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {

      if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
      for (const x of dataLists.data) {
        this.cityTownship.push(x);
      }

      if ('currentAddressCity' in this.guarantorInfoDto) {
        this.f.currentCity.setValue(this.guarantorInfoDto.currentAddressCity);

        dataLists.data.find( (key: any) => {
          if (Number(this.guarantorInfoDto.currentAddressCity) === key.cityId) {
            this.currentTownshipList = key.townshipInfoList;
            this.f.currentTownship.setValue(this.guarantorInfoDto.currentAddressTownship);


          }
        });
      } else {
        dataLists.data.find( (key: any) => {
          if (Number(2) === key.cityId) {
            this.currentTownshipList = key.townshipInfoList;


          }
        });

      }
      if ('companyAddressCity' in this.guarantorInfoDto) {
      this.f.companyCity.setValue(this.guarantorInfoDto.companyAddressCity);

      dataLists.data.find( (key: any) => {
        if (Number(this.guarantorInfoDto.companyAddressCity) === key.cityId) {
          console.log('Hello');
          this.companyTownshipList = key.townshipInfoList;
          this.f.companyTownship.setValue(this.guarantorInfoDto.companyAddressTownship);


        }
      });
    } else {
      dataLists.data.find( (key: any) => {
        if (Number(2) === key.cityId) {
          this.companyTownshipList = key.townshipInfoList;


        }
      });
}
}},(error: any) => {
  console.log('Error : ' + JSON.stringify(error))
  if(error) { this.modalService.open(ModalComponent); }});
  if('yearOfStayYear' in this.guarantorInfoDto){
    this.f.yearOfStayYear.setValue(this.guarantorInfoDto.yearOfStayYear);

  }
  if('yearOfStayMonth' in this.guarantorInfoDto){
    this.f.yearOfStayMonth.setValue(this.guarantorInfoDto.yearOfStayMonth);

  }
  if('yearOfServiceYear' in this.guarantorInfoDto){
    this.f.yearOfServiceYear.setValue(this.guarantorInfoDto.yearOfServiceYear);

  }
  if('yearOfServiceMonth' in this.guarantorInfoDto){
    this.f.yearOfServiceMonth.setValue(this.guarantorInfoDto.yearOfServiceMonth);

  }
    this.f.monthlyBasicIncome.setValue(this.guarantorInfoDto.monthlyBasicIncome);
  }

  changeNrcState($event: any) {
    this.townshipCodeResDtoList.find( (key: any) => {
      if (Number($event.value) === key.stateId) {
        this.matchTownShip = key.townshipCodeList;
        this.f.nrcList.setValue(key.townshipCodeList[0]);
      }
    });
  }


  enableOtherNationality($event: any) {
    if ($event.value === 2) {
      this.hideNationality = false;
      this.f.nationalityOther.enable();
    }

    if ($event.value === 1) {
      this.hideNationality = true;
      this.f.nationalityOther.disable();
      this.f.nationalityOther.setValue('');
    }
  }

  public errorHandling = (control: string, error: string) => {
    return this.guarantorForm.controls[control].hasError(error);
  }

  relationshipChange($event: any) {
    console.log($event.value);
    if ($event.value === 5) {
      this.hideRelationship = false;
      this.f.relationshipOther.enable();
    } else {
      this.hideRelationship = true;
      this.f.relationshipOther.disable();
      this.f.relationshipOther.setValue('');

    }
  }

  typeOfResidenceChange($event: any) {
    if (Number($event.value) === 5) {
      this.hideTypeOfResidence = false;
      this.f.typeOfResidenceOther.enable();
    } else {
      this.hideTypeOfResidence = true;
      this.f.typeOfResidenceOther.disable();
      this.f.typeOfResidenceOther.setValue('');
    }
  }

  yearAndMonth(n: number): any[] {
    return Array(n);
  }



  public date(e: any) {
    let convertDate = new Date(e.target.value);
    this.guarantorForm.get('dob').setValue(convertDate, { onlyself: true });
  }

  saveDraft() {
    const guarantorInfoDto={
      daGuarantorInfoId: null,
      name: this.f.name.value,
      dob: this.f.dob.value,
      nrcNo: this.f.nrcCode.value + '/' + this.f.nrcList.value + this.f.nrcType.value +  this.f.nrcNo.value ,
      nationality: this.f.nationality.value,
      nationalityOther: this.f.nationalityOther.value,
      mobileNo: this.f.mobileNo.value,
      residentTelNo: this.f.residentTelNo.value,
      relationship: this.f.relationship.value,
      relationshipOther: this.f.relationshipOther.value,
      typeOfResidence: this.f.typeOfResidence.value,
      typeOfResidenceOther: this.f.typeOfResidenceOther.value,
      livingWith: this.f.livingWith.value,
      livingWithOther: null,
      gender: this.f.gender.value,
      maritalStatus: this.f.maritalStatus.value,
      
      yearOfStayYear: this.f.yearOfStayYear.value,
      yearOfStayMonth: this.f.yearOfStayMonth.value,
      companyName: this.f.companyName.value,
      companyTelNo: this.f.companyTelNo.value,
      department: this.f.department.value,
      position: this.f.position.value,

      yearOfServiceYear: this.f.yearOfServiceYear.value,
      yearOfServiceMonth: this.f.yearOfServiceMonth.value,
      monthlyBasicIncome: this.f.monthlyBasicIncome.value,
   
      totalIncome:    new NumeralPipe(this.totalIncome).value(),
      currentAddressFloor: this.f.currentFloor.value,
      currentAddressBuildingNo: this.f.currentBuildingNo.value,
      currentAddressRoomNo: this.f.currentRoomNo.value,
      currentAddressStreet: this.f.currentStreet.value,
      currentAddressQtr: this.f.currentQtr.value,
      currentAddressTownship: this.f.currentTownship.value,
      currentAddressCity: this.f.currentCity.value,
      companyAddressBuildingNo: this.f.companyBuildingNo.value,
      companyAddressRoomNo: this.f.companyRoomNo.value,
      companyAddressFloor: this.f.companyFloor.value,
      companyAddressStreet: this.f.companyStreet.value,
      compnayAddressQtr: this.f.companyQtr.value,
      companyAddressTownship: this.f.companyTownship.value,
      companyAddressCity: this.f.companyCity.value,
    };

   this.newRegister.guarantorInfoDto=guarantorInfoDto;

   if(this.guarantorForm.invalid){
     this.newRegister.guarantorInfoDto.guarantorFormError=true;

   }
   else{
     this.newRegister.guarantorInfoDto.guarantorFormError=false;
   }
    localStorage.setItem('newRegister', JSON.stringify(this.newRegister));
  }

  changeYearOfStay($event: any, type: any) {
    console.log('Year Of Stay');
    if (type === 'Year') {
         this.year = $event.value;
         this.month = this.f.yearOfStayMonth.value;
       } else if (type === 'Month') {
      this.year = this.f.yearOfStayYear.value;
      this.month = $event.value;
       }


    if (this.year === '0' && this.month === '0'  ) {
        console.log('ColorChange');

        document.getElementById('yearOfStayYearLabel').style.color = 'red';
        document.getElementById('yearOfStayMonthLabel').style.color = 'red';
        this.yearOfStayError = false;
        return;
      }
    this.yearOfStayError = true;
    document.getElementById('yearOfStayYearLabel').style.color = '#949494';
    document.getElementById('yearOfStayMonthLabel').style.color = '#949494';

    }
    changeYearOfService($event: any, type: any) {
      console.log('Year Of Stay');
      if (type === 'Year') {
           this.year = $event.value;
           this.month = this.f.yearOfServiceMonth.value;
         } else if (type === 'Month') {
        this.year = this.f.yearOfServiceYear.value;
        this.month = $event.value;
         }


      if (this.year === '0' && this.month === '0'  ) {
          console.log('ColorChange');

          document.getElementById('yearOfServiceYearLabel').style.color = 'red';
          document.getElementById('yearOfServiceMonthLabel').style.color = 'red';
          this.yearOfServiceError = false;
          return;
        }
      this.yearOfServiceError = true;
      document.getElementById('yearOfServiceYearLabel').style.color = '#949494';
      document.getElementById('yearOfServiceMonthLabel').style.color = '#949494';

      }
      calculate($event){
        this.totalIncome=new NumeralPipe($event.target.value).value();
      }
      changeCity($event: any, Type : any) {

        this.cityTownship.find( (key: any) => {
          if (Type === 'Company'){
         if (Number($event.value) === key.cityId) {

             this.companyTownshipList = key.townshipInfoList;
         }}
         else if (Type === 'Current' ){
          if (Number($event.value) === key.cityId) {

            this.currentTownshipList = key.townshipInfoList;
        }
         }
       });
       }
       clickLink($event: any){
        this.submitted = true;
        this.nextLoading = true;
        if (this.guarantorForm.invalid) { 
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
    this.saveDraft(); this.router.navigate(['/new-user-emergency'], { queryParams:  filter, skipLocationChange: true});
  }

}
