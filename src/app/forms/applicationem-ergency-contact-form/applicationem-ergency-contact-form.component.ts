import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { languageValidator, numOnlyValidator, phoneNumValidator, minLength } from 'src/app/cores/helper/validators';

@Component({
  selector: 'app-applicationem-ergency-contact-form',
  templateUrl: './applicationem-ergency-contact-form.component.html',
  styleUrls: ['./applicationem-ergency-contact-form.component.css']
})

export class ApplicationemErgencyContactFormComponent implements OnInit {

  emergencyContactForm: FormGroup;
  currentUser: any;
  saveObject: any = {};
  emergencyContactInfoDto: any = {};

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
  
  get getEmergencyContact() {
    return this.emergencyContactForm.controls;
  }

  private emergencyContactFormBuilder() {
    this.emergencyContactForm = this.fb.group({
      name: ['', [Validators.required, languageValidator]],
      relationship: ['1'],
      relationshipOther: ['', [Validators.required, languageValidator]],
      currentAddress: ['', [Validators.required, languageValidator]],
      mobileNo: ['', [ Validators.required, numOnlyValidator, phoneNumValidator, minLength(11)]],
      residentTelNo: ['', [numOnlyValidator]],
      otherPhoneNo: ['', [numOnlyValidator]]
    });

    this.getEmergencyContact.relationship.setValue(1);
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
        this.getEmergencyContact.currentAddress.setValue(result.data.emergencyContactInfoDto.currentAddress);
        this.getEmergencyContact.mobileNo.setValue(result.data.emergencyContactInfoDto.mobileNo);

        if(result.data.emergencyContactInfoDto.relationship === null || result.data.emergencyContactInfoDto.relationship === undefined) {
          this.getEmergencyContact.relationship.setValue('1');
        } else {
          this.getEmergencyContact.relationship.setValue(result.data.emergencyContactInfoDto.relationship.toString());
        }

        if( result.data.emergencyContactInfoDto.relationship === 5) {
          this.getEmergencyContact.relationshipOther.enable();
          this.getEmergencyContact.relationshipOther.setValue(result.data.emergencyContactInfoDto.relationshipOther);
        } else {
          this.getEmergencyContact.relationshipOther.setValue('');
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
    } else {
      this.getEmergencyContact.relationshipOther.disable();
    }
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
    this.emergencyContactFormBuilder();
    this.lastApplicationInfo();
  }

}
