import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/cores/helper/data.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/cores/services/auth.service';
import { languageValidator, minLength, numOnlyValidator, phoneNumValidator, guarantorPeriodValidator, servicePeriodValidator } from 'src/app/cores/helper/validators';
import { nrcFormat } from 'src/app/cores/configuration';
import { ApplicationFormService } from 'src/app/cores/services/application-form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';

@Component({
  selector: 'app-applicationemguarantor-formm',
  templateUrl: './applicationemguarantor-formm.component.html',
  styleUrls: ['./applicationemguarantor-formm.component.css']
})
export class ApplicationemguarantorFormmComponent implements OnInit {
  currentTownshipList: any =[];
  companyTownshipList: any = [];
  cityTownship: any = [];
  hideRWA:boolean= true;
  hideTOR:boolean=true;
  hideNationality:boolean=true;
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
    maximumValue: '99999999',
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

  get getGuarantor() {
    return this.guarantorForm.controls;
  }

  private dataInit() {
    this.authService.currentUser.subscribe((user: any) => {
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

    this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {

      if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
      for (const x of dataLists.data) {
        this.cityTownship.push(x);
      }
      dataLists.data.find( (key: any) => {
        if (Number(2) === key.cityId) {
          this.currentTownshipList = key.townshipInfoList;
          this.companyTownshipList = key.townshipInfoList;
        }
      });
}},(error: any) => {
  console.log('Error : ' + JSON.stringify(error))
  if(error) { this.modalService.open(ModalComponent); }});
  }

