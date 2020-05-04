import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { languageValidator, numOnlyValidator, phoneNumValidator, minLength } from 'src/app/cores/helper/validators';
import { ApplicationFormService } from 'src/app/cores/services/application-form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';
import { combineAll } from 'rxjs/operators';

@Component({
  selector: 'app-applicationem-ergency-contact-form',
  templateUrl: './applicationem-ergency-contact-form.component.html',
  styleUrls: ['./applicationem-ergency-contact-form.component.css']
})

export class ApplicationemErgencyContactFormComponent implements OnInit {
  hideRWA:boolean=true;
  emergencyContactForm: FormGroup;
  currentUser: any;
  saveObject: any = {};
  emergencyContactInfoDto: any = {};
  currentTownshipList: any = [];
  cityTownship: any = [];

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
    private fb: FormBuilder,
    private modalService: NgbModal,
    private applicationFormService: ApplicationFormService
  ) { }

  get getEmergencyContact() {
    return this.emergencyContactForm.controls;
  }
  dataInit(){
    this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {

      if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
      for (const x of dataLists.data) {
        this.cityTownship.push(x);
      }
      dataLists.data.find( (key: any) => {
        if (Number(2) === key.cityId) {
          this.currentTownshipList = key.townshipInfoList;


        }
      });}
  
},(error: any) => {
  console.log('Error : ' + JSON.stringify(error))
  if(error) { this.modalService.open(ModalComponent); }
});
  }

  private emergencyContactFormBuilder() {
    this.emergencyContactForm = this.fb.group({
      name: ['', [Validators.required]],
      relationship: ['1'],
      relationshipOther: ['', [Validators.required]],
      currentAddressBuildingNo: ['' ],
      currentAddressRoomNo: ['' ],
      currentAddressFloor: ['' ],
      currentAddressStreet: ['' ,[ Validators.required]],
      currentAddressQtr: ['',[ Validators.required]],
      currentAddressTownship: [ ,[Validators.required]],
      currentAddressCity: [2,[ Validators.required]],
      mobileNo: ['', [ Validators.required, phoneNumValidator, minLength(9)]],
      residentTelNo: ['' ],
      otherPhoneNo: ['' ]
    });

    this.getEmergencyContact.relationshipOther.disable();
  }

  private lastApplicationInfo() {
    this.authService.currentUser.subscribe( (user: any) => {
      this.currentUser = user.data;
    });

    this.saveObject.daApplicationTypeId = 1;
    this.saveObject.channelType = 2;
    this.saveObject.customerId = this.currentUser.userInformationResDto.customerId;

    this.dataService.getLastApplicationInfo(this.currentUser.access_token, this.currentUser.userInformationResDto.customerId).subscribe((result: any) => {
      if((result.status === 'SUCCESS' && result.data === null) && (result.status === 'SUCCESS' && result.data !== null && result.data.emergencyContactInfoDto === null)) {

        this.saveObject.name = this.currentUser.userInformationResDto.name;
        this.saveObject.dob = this.currentUser.userInformationResDto.dateOfBirth;
      }

      if(result.status === 'SUCCESS' && result.data !== null && result.data.emergencyContactInfoDto !== null) {
        this.saveObject.emergencyContactInfoDto = result.data.emergencyContactInfoDto;
        this.getEmergencyContact.name.setValue(result.data.emergencyContactInfoDto.name);
        this.getEmergencyContact.currentAddressBuildingNo.setValue(result.data.emergencyContactInfoDto.currentAddressBuildingNo);
        this.getEmergencyContact.currentAddressRoomNo.setValue(result.data.emergencyContactInfoDto.currentAddressRoomNo);
        this.getEmergencyContact.currentAddressFloor.setValue(result.data.emergencyContactInfoDto.currentAddressFloor);
        this.getEmergencyContact.currentAddressStreet.setValue(result.data.emergencyContactInfoDto.currentAddressStreet);
        this.getEmergencyContact.currentAddressQtr.setValue(result.data.emergencyContactInfoDto.currentAddressQtr);


        this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {

          if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
         
    
          if (result.data.emergencyContactInfoDto.currentAddressCity) {
          this.getEmergencyContact.currentAddressCity.setValue(result.data.emergencyContactInfoDto.currentAddressCity);
    
          dataLists.data.find( (key: any) => {
            if (Number(result.data.emergencyContactInfoDto.currentAddressCity) === key.cityId) {
              this.currentTownshipList = key.townshipInfoList;
              this.getEmergencyContact.currentAddressTownship.setValue(result.data.emergencyContactInfoDto.currentAddressTownship);
       
            }
          });
        } else {
          dataLists.data.find( (key: any) => {
            if (Number(2) === key.cityId) {
              this.currentTownshipList = key.townshipInfoList;
    
            }
          });
    }}
          
    },(error: any) => {
      console.log('Error : ' + JSON.stringify(error))
      if(error) { this.modalService.open(ModalComponent); }
    });


        this.getEmergencyContact.mobileNo.setValue(result.data.emergencyContactInfoDto.mobileNo);

        if(result.data.emergencyContactInfoDto.relationship === null || result.data.emergencyContactInfoDto.relationship === undefined) {
          this.getEmergencyContact.relationship.setValue('1');
        } else {
          this.getEmergencyContact.relationship.setValue(result.data.emergencyContactInfoDto.relationship.toString());
        }

        if( result.data.emergencyContactInfoDto.relationship === 5) {
          this.getEmergencyContact.relationshipOther.enable();
          this.hideRWA=false;
          this.getEmergencyContact.relationshipOther.setValue(result.data.emergencyContactInfoDto.relationshipOther);
        } else {
          this.getEmergencyContact.relationshipOther.setValue('');
          this.hideRWA=true;
        }

        if(result.data.emergencyContactInfoDto.residentTelNo === null) {
          this.getEmergencyContact.residentTelNo.setValue('');
        }else {
          this.getEmergencyContact.residentTelNo.setValue(result.data.emergencyContactInfoDto.residentTelNo);
        }

        if(result.data.emergencyContactInfoDto.otherPhoneNo === null) {
          this.getEmergencyContact.otherPhoneNo.setValue('');
        } else {
          this.getEmergencyContact.otherPhoneNo.setValue(result.data.emergencyContactInfoDto.otherPhoneNo);
        }
      }
    });
  }

  errorHandling = (control: string, error: string) => {
    return this.emergencyContactForm.controls[control].hasError(error);
  }

  relationshipChange($event: any){
    if(Number($event.value) === 5) {
      this.getEmergencyContact.relationshipOther.enable();
      this.hideRWA=false;
    } else {
      this.getEmergencyContact.relationshipOther.disable();
      this.hideRWA=true;
      this.getEmergencyContact.relationshipOther.setValue('');
    }
  }
  changeCity($event: any) {

    this.cityTownship.find( (key: any) => {
     if (Number($event.value) === key.cityId) {

         this.currentTownshipList = key.townshipInfoList;


     }
   });
   }

  emergencySave() {
    this.loading = true;

    if(this.emergencyContactForm.invalid) {
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      this.loading = false;
      return;
    }

    this.saveObject.emergencyContactInfoDto = this.emergencyContactForm.value;

    this.dataService.saveDraft(this.currentUser.access_token, this.saveObject).subscribe((res: any) => {
      if(res.status === 'SUCCESS') {
        this.snackBar.openFromTemplate(this.saveSnackBar, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      }
    });

    this.loading = false;
  }

  ngOnInit() {
    this.dataInit();
    this.emergencyContactFormBuilder();
    this.lastApplicationInfo();

    this.emergencyContactForm.valueChanges.subscribe((res: any) => {
      let data=res;
      if(this.emergencyContactForm.invalid) {
        data.emergencyFormError=true;
      }
      else{
        data.emergencyFormError=false;
      }
      this.applicationFormService.emergencyContactInfoDto.next(data);
    });

  }

}
