import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { languageValidator, errorMessage, numOnlyValidator, phoneNumValidator } from 'src/app/cores/helper/validators';
import { AuthService } from 'src/app/cores/services/auth.service';
import { DataService } from 'src/app/cores/helper/data.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-new-user-emergency',
  templateUrl: './new-user-emergency.component.html',
  styleUrls: ['./new-user-emergency.component.css']
})
export class NewUserEmergencyComponent implements OnInit {

  currentTownshipList: any = [];
  cityTownship: any = [];
  newRegister: any = {};
  hideRelationship: boolean = true;
  emergencyContactForm: FormGroup;
  emergencyContactInfoDto: any={};
  saveObject: any;
  currentUser: any;
  submitted: any = false;
  loading: any = false;
  nextLoading: any = false;
  errorMsg: any;
  id: any;
  modalOptions: NgbModalOptions;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private activeRouter: ActivatedRoute,
    private modalService: NgbModal
  ) {

    this.modalOptions = { backdrop:'static', backdropClass:'customBackdrop' }
    if (localStorage.getItem('newRegister')) {
      this.newRegister = JSON.parse(localStorage.getItem('newRegister'));
      console.log(this.newRegister);
      if(!('applicantCompanyInfoDto' in this.newRegister)){
        this.router.navigate(['/new-user-occupation/']);
      }

    } else {
      this.router.navigate(['login']);


  }

  }

  ngOnInit() {
    this.errorMsg = errorMessage;
    this.authService.refreshToken();
    this.emergencyContactFormBuilder();

  }

  public errorHandling = (control: string, error: string) => {
    return this.emergencyContactForm.controls[control].hasError(error);
  }


  nextSubmit() {
    this.submitted = true;
    this.nextLoading = true;
    if(this.emergencyContactForm.invalid) { this.nextLoading = false; return; }
    this.saveDraft();
    this.router.navigate(['/new-user-guarantor/'], { queryParams:  filter, skipLocationChange: true});
  }

  get f() { return this.emergencyContactForm.controls; }

  emergencyContactFormBuilder() {
    if ('emergencyContactInfoDto' in this.newRegister){
      this.emergencyContactInfoDto=this.newRegister.emergencyContactInfoDto;
     }
    this.emergencyContactForm = this.fb.group({
      name: [this.emergencyContactInfoDto.name, [Validators.required]],
      relationship: [1],
      relationshipOther: [this.emergencyContactInfoDto.relationshipOther, [Validators.required]],
      currentBuildingNo: [this.emergencyContactInfoDto.currentAddressBuildingNo ],
      currentRoomNo: [this.emergencyContactInfoDto.currentAddressRoomNo ],
      currentFloor: [this.emergencyContactInfoDto.currentAddressFloor ],
      currentStreet: [this.emergencyContactInfoDto.currentAddressStreet ,[ Validators.required]],
      currentQtr: [this.emergencyContactInfoDto.currentAddressQtr,[ Validators.required]],
      currentTownship: [ ,[Validators.required]],
      currentCity: [2,[ Validators.required]],
      mobileNo: [this.emergencyContactInfoDto.mobileNo , [Validators.required,numOnlyValidator,phoneNumValidator]],
      residentTelNo: [this.emergencyContactInfoDto.residentTelNo ,[  numOnlyValidator]],
      otherPhoneNo: [this.emergencyContactInfoDto.otherPhoneNo, [numOnlyValidator]]
    });
    this.f.relationshipOther.disable();


    if('relationship' in this.emergencyContactInfoDto){
      this.f.relationship.setValue(this.emergencyContactInfoDto.relationship);
      if (Number(this.emergencyContactInfoDto.relationship) === 5){
        this.hideRelationship = false;
        this.f.relationshipOther.enable();
  
      } else {
        this.hideRelationship = true;
        this.f.relationshipOther.disable();
      }

    }

    this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {

      if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
      for (const x of dataLists.data) {
        this.cityTownship.push(x);
      }

      if ('currentAddressCity' in this.emergencyContactInfoDto) {
      this.f.currentCity.setValue(this.emergencyContactInfoDto.currentAddressCity);

      dataLists.data.find( (key: any) => {
        if (Number(this.emergencyContactInfoDto.currentAddressCity) === key.cityId) {
          console.log('Hello');
          this.currentTownshipList = key.townshipInfoList;
          this.f.currentTownship.setValue(this.emergencyContactInfoDto.currentAddressTownship);


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
  }

  relationshipChange($event: any){
    if(Number($event.value) === 5) {
      this.hideRelationship = false;
      this.f.relationshipOther.enable();
    } else {
      this.hideRelationship = true;
      this.f.relationshipOther.setValue('');
      this.f.relationshipOther.disable();
    }
  }



  saveDraft() {
    const emergencyContactInfoDto={
      daEmergencyContactInfoId: null,
    name: this.f.name.value,
    relationship: this.f.relationship.value,
    relationshipOther: this.f.relationshipOther.value,
    currentAddressBuildingNo: this.f.currentBuildingNo.value,
    currentAddressRoomNo: this.f.currentRoomNo.value,
    currentAddressFloor: this.f.currentFloor.value,
    currentAddressQtr: this.f.currentQtr.value,
    currentAddressStreet: this.f.currentStreet.value,
    currentAddressTownship: this.f.currentTownship.value,
    currentAddressCity: this.f.currentCity.value,
    mobileNo: this.f.mobileNo.value,
    residentTelNo: this.f.residentTelNo.value,
    otherPhoneNo: this.f.otherPhoneNo.value

    }
    this.newRegister.emergencyContactInfoDto = emergencyContactInfoDto;
    localStorage.setItem('newRegister', JSON.stringify(this.newRegister));
  }

  changeCity($event: any) {
    console.log($event.value);
    this.cityTownship.find( (key: any) => {
     if (Number($event.value) === key.cityId) {

         this.currentTownshipList = key.townshipInfoList;


     }
   });
   }
   clickLink($event: any){
    this.submitted = true;
    this.nextLoading = true;
    if (this.emergencyContactForm.invalid) { this.nextLoading = false; return; }
    this.saveDraft();
    console.log('Next');
    this.router.navigate(['/'+$event.target.id+'/'], { queryParams:  filter, skipLocationChange: true});

  }

  clickBackLink($event: any){
    this.saveDraft();
    this.router.navigate(['/'+$event.target.id+'/'], { queryParams:  filter, skipLocationChange: true});
  }
  


}