  private lastApplicationInfo() {
    this.dataService.getLastApplicationInfo(this.currentUser.access_token, this.currentUser.userInformationResDto.customerId).subscribe((result: any) => {

      if(result.status === 'SUCCESS' && result.data === null) {
        this.saveObject.name = this.currentUser.userInformationResDto.name;
        this.saveObject.dob = new Date(this.currentUser.userInformationResDto.dateOfBirth);
        this.saveObject.guarantorInfoDto= null;
      }

      if(result.status === 'SUCCESS' && result.data !== null) {
        if(result.data.guarantorInfoDto !== null) {

          this.getGuarantor.name.setValue(result.data.guarantorInfoDto.name);
          this.getGuarantor.dob.setValue(new Date(result.data.guarantorInfoDto.dob));
          this.getGuarantor.mobileNo.setValue(result.data.guarantorInfoDto.mobileNo);
          this.getGuarantor.residentTelNo.setValue(result.data.guarantorInfoDto.residentTelNo);
          this.getGuarantor.currentAddressBuildingNo.setValue(result.data.guarantorInfoDto.currentAddressBuildingNo);
          this.getGuarantor.currentAddressRoomNo.setValue(result.data.guarantorInfoDto.currentAddressRoomNo);
          this.getGuarantor.currentAddressFloor.setValue(result.data.guarantorInfoDto.currentAddressFloor);
          this.getGuarantor.currentAddressStreet.setValue(result.data.guarantorInfoDto.currentAddressStreet);
          this.getGuarantor.currentAddressQtr.setValue(result.data.guarantorInfoDto.currentAddressQtr);
          this.getGuarantor.companyName.setValue(result.data.guarantorInfoDto.companyName);
          this.getGuarantor.companyTelNo.setValue(result.data.guarantorInfoDto.companyTelNo);
          this.getGuarantor.companyAddressBuildingNo.setValue(result.data.guarantorInfoDto.companyAddressBuildingNo);
          this.getGuarantor.companyAddressRoomNo.setValue(result.data.guarantorInfoDto.companyAddressRoomNo);
          this.getGuarantor.companyAddressFloor.setValue(result.data.guarantorInfoDto.companyAddressFloor);
          this.getGuarantor.companyAddressStreet.setValue(result.data.guarantorInfoDto.companyAddressStreet);
          this.getGuarantor.companyAddressQtr.setValue(result.data.guarantorInfoDto.companyAddressQtr);
          this.getGuarantor.department.setValue(result.data.guarantorInfoDto.department);
          this.getGuarantor.position.setValue(result.data.guarantorInfoDto.position);

          this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {

            if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {

            if (result.data.guarantorInfoDto.companyAddressCity !== null) {
              this.getGuarantor.currentAddressCity.setValue(result.data.guarantorInfoDto.currentAddressCity);
      
              dataLists.data.find( (key: any) => {
                if (Number(result.data.guarantorInfoDto.currentAddressCity) === key.cityId) {
                  this.currentTownshipList = key.townshipInfoList;
                  this.getGuarantor.currentAddressTownship.setValue(result.data.guarantorInfoDto.currentAddressTownship);
      
      
                }
              });
            } else {
              dataLists.data.find( (key: any) => {
                if (Number(2) === key.cityId) {
                  this.currentTownshipList = key.townshipInfoList;
      
      
                }
              });
      
            }
            if (result.data.guarantorInfoDto.companyAddressCity) {
            this.getGuarantor.companyAddressCity.setValue(result.data.guarantorInfoDto.companyAddressCity);
      
            dataLists.data.find( (key: any) => {
              if (Number(result.data.guarantorInfoDto.companyAddressCity) === key.cityId) {
                console.log('Hello');
                this.companyTownshipList = key.townshipInfoList;
                this.getGuarantor.companyAddressTownship.setValue(result.data.guarantorInfoDto.companyAddressTownship);
      
      
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

          if(result.data.guarantorInfoDto.monthlyBasicIncome === null || result.data.guarantorInfoDto.monthlyBasicIncome === undefined) {
            this.guarantorTotalIncomeChange(null,0);
          } else {
            this.guarantorTotalIncomeChange(null,result.data.guarantorInfoDto.monthlyBasicIncome);
          }

          if(result.data.guarantorInfoDto.totalIncome === null || result.data.guarantorInfoDto.totalIncome === undefined) {
            this.guarantorTotalIncomeChange(null,0);
          } else {
            this.guarantorTotalIncomeChange(null,result.data.guarantorInfoDto.totalIncome);
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
              this.hideNationality=false;
            }

            if(result.data.guarantorInfoDto.relationship === 5 && result.data.guarantorInfoDto.relationship !== null) {
              this.getGuarantor.relationshipOther.setValue(result.data.guarantorInfoDto.relationshipOther);
              this.getGuarantor.relationshipOther.enable();
              this.hideRWA=false;
            }

            if(result.data.guarantorInfoDto.typeOfResidence === 5 && result.data.guarantorInfoDto.typeOfResidence !== null) {
              this.getGuarantor.typeOfResidenceOther.setValue(result.data.guarantorInfoDto.typeOfResidenceOther);
              this.getGuarantor.typeOfResidenceOther.enable();
              this.hideTOR=false;
            }
        }
        }

    });
  }

  private guarantorFormBuilder() {
    this.guarantorForm = this.fb.group({
      name: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      nrcType: ['(N)'],
      nrcCode:[1],
      nrcList:[],
      nrcNo:['', [Validators.required,  minLength(6), numOnlyValidator]],
      nationality: [1, [Validators.required]],
      nationalityOther: ['', [Validators.required]],
      mobileNo: ['', [Validators.required, numOnlyValidator, phoneNumValidator, minLength(9)]],
      residentTelNo: [''],
      relationship: ['1'],
      relationshipOther: ['', [Validators.required]],
      currentAddressBuildingNo: [''],
      currentAddressRoomNo: [''],
      currentAddressFloor: [''],
      currentAddressStreet: ['', [Validators.required]],
      currentAddressQtr: ['', [ Validators.required]],
      currentAddressTownship: ['' , [Validators.required]],
      currentAddressCity: [2, [Validators.required]],
      typeOfResidence: ['1'],
      typeOfResidenceOther: ['', [Validators.required, languageValidator]],
      livingWith: ['1'],
      livingWithOther: ['', [Validators.required]],
      gender: [1],
      maritalStatus: [1, [Validators.required]],
      yearOfStayYear: ['0'],
      yearOfStayMonth: ['0'],
      companyName: ['', [Validators.required]],
      companyTelNo: ['', [Validators.required]],
      companyAddressBuildingNo: [''],
      companyAddressRoomNo: [''],
      companyAddressFloor: [''],
      companyAddressStreet: ['', [Validators.required]],
      companyAddressQtr: ['', [ Validators.required]],
      companyAddressTownship: ['' , [Validators.required]],
      companyAddressCity: [2, [ Validators.required]],
      department: ['', [Validators.required]],
      position: ['', [Validators.required]],
      yearOfServiceYear: ['0', [Validators.required, numOnlyValidator]],
      yearOfServiceMonth: ['0', [Validators.required, numOnlyValidator]],
      monthlyBasicIncome: ['',[Validators.required]],
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
      this.hideNationality=true;
      this.getGuarantor.nationalityOther.setValue('');
    }

    if($event.value === 2) {
      this.getGuarantor.nationalityOther.enable();
      this.hideNationality=false; 
    }
  }

  relationshipChange($event: any){
    if(Number($event.value) === 5) {
      this.getGuarantor.relationshipOther.enable();
      this.hideRWA=false;
    } else {
      this.getGuarantor.relationshipOther.disable();
      this.hideRWA=true;
      this.getGuarantor.relationshipOther.setValue('');
    }
  }

  typeOfResidenceChange($event: any) {
    if(Number($event.value) === 5) {
      this.getGuarantor.typeOfResidenceOther.enable();
      this.hideTOR=false;
    }else {
      this.getGuarantor.typeOfResidenceOther.disable();
      this.hideTOR=true;
      this.getGuarantor.typeOfResidenceOther.setValue('');
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

  guarantorTotalIncomeChange($event?: any, number?: any) {
    if($event) {
      this.getGuarantor.totalIncome.setValue($event.target.value);
    }


    if(number) {
      this.getGuarantor.monthlyBasicIncome.setValue(number);
      this.getGuarantor.totalIncome.setValue(number);
    }
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


   
    this.saveObject.guarantorInfoDto = this.guarantorForm.value;
  
    this.saveObject.guarantorInfoDto.nrcNo = this.getGuarantor.nrcCode.value + '/' + this.getGuarantor.nrcList.value  + this.getGuarantor.nrcType.value + this.getGuarantor.nrcNo.value;

    delete this.saveObject.guarantorInfoDto['nrcCode'];
    delete this.saveObject.guarantorInfoDto['nrcList'];
    delete this.saveObject.guarantorInfoDto['nrcType'];
 

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

    this.guarantorForm.valueChanges.subscribe((res: any) => {
      let data = res;

      data.nrcNo = res.nrcCode + '/' + res.nrcList + res.nrcType + res.nrcNo;

      delete data['nrcCode'];
      delete data['nrcList'];
      delete data['nrcType'];
      if(this.guarantorForm.invalid) {
        data.guarantorFormError=true;
      }
      else{
        data.guarantorFormError=false;
      }
      this.applicationFormService.guarantorInfoDto.next(data);

    });
  }

}
