import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { errorMessage, languageValidator, numOnlyValidator, passwordMatchValidator, specialchar } from 'src/app/cores/helper/validators';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/cores/helper/data.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SecurrityService } from 'src/app/cores/services/securrity.service';
import { ApiService } from 'src/app/cores/services/api.service';

import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/cores/services/auth.service';
import { discardPeriodicTasks } from '@angular/core/testing';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  
title: string;
body: string;
  securityQuestion: any = [];
limitQuestion: any;
numOfAnsChar: any;
termsAndConditions: any;
newRegister: any = {};
  appApplyForm: any = {};
  id: number;
  myAccountForm: any = FormGroup;
  termsAndConditionsForm:any=FormGroup;
  appType: any;
  nrcTypeList: any;
  townshipCodeResDtoList: any;
  daApplicationTypeId: any;
  stateIdList: any;
  matchTownShip: any;
  errorMsg: any;
  display='none';
  loading : boolean= false;
  
  submitted: boolean;
  private snackBarOption: any = { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' };

commandError: boolean;

  @ViewChild('content',{ static: false }) content: any;

 
  @ViewChild( 'erorrSnack', {static: false })
    erorrSnack: any = TemplateRef;
    @ViewChild( 'applicationFail', {static: false })
    applicationFail: any = TemplateRef;

@ViewChild('duplicatedQuestion', { static : false })
duplicatedQuestion: any = TemplateRef;

@ViewChild('securityFail', { static: false })
securityFail: any = TemplateRef;

  constructor(
    private modalService: NgbModal,
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private securityService: SecurrityService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {
    if (localStorage.getItem('newRegister')) {
      this.newRegister = JSON.parse(localStorage.getItem('newRegister'));
      if(!('applicationInfoAttachmentDtoList' in this.newRegister)||this.newRegister.applicantFormError || this.newRegister.applicantCompanyInfoDto.occupationFormError || this.newRegister.emergencyContactInfoDto.emergencyFormError||this.newRegister.guarantorInfoDto.guarantorFormError||this.newRegister.loanFormError){
        this.dataService.formError=true;
        this.router.navigate(['/new-user-loan/'], { queryParams:  filter, skipLocationChange: true});
      }
      this.dataService.formError=false;

    }
     else {
      this.router.navigate(['login']);


  }



  }

  public errorHandling = (control: string, error: string) => {
    return this.myAccountForm.controls[control].hasError(error);
  }

  public date(e: any) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.appApplyForm.get('dob').setValue(convertDate, { onlyself: true });
  }

  ngOnInit() {

    this.errorMsg = errorMessage;

    this.myAccountFormBuilder();



  }

  get t () { return this.termsAndConditionsForm.controls; }

  get f () { return this.myAccountForm.controls; }
  get q () { return this.f.question as FormArray; }

  myAccountFormBuilder() {
    this.myAccountForm = this.fb.group({
    password: ['',[Validators.required,languageValidator,Validators.minLength(6)]],
    compwd: ['',[Validators.required,languageValidator,Validators.minLength(6)]],
    question: new FormArray([]),
  },

  );


    this.dataService.securityQuestion().subscribe( (res: any) => {
      if(res.status === 'SUCCESS' && res.data !== null) {
      this.limitQuestion = res.data.numOfSecQues;
      this.numOfAnsChar = res.data.numOfAnsChar;
      this.securityQuestion = res.data.securityQuestionDtoList;

      if(this.translateService.store.currentLang === 'mm') {
        for (let x=0; x < this.securityQuestion.length; x++) {
          this.securityQuestion[x].selected = this.securityQuestion[x].questionMM;
        }
      }
   
      if(this.translateService.store.currentLang === 'en') {
        for (let x=0; x < this.securityQuestion.length; x++) {
          this.securityQuestion[x].selected = this.securityQuestion[x].questionEN;
        }
      }

      for(let i = 1; i <= this.limitQuestion; i++) {
        this.q.push(this.fb.group({
          secQuesId: [null,[ Validators.required]],
          answer: [null, [Validators.required, languageValidator, Validators.maxLength(this.numOfAnsChar), specialchar]]
        }));
      }}
    
    });


    this.dataService.getTermsAndConditions().subscribe( (res: any) => {
      if(this.translateService.store.currentLang === 'mm') {
        this.termsAndConditions = res.data.descriptionMyn;
      }

      if(this.translateService.store.currentLang === 'en') {
        this.termsAndConditions = res.data.descriptionEng;
      }

      this.translateService.onLangChange.subscribe((language: any) => {
        if(language.lang === 'mm') {
          this.termsAndConditions = res.data.descriptionMyn;
        }

        if(language.lang === 'en') {
          this.termsAndConditions = res.data.descriptionEng;
        }
      });

    });
  
     
  }
 


  public AnswersControlErrorHandling (index: number, error: string) {
    let QuestionFormArray = <FormArray>this.myAccountForm.get('question');
    let QuestionFormGroup = <FormGroup>QuestionFormArray.controls[index];
    return QuestionFormGroup.controls.answer.hasError(error);
  }
  // onSubmit(){
  //   this.submitted = true;
  //   this.nextLoading = true;
  //   if (this.newUserForm.invalid) { this.nextLoading = false; return; }
  //   this.saveDraft();
  //   console.log('Next');
  //   this.router.navigate(['/new-user-occupation/']);
  // }
  // saveDraft(){
    
  // }
termsAndCondition(){
  this.loading=true;
      if(this.myAccountForm.invalid) {
        this.submitted = true;
        this.snackBar.openFromTemplate(this.erorrSnack, this.snackBarOption);
         this.loading=false;
        return; 
      }
  this.submitted = true;
  this.commandError = false;



this.securityQuestionValidatosrs();
   

}
private securityQuestionValidatosrs() { 
   let resultArray = [];
  let errorstatus = [];

  for (let i=0; i<this.myAccountForm.value.question.length; i++) {
    resultArray.push(Number(this.myAccountForm.value.question[i].secQuesId));
  }

  resultArray.filter( (item: any, index) => {
    if(resultArray.indexOf(item) !== index) {
      let getGroup = <FormGroup>this.q.controls[index];
      getGroup.controls.secQuesId.setErrors({ duplicated: true });
      errorstatus.push(index);
    }
  });

  if(errorstatus.length !== 0) {
    this.loading=false;
    return;
  }
  if(errorstatus.length === 0) {
    this.display='block'; //Set block css
    console.log(this.display);
   
    this.saveDraft();
    this.loading=false;
  }
}
  submit(){
    this.newRegister = JSON.parse(localStorage.getItem('newRegister'));
    delete this.newRegister['loanFormError'];
    delete this.newRegister['applicantFormError'];
    delete this.newRegister.applicantCompanyInfoDto['occupationFormError'];
    delete this.newRegister.emergencyContactInfoDto['emergencyFormError'];
    delete this.newRegister.guarantorInfoDto['guarantorFormError'];
    console.log(this.newRegister);
    
    this.dataService.freeRegistration( this.newRegister).subscribe( (res: any) => {
console.log(res);
       if(res.status === 'FAILED') {
        this.title = 'Failed!';
        
        this.body =res.message;
        this.display='none';
        this.snackBar.openFromTemplate(this.applicationFail, this.snackBarOption);
   // this.openDialog();
       
      }

     else if(res.status === 'SUCCESS') {
        this.display='none';
        const accLogin={username:this.newRegister.mobileNo,
          password: this.newRegister.password};
          console.log(accLogin);
         
        this.authService.loginFromService(accLogin).subscribe((auth: any) => {
          console.log(auth);

          if(auth.status === 'FAILED') {
            this.body =res.message;
            this.display='none';
            this.snackBar.openFromTemplate(this.applicationFail, this.snackBarOption);
            return;
          }
    
          if(auth.status === 'SUCCESS') {
            auth.data.password = this.newRegister.password;
            localStorage.setItem('user_info', JSON.stringify(auth));
            this.authService.currentUserObject.next(auth);
            console.log('sadasdasd');
            this.router.navigateByUrl('/dashboard');
          }
        });
    

     
      }
      
    },(error: any) => {
      console.log('Error : ' + JSON.stringify(error))
              this.display='none';
      if(error) {        this.display='none';
         this.modalService.open(ModalComponent); }
    });
  
  }
  
  
  saveDraft(){
  
    const customerSecurityQuestionDtoList=this.myAccountForm.value.question;
    this.newRegister.customerSecurityQuestionDtoList=customerSecurityQuestionDtoList;
    this.newRegister.channelType=2;
    this.newRegister.daApplicationTypeId=1;
    

    this.newRegister.password=this.f.password.value;
    localStorage.setItem('newRegister', JSON.stringify(this.newRegister));

  }
  clickBackLink($event: any){

    this.router.navigate(['/'+$event.target.id+'/'], { queryParams:  filter, skipLocationChange: true});
  }
  back(){
    this.router.navigate(['/new-user-loan/'], { queryParams:  filter, skipLocationChange: true});
  }
}
