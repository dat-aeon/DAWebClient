import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DataService } from 'src/app/cores/helper/data.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/cores/services/api.service';
import { languageValidator, specialchar, passwordMatchValidator } from 'src/app/cores/helper/validators';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/cores/services/auth.service';
import { MatSnackBar } from '@angular/material';
import { UserService } from 'src/app/cores/services/user.service';

@Component({
  selector: 'app-reset-questions',
  templateUrl: './reset-questions.component.html',
  styleUrls: ['./reset-questions.component.css']
})

export class ResetQuestionsComponent implements OnInit {

title: string;
body: string;
passwodChange: boolean = false;
passwordLoading: boolean = false;
resetObject: any = {};
securityQuestion: any = [];
passwordForm: FormGroup;
limitQuestion: any;
numOfAnsChar: any;
mm: boolean;
eng: boolean;
questionForm: FormGroup;
errorMsg: any;
regObj: any = {};
firstStepComplete: boolean;
submitted: boolean;
loading: boolean = false;
commandError: boolean;

@ViewChild( 'erorrSnack', {static: false })
erorrSnack: any = TemplateRef;

@ViewChild('duplicatedQuestion', { static : false })
duplicatedQuestion: any = TemplateRef;

@ViewChild('securityFail', { static: false })
securityFail: any = TemplateRef;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private translateService: TranslateService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { 
    
    if(this.authService.currentUserValue) { 
      this.router.navigate(['dashboard']); 
    }

  }

   get f () { return this.questionForm.controls; }
   get q () { return this.f.question as FormArray; }
   get p () { return this.passwordForm.controls }

   passwordErrorHandling(control: string, error: string) {
    return this.passwordForm.controls[control].hasError(error);
   }

   errorHandling = (control: string, error: string) => {
    return this.questionForm.controls[control].hasError(error);
  }

  AnswersControlErrorHandling (index: number, error: string) {
    let QuestionFormArray = <FormArray>this.questionForm.get('question');
    let QuestionFormGroup = <FormGroup>QuestionFormArray.controls[index];
    return QuestionFormGroup.controls.answer.hasError(error);
  }

  private securityQuestionValidatosrs() {
    let resultArray = [];
    let errorstatus = [];

    for (let i=0; i<this.questionForm.value.question.length; i++) {
      resultArray.push(Number(this.questionForm.value.question[i].secQuesId));
    }

    resultArray.filter( (item: any, index) => {

      if(resultArray.indexOf(item) !== index) {
        let getGroup = <FormGroup>this.q.controls[index];
        getGroup.controls.secQuesId.setErrors({ duplicated: true });
        errorstatus.push(index);
      }
      
    });

    if(errorstatus.length !== 0) {
      this.loading = false;
    }

    if(errorstatus.length === 0) {

      this.userService.resetUser.subscribe((reset: any) => {
        if(reset) {
          this.regObj.phoneNo = reset.phoneNo,
          this.regObj.nrcNo = reset.nrcCode + '/' + reset.nrcList + reset.nrcType + reset.nrcNo,
          this.regObj.securityQuestionAnswerReqDtoList = this.questionForm.value.question;

          this.api.confirmSecurityQuestionAnswer(this.regObj).subscribe((res: any) => {
            console.log(this.regObj);
            console.log(res);
            if(res.status === 'FAILED') {
              this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
              this.loading = false;
            }
              
            if( res.status === 'SUCCESS') {
              this.loading = false;
              this.resetObject = res.data;
              this.passwodChange = true;
            }
          });
        }
      });
    }
  }

  private buildForm() {
    this.questionForm = this.fb.group({
      question: new FormArray([])
    });

    this.dataService.securityQuestion().subscribe( (res: any) => {
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
      }

    });
  }

  private passwordFormBuilder() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, languageValidator]],
      compwd: ['',[Validators.required, languageValidator]]
    }, { validator: passwordMatchValidator });
  }

  private languageChanged() {
    this.translateService.onLangChange.subscribe( (res: any) => {
      if(res.lang === 'mm') {
        for (let x=0; x < this.securityQuestion.length; x++) {
          this.securityQuestion[x].selected = this.securityQuestion[x].questionMM;
        }
      }

      if(res.lang === 'en') {
        for (let x=0; x < this.securityQuestion.length; x++) {
          this.securityQuestion[x].selected = this.securityQuestion[x].questionEN;
        }
      }
    });
  }

  onResetPassword() {
    this.passwordLoading = true;

    if(this.passwordForm.invalid) {
      this.passwordLoading = false;
      return;
    }

    this.resetObject.password = this.p.password.value;

    this.authService.resetPassword(this.resetObject).subscribe((result: any) => {
      if(result.status === 'SUCCESS' && result.data === null) {
        this.passwordLoading = false;
        this.router.navigateByUrl('/login');
      }
    }); 
  }

  ngOnInit() {
    this.userService.resetUser.subscribe((subscribe: any) => {
      if(subscribe) {
        this.buildForm();
        this.passwordFormBuilder();
        this.languageChanged();
        this.submitted = false;

      } else {
        this.router.navigateByUrl('/reset-password');
      }
    });
    
  }

  onSubmit() {
    this.loading = true;

    if(this.questionForm.controls.question.invalid) { 
      this.submitted = true;
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
      this.loading = false;
      return; 
    }

    this.securityQuestionValidatosrs();
  }

}
