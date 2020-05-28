import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { languageValidator, minLength, numOnlyValidator, phoneNumValidator, stayPeriodValidator, emailValidation } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { nrcFormat } from 'src/app/cores/configuration';
import { ApplicationFormService } from 'src/app/cores/services/application-form.service';
import { appForm } from 'src/app/cores/helper/app-form';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';
import { invalid } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-applicaton-registration-form',
  templateUrl: './applicaton-registration-form.component.html',
  styleUrls: ['./applicaton-registration-form.component.css']
})

export class ApplicatonRegistrationFormComponent implements OnInit {
  cityTownship: any = [];
  currentTownshipList: any = [];
  permanentTownshipList: any = [];
  hideTypeOfResident: boolean =true;
  hideNationality: boolean=true;

  applicationRegistrationForm: FormGroup;
  nrcTypeList: any = [];
  townshipCodeResDtoList: any = [];
  stateIdList: any = [];
  matchTownShip: any;
  saveObject: any = {};
  finalForm: appForm;

  maxDate: any = new Date(Date.now());
  hide: boolean = true;
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
    private fb: FormBuilder,
    private modalService: NgbModal,
    private applicationFormService: ApplicationFormService
  ) { }

  get f () {
    return this.applicationRegistrationForm.controls;
  }

  private dataInit() {
    this.authService.currentUser.subscribe( (user: any) => {
      
      this.currentUser = user.data;
    });
    this.f.name.setValue(this.currentUser.userInformationResDto.name);
    

    this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {
      if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {

      for (const x of dataLists.data) {
        this.cityTownship.push(x);
      }
      dataLists.data.find( (key: any) => {
        if (Number(2) === key.cityId) {
          this.currentTownshipList = key.townshipInfoList;
          this.permanentTownshipList = key.townshipInfoList;
        }
      });
  
      }
      
    },(error: any) => {
      console.log('Error : ' + JSON.stringify(error))
      if(error) { this.modalService.open(ModalComponent); }



    });



  }

  private lastApplicationInfo() {
    this.dataService.getLastApplicationInfo(this.currentUser.access_token, this.currentUser.userInformationResDto.customerId).subscribe((result: any) => {

      if(result.status === 'SUCCESS' && result.data === null) {
        this.f.name.setValue(this.currentUser.userInformationResDto.name);
  
      }

      if(result.status === 'SUCCESS' && result.data !== null) {

        if(result.data.maritalStatus === null) {
          this.f.maritalStatus.setValue(1);
        } else {
          this.f.maritalStatus.setValue(result.data.maritalStatus);
        }

        this.f.fatherName.setValue(result.data.fatherName);
        if(result.data.highestEducationTypeId===null)
        {
          this.f.highestEducationTypeId.setValue(0);
        }
        else{
        this.f.highestEducationTypeId.setValue(result.data.highestEducationTypeId);
      }

        if(result.data.nationality === null) {
          this.f.nationality.setValue(1);
    
        } else {
      
          this.f.nationality.setValue(result.data.nationality);
       
        }

        if(result.data.gender === null) {
          this.f.gander.setValue(1);
        } else {
          this.f.gander.setValue(result.data.gender);
        }

        this.f.currentAddressBuildingNo.setValue(result.data.currentAddressBuildingNo);
        this.f.currentAddressFloor.setValue(result.data.currentAddressFloor);
        this.f.currentAddressRoomNo.setValue(result.data.currentAddressRoomNo);
        this.f.currentAddressQtr.setValue(result.data.currentAddressQtr);
        this.f.currentAddressStreet.setValue(result.data.currentAddressStreet);
        
        this.f.permanentAddressBuildingNo.setValue(result.data.permanentAddressBuildingNo);
        this.f.permanentAddressFloor.setValue(result.data.permanentAddressFloor);
        this.f.permanentAddressRoomNo.setValue(result.data.permanentAddressRoomNo);
        this.f.permanentAddressStreet.setValue(result.data.permanentAddressStreet);
        this.f.permanentAddressQtr.setValue(result.data.permanentAddressQtr);

        this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {
          if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
    
        
    
          if (result.data.currentAddressCity !== null) {
            this.f.currentAddressCity.setValue(result.data.currentAddressCity);
    
            dataLists.data.find( (key: any) => {
              if (Number(result.data.currentAddressCity) === key.cityId) {
                this.currentTownshipList = key.townshipInfoList;
                this.f.currentAddressTownship.setValue(result.data.currentAddressTownship);
    
    
              }
            });
          } else {
            dataLists.data.find( (key: any) => {
              if (Number(2) === key.cityId) {
                this.currentTownshipList = key.townshipInfoList;
    
    
              }
            });
    
          }
          if (result.data.permanentAddressCity !== null) {
    
            this.f.permanentAddressCity.setValue(result.data.permanentAddressCity);
            dataLists.data.find( (key: any) => {
              if (Number(result.data.permanentAddressCity) === key.cityId) {
    
                this.permanentTownshipList=key.townshipInfoList;
    
                this.f.permanentAddressTownship.setValue(result.data.permanentAddressTownship);
    
              }
            });
          } else {
            dataLists.data.find( (key: any) => {
              if (Number(2) === key.cityId) {
    
                this.permanentTownshipList = key.townshipInfoList;
    
              }
            });
    
          }}
          
        },(error: any) => {
          console.log('Error : ' + JSON.stringify(error))
          if(error) { this.modalService.open(ModalComponent); }
    
    
    
        });
    

        if(result.data.livingWith === null) {
          this.f.livingWith.setValue(0);
        } else {
          this.f.livingWith.setValue(result.data.livingWith.toString());
        }

        if(result.data.typeOfResidence === null) {
          this.f.typeOfResidence.setValue('1');
        } else {
          this.f.typeOfResidence.setValue(result.data.typeOfResidence.toString());
       
        }

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

      

        if(result.data.yearOfStayYear === null) {
          this.f.yearOfStayYear.setValue('0');
        } else {
          this.f.yearOfStayYear.setValue(result.data.yearOfStayYear.toString());
        }

        if(result.data.yearOfStayMonth === null) {
          this.f.yearOfStayMonth.setValue('0');
        } else {
          this.f.yearOfStayMonth.setValue(result.data.yearOfStayMonth.toString());
        }

  
        this.f.otherPhoneNo.setValue(result.data.otherPhoneNo);
        this.f.residentTelNo.setValue(result.data.residentTelNo);
        this.f.email.setValue(result.data.email);

      

        if(result.data.nationality === 1) {

          this.f.nationalityOther.disable();
          this.hideNationality=true;
        } else {
          this.f.nationalityOther.enable();
          this.hideNationality = false;
        }

        if(result.data.typeOfResidence === 5) {
          this.f.typeOfResidenceOther.enable();
          this.hideTypeOfResident=false;
        } else {
          this.f.typeOfResidenceOther.disable();
          this.hideTypeOfResident=true;
        }
      }

    });
  }

  private FormBuilder () {
    this.applicationRegistrationForm = this.fb.group({
    
      name:['',[Validators.required]],
      fatherName: ['', [Validators.required]],
      highestEducationTypeId: ['1', [Validators.required]],
      nationality: [1, [Validators.required]],
      nationalityOther: ['', [Validators.required]],
      gander: [1, [Validators.required]],
      maritalStatus: [1, [Validators.required]],
      currentAddressBuildingNo: [''],
      currentAddressRoomNo: [''],
      currentAddressFloor: [''],
      currentAddressStreet: ['', [Validators.required]],
      currentAddressQtr: ['', [ Validators.required]],
      currentAddressTownship: [ , [Validators.required]],
      currentAddressCity: [2, [Validators.required]],
      permanentAddressBuildingNo: [''] ,
      permanentAddressRoomNo: ['' ],
      permanentAddressFloor: [''],
      permanentAddressStreet: [''],
      permanentAddressQtr: [''],
      permanentAddressTownship: [],
      permanentAddressCity: [2],
      typeOfResidence: ['1', [Validators.required]],
      typeOfResidenceOther: ['', [ Validators.required]],
      livingWith: ['1', [Validators.required]],
      yearOfStayYear: ['0'],
      yearOfStayMonth: ['0'],
    
      residentTelNo: [''],
      otherPhoneNo: [''],
      email: ['', [ Validators.email, languageValidator,emailValidation]]
    }, { validators: stayPeriodValidator });

    this.f.nationalityOther.disable();
    this.f.typeOfResidenceOther.disable();

  }

  errorHandling = (control: string, error: string) => {
    return this.applicationRegistrationForm.controls[control].hasError(error);
  }


  arrayOne(n: number): any[] {
    return Array(n);
  }

  enableOtherNationality($event: any) {
    if($event.value === 1) {
      this.f.nationalityOther.disable();
      this.hideNationality=true;
      this.f.nationalityOther.setValue('');
    }

    if($event.value === 2) {
      this.f.nationalityOther.enable();
      this.hideNationality=false;
     
    }
  }

  typeOfResidenceChange($event: any) {
    if(Number($event.value) === 5) {
      this.f.typeOfResidenceOther.enable();
      this.hideTypeOfResident=false;
    }else {
      this.f.typeOfResidenceOther.disable();
      this.hideTypeOfResident=true;
      this.f.typeOfResidenceOther.setValue('');
    }
  }

  changeCity($event: any, current: any) {
  

    this.cityTownship.find( (key: any) => {
     if (Number($event.value) === key.cityId) {
       if(current==="current"){
     
         this.currentTownshipList = key.townshipInfoList;
       }
    else{
     this.permanentTownshipList = key.townshipInfoList;
    }
   
     }
   });
   }

  dataSet() {

    this.saveObject.daApplicationTypeId = 1;
    this.saveObject.name = this.currentUser.userInformationResDto.name;
    this.saveObject.dob =  this.currentUser.userInformationResDto.dateOfBirth;
    this.saveObject.nrcNo = this.currentUser.userInformationResDto.nrcNo;
    this.saveObject.fatherName = this.f.fatherName.value;
    this.saveObject.highestEducationTypeId=this.f.highestEducationTypeId.value;
    this.saveObject.nationality = this.f.nationality.value;

    if( this.saveObject.nationality === 1) {
      this.saveObject.nationalityOther = '';
    } else {
      this.saveObject.nationalityOther = this.f.nationalityOther.value;
    }

    this.saveObject.gender = this.f.gander.value;
    this.saveObject.maritalStatus = this.f.maritalStatus.value;
    this.saveObject.currentAddressBuildingNo = this.f.currentAddressBuildingNo.value;
    this.saveObject.currentAddressFloor =  this.f.currentAddressFloor.value;
    this.saveObject.currentAddressRoomNo = this.f.currentAddressRoomNo.value;
    this.saveObject.currentAddressStreet = this.f.currentAddressStreet.value;
    this.saveObject.currentAddressQtr = this.f.currentAddressQtr.value;
    this.saveObject.currentAddressTownship = this.f.currentAddressTownship.value;
    this.saveObject.currentAddressCity = this.f.currentAddressCity.value;
    this.saveObject.permanentAddressBuildingNo = this.f.permanentAddressBuildingNo.value;
    this.saveObject.permanentAddressFloor = this.f.permanentAddressFloor.value;
    this.saveObject.permanentAddressRoomNo =this.f.permanentAddressRoomNo.value;
    this.saveObject.permanentAddressStreet = this.f.permanentAddressStreet.value;
    this.saveObject.permanentAddressQtr = this.f.permanentAddressQtr.value;
    this.saveObject.permanentAddressTownship = this.f.permanentAddressTownship.value;
    this.saveObject.permanentAddressCity = this.f.permanentAddressCity.value;
    this.saveObject.typeOfResidence = Number(this.f.typeOfResidence.value);

    if(Number(this.f.typeOfResidence.value) !== 5) {
      this.saveObject.typeOfResidenceOther = '';
    } else {
      this.saveObject.typeOfResidenceOther = this.f.typeOfResidenceOther.value;
    }

    this.saveObject.livingWith = Number(this.f.livingWith.value);


    this.saveObject.yearOfStayYear = Number(this.f.yearOfStayYear.value);
    this.saveObject.yearOfStayMonth = Number(this.f.yearOfStayMonth.value);
    this.saveObject.mobileNo = this.currentUser.userInformationResDto.phoneNo;
    this.saveObject.residentTelNo = this.f.residentTelNo.value;
    this.saveObject.otherPhoneNo = this.f.otherPhoneNo.value;
    this.saveObject.email = this.f.email.value;
    this.saveObject.daApplicationTypeId = 1;
    this.saveObject.customerId = this.currentUser.userInformationResDto.customerId;
    this.saveObject.channelType = 2;
  }

  applicationDataSave() {
    

    this.loading = true;

    if(this.applicationRegistrationForm.invalid) {
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      this.loading = false;
      return;
    }

    this.dataSet();

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
    this.applicationRegistrationForm.valueChanges.subscribe((res: any) => {
      let data = res;
      data.name=this.currentUser.userInformationResDto.name;
      data.dob= this.currentUser.userInformationResDto.dateOfBirth;
      data.mobileNo=this.currentUser.userInformationResDto.phoneNo;
      data.nrcNo = this.currentUser.userInformationResDto.nrcNo;
      data.gender = res.gander;
      if(this.applicationRegistrationForm.invalid) {
        data.applicationFormError= true;
      }
      else{
        data.applicationFormError=false;
      }


      this.applicationFormService.applicationFormObject.next(data);
    });
  }
  error(){
    
  }

}
