
import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { numOnlyValidator, languageValidator, errorMessage, stayPeriodValidator } from 'src/app/cores/helper/validators';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/cores/services/auth.service';
import { DataService } from 'src/app/cores/helper/data.service';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';



@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})


export class NewUserComponent implements OnInit {

  education: any = [];
  yearOfStayError = true;
  currentTownshipList: any = [];
  permanentTownshipList: any = [];
  cityTownship: any = [];
  data: any;
  hideTypeOfResidence = true;
  hideNationality = true;

  newRegister: any = {};
  appApplyForm: any = {};
  id: number;
  newUserForm: any = FormGroup;
  appType: any;
  daApplicationTypeId: any;
  errorMsg: any;
  submitted = false;
  loading = false;
  nationalityOther: boolean;
  otherInfoInput: boolean;
  nextLoading: boolean;
  requestObject: any = {};
  modalOptions: NgbModalOptions;
  typeOfResidenceSelected: any;
  selectedNrcList: any = null;

  @ViewChild('erorrSnack', { static: false })
  erorrSnack: any = TemplateRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    

  
  ) {

    if (localStorage.getItem('newRegister')) {
      this.newRegister = JSON.parse(localStorage.getItem('newRegister'));
      console.log(this.newRegister);
    if(this.dataService.formError){
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
    this.dataService.formError=false;
    }
    



    } else {
      this.router.navigate(['login']);


  }


  }


  public errorHandling = (control: string, error: string) => {
    return this.newUserForm.controls[control].hasError(error);
  }

  public date(e: any) {
    const convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.newUserForm.get('dob').setValue(convertDate, { onlyself: true });
  }

  ngOnInit() {
    this.otherInfoInput = false;
    this.errorMsg = errorMessage;
    this.authService.refreshToken();
    this.appFormBuilder();



  }




  nextSubmit() {
    this.submitted = true;
    this.nextLoading = true;
    if (this.newUserForm.invalid) { this.nextLoading = false; return; }
    this.saveDraft();
    console.log('Next');
    this.router.navigate(['/new-user-occupation/'], { queryParams:  filter, skipLocationChange: true});
  }

  get f() { return this.newUserForm.controls; }

  appFormBuilder() {
    this.newUserForm = this.fb.group({
      name: [this.newRegister.name, [Validators.required]],
      fatherName: [this.newRegister.fatherName, [Validators.required]],
      education: [1, [Validators.required]],
      nationality: [1, [Validators.required]],
      nationalityOther: [this.newRegister.nationalityOther, [Validators.required]],
      gander: [1, [Validators.required]],
      maritalStatus: [1, [Validators.required]],
      currentBuildingNo: [this.newRegister.currentAddressBuildingNo],
      currentRoomNo: [this.newRegister.currentAddressRoomNo],
      currentFloor: [this.newRegister.currentAddressFloor],
      currentStreet: [this.newRegister.currentAddressStreet, [Validators.required]],
      currentQtr: [this.newRegister.currentAddressQtr, [ Validators.required]],
      currentTownship: [ , [Validators.required]],
      currentCity: [2, [Validators.required]],
      permanentBuildingNo: [this.newRegister.permanentAddressBuildingNo] ,
      permanentRoomNo: [this.newRegister.permanentAddressRoomNo ],
      permanentFloor: [this.newRegister.permanentAddressFloor],
      permanentStreet: [this.newRegister.permanentAddressStreet],
      permanentQtr: [this.newRegister.permanentAddressQtr],
      permanentTownship: [],
      permanentCity: [2],
      typeOfResidence: [1, [Validators.required]],
      typeOfResidenceOther: [this.newRegister.typeOfResidenceOther, [ Validators.required]],
      livingWith: [1, [Validators.required]],
      yearOfStayYear: ['0'],
      yearOfStayMonth: ['0'],
      residentTelNo: [this.newRegister.residentTelNo, [ numOnlyValidator]],
      otherPhoneNo: [this.newRegister.otherPhoneNo, [numOnlyValidator]],
      email: [this.newRegister.email, [ Validators.email, languageValidator]]

    } ,{ validators: stayPeriodValidator });

    this.f.nationalityOther.disable();
    this.f.typeOfResidenceOther.disable();
    if ('yearOfStayYear' in this.newRegister) {
      this.f.yearOfStayYear.setValue(this.newRegister.yearOfStayYear);
    }
    if ('yearOfStayMonth' in this.newRegister) {
      this.f.yearOfStayMonth.setValue(this.newRegister.yearOfStayMonth);
    }


    if ('nationality' in  this.newRegister) {
      this.f.nationality.setValue(this.newRegister.nationality);


      if (this.newRegister.nationality === 1) {
        this.f.nationalityOther.disable();
        this.hideNationality = true;
    } else if (this.newRegister.nationality === 2) {
      this.f.nationalityOther.enable();
      this.hideNationality = false;

    }
  }
    if ('gender' in  this.newRegister) {
    this.f.gander.setValue(this.newRegister.gender);
    }
    if ('martialStatus' in  this.newRegister) {
    this.f.martialStatus.setValue(this.newRegister.martialStatus);
    }
    if ('typeOfResidence' in this.newRegister) {
      this.f.typeOfResidence.setValue(this.newRegister.typeOfResidence);
      if (Number(this.newRegister.typeOfResidence) === 5) {
        this.hideTypeOfResidence = false;
        this.f.typeOfResidenceOther.enable();
      } else {
        this.hideTypeOfResidence = true;
        this.f.typeOfResidenceOther.disable();
      }
    }
    if ('livingWith' in this.newRegister) {
      this.f.livingWith.setValue(this.newRegister.livingWith);

    }
    this.dataService.getEducationList().subscribe((dataLists: any) => {
      if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {
      for (const x of dataLists.data) {

        this.education.push(x);
      }
      if ('highestEducationTypeId' in this.newRegister) {
        this.f.education.setValue(this.newRegister.highestEducationTypeId);
      }
    }
      
  },(error: any) => {
    console.log('Error : ' + JSON.stringify(error))
    if(error) { this.modalService.open(ModalComponent); }
    });

    this.dataService.getCityTownshipCodeList().subscribe((dataLists: any) => {
      if(dataLists.status === 'SUCCESS' && dataLists.data !== null) {

      for (const x of dataLists.data) {
        this.cityTownship.push(x);
      }

      if ('currentAddressCity' in this.newRegister) {
        this.f.currentCity.setValue(this.newRegister.currentAddressCity);

        dataLists.data.find( (key: any) => {
          if (Number(this.newRegister.currentAddressCity) === key.cityId) {
            this.currentTownshipList = key.townshipInfoList;
            this.f.currentTownship.setValue(this.newRegister.currentAddressTownship);


          }
        });
      } else {
        dataLists.data.find( (key: any) => {
          if (Number(2) === key.cityId) {
            this.currentTownshipList = key.townshipInfoList;


          }
        });

      }
      if ('permanentAddressCity' in this.newRegister) {

        this.f.permanentCity.setValue(this.newRegister.permanentAddressCity);
        dataLists.data.find( (key: any) => {
          if (Number(this.newRegister.permanentAddressCity) === key.cityId) {

            this.permanentTownshipList=key.townshipInfoList;

            this.f.permanentTownship.setValue(this.newRegister.permanentAddressTownship);

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



  }



changeCity($event: any, current: any) {
 console.log($event.value);
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


  yearAndMonth(n: number): any[] {
    return Array(n);
  }




  enableOtherNationality($event: any) {
    if ($event.value === 1) {
      this.hideNationality = true;
      this.f.nationalityOther.disable();

      this.f.nationalityOther .setValue('');
    }

    if ($event.value === 2) {
      this.f.nationalityOther.enable();
      this.hideNationality = false;
    }
  }

  typeOfResidenceChange($event: any) {
    if (Number($event.value) === 5) {
      this.hideTypeOfResidence = false;
      this.f.typeOfResidenceOther.enable();
    } else {
      this.hideTypeOfResidence = true;
      this.f.typeOfResidenceOther.setValue('');
      this.f.typeOfResidenceOther.disable();
    }
  }

  saveDraft() {

    this.newRegister.name = this.f.name.value;
    this.newRegister.fatherName = this.f.fatherName.value ;
    this.newRegister.nationality = this.f.nationality.value;
    this.newRegister.nationalityOther = this.f.nationalityOther.value;
    this.newRegister.gender = this.f.gander.value;
    this.newRegister.maritalStatus = this.f.maritalStatus.value;
    this.newRegister.typeOfResidence = this.f.typeOfResidence.value;
    this.newRegister.typeOfResidenceOther = this.f.typeOfResidenceOther.value;
    this.newRegister.residentTelNo = this.f.residentTelNo.value;
    this.newRegister.otherPhoneNo = this.f.otherPhoneNo.value;
    this.newRegister.email = this.f.email.value;
    this.newRegister.currentAddressBuildingNo = this.f.currentBuildingNo.value;
    this.newRegister.currentAddressRoomNo = this.f.currentRoomNo.value;
    this.newRegister.currentAddressFloor = this.f.currentFloor.value;
    this.newRegister.currentAddressStreet = this.f.currentStreet.value;
    this.newRegister.currentAddressQtr = this.f.currentQtr.value;
    this.newRegister.currentAddressTownship = this.f.currentTownship.value;
    this.newRegister.currentAddressCity = this.f.currentCity.value;
    this.newRegister.permanentAddressBuildingNo = this.f.permanentBuildingNo.value;
    this.newRegister.permanentAddressRoomNo = this.f.permanentRoomNo.value;
    this.newRegister.permanentAddressFloor = this.f.permanentFloor.value;
    this.newRegister.permanentAddressStreet = this.f.permanentStreet.value;
    this.newRegister.permanentAddressQtr = this.f.permanentQtr.value;
    this.newRegister.permanentAddressTownship = this.f.permanentTownship.value;
    this.newRegister.permanentAddressCity = this.f.permanentCity.value;
    this.newRegister.livingWith = this.f.livingWith.value;
    this.newRegister.highestEducationTypeId = this.f.education.value;
    this.newRegister.yearOfStayYear = this.f.yearOfStayYear.value;
    this.newRegister.yearOfStayMonth = this.f.yearOfStayMonth.value;
    if(this.newUserForm.invalid){
    this.newRegister.applicantFormError=true;
  }
  else{
this.newRegister.applicantFormError=false;
  }
    localStorage.setItem('newRegister', JSON.stringify(this.newRegister));
  }

  clickLink($event: any){
    this.submitted = true;
    this.nextLoading = true;
    if (this.newUserForm.invalid) { 
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.nextLoading = false; return; }
    this.saveDraft();
    console.log('Next');
    this.router.navigate(['/'+$event.target.id+'/'], { queryParams:  filter, skipLocationChange: true});

  }

}
