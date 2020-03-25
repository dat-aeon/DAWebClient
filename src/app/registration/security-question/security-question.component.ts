import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { DataService } from '../../cores/helper/data.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { languageValidator, securityQuestionValidatorsCheck } from '../../cores/helper/validators';
import { Router } from '@angular/router';
import { ApiService } from '../../cores/services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/cores/services/auth.service';
import { UserService } from 'src/app/cores/services/user.service';
import { MatSnackBar  } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.css']
})


export class SecurityQuestionComponent implements OnInit {

  title: string;
  body: string;
  securityQuestion: any = [];
  limitQuestion: any;
  loading: boolean = false;
  numOfAnsChar: any;
  questionForm: FormGroup;
  errorMsg: any;
  acctionMessage: any = {};
  regObj: any = {};
  firstStepComplete: boolean;
  submitted: boolean = false;
  commandError: boolean;
  questionList: any = [];
  private snackBarOption: any = { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' }

  @ViewChild('erorrSnack', { static: false })
  private erorrSnack: any = TemplateRef;

  @ViewChild('duplicatedError', { static: false })
  private duplicatedError: any = TemplateRef;


  @ViewChild('failRegister', { static: false })
  private failRegister: any = TemplateRef;

  @ViewChild('successRegister', { static: false })
  private successRegister: any = TemplateRef;
  

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private authService: AuthService,
    private translateService: TranslateService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {

    this.authService.currentUser.subscribe((res: any) => {
      if(res !== null) { 
        this.router.navigate(['dashboard']);
      }
    });

   this.dataService.securityQuestion().subscribe( (res: any) => {
    this.limitQuestion = res.data.numOfSecQues;
    this.numOfAnsChar = res.data.numOfAnsChar;
    this.securityQuestion = res.data.securityQuestionDtoList;

    if(this.translateService.store.currentLang === 'mm') {
      for(let x=0; x < res.data.securityQuestionDtoList.length; x++) {
        this.securityQuestion[x].selected = this.securityQuestion[x].questionMM;
      }
    }

    if(this.translateService.store.currentLang === 'en') {
      for(let x=0; x < res.data.securityQuestionDtoList.length; x++) {
        this.securityQuestion[x].selected = this.securityQuestion[x].questionEN;
      }
    }

    this.buildForm();
    });

   }

  get f () { return this.questionForm.controls; }
  get q () { return this.f.question as FormArray; }

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
      return;
    }

    if(errorstatus.length === 0) {

      this.userService.registrationUser.subscribe((subscribe: any) => {
        if(subscribe) {
          const requestObject: any = {
            name: subscribe.name,
            dob: subscribe.dob,
            nrcNo: subscribe.nrcCode + '/' + subscribe.nrcList + subscribe.nrcType + subscribe.nrcNo,
            phoneNo: subscribe.phoneNo,
            password: subscribe.password,
            customerSecurityQuestionDtoList: this.questionForm.value.question 
          }

          this.api.registeration(requestObject).subscribe((res: any) => {

            if(res.status === 'FAILED') {
              this.acctionMessage = res.message;
              this.snackBar.openFromTemplate(this.failRegister, this.snackBarOption);
            }
              
            if( res.status === 'SUCCESS') {
              this.snackBar.openFromTemplate(this.successRegister, this.snackBarOption);
              this.router.navigate(['registration-configuration']);
            }
          });
        }
      });
    }
  }

  private buildForm() {
    for(let i = 1; i <= this.limitQuestion; i++) {
      this.q.push(this.fb.group({
        secQuesId: [null,[ Validators.required]],
        answer: [null, [Validators.required, languageValidator, Validators.maxLength(this.numOfAnsChar)]]
      }));
    }
  }

  private changeLanaguage() {
    this.translateService.onLangChange.subscribe( (res: any) => {
      if(res.lang === 'mm') {
       for(let x=0; x < this.securityQuestion.length; x++) {
         this.securityQuestion[x].selected = this.securityQuestion[x].questionMM;
       }
      }
 
      if(res.lang === 'en') {
       for(let x=0; x < this.securityQuestion.length; x++) {
         this.securityQuestion[x].selected = this.securityQuestion[x].questionEN;
       }
      }
    }); 
  }

  ngOnInit() {
    this.userService.registrationUser.subscribe((subscribe: any) => {
      if(subscribe) {
        this.questionForm = this.fb.group({
          question: new FormArray([])
        });

        this.changeLanaguage();
      } else {
        this.router.navigate(['/login']);
      }
    }); 
  }

  AnswersControlErrorHandling (index: number, error: string) {
    let QuestionFormArray = <FormArray>this.questionForm.get('question');
    let QuestionFormGroup = <FormGroup>QuestionFormArray.controls[index];
    return QuestionFormGroup.controls.answer.hasError(error);
  }

  QuestionsControlErrorHandling (index: number, error: string) {
    let QuestionFormArray = <FormArray>this.questionForm.get('question');
    let QuestionFormGroup = <FormGroup>QuestionFormArray.controls[index];
    return QuestionFormGroup.controls.secQuesId.hasError(error);
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    if(this.questionForm.invalid) {
      this.loading = false;
      this.snackBar.openFromTemplate(this.erorrSnack, this.snackBarOption);
       return; 
    }

    this.securityQuestionValidatosrs();
  }
}

