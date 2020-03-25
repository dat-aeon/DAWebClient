import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { AuthService } from 'src/app/cores/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { languageValidator, specialchar } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-security-question-change',
  templateUrl: './security-question-change.component.html',
  styleUrls: ['./security-question-change.component.css']
})

export class SecurityQuestionChangeComponent implements OnInit {

  questionForm: FormGroup;
  currentUser: any;
  errorMsg: any = {};
  regObj: any = {};
  securityQuestion: any = [];
  numOfAnsChar: number;
  numOfSecQues: number;
  loading: boolean = false;

  @ViewChild('erorrSnack', { static: false })
  private erorrSnack: any = TemplateRef;

  @ViewChild('invalidAnswer', { static: false })
  private invalidAnswer: any = TemplateRef;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService,
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.authService.currentUser.subscribe( (res: any) => {
      this.currentUser = res;
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
        getGroup.controls.secQuesId.setErrors({ duplicated: true});
        errorstatus.push(index);
      }
    });

    if(errorstatus.length !== 0) {
      this.loading = false;
    }

    if(errorstatus.length === 0) {
      this.loading = true;
      this.regObj.customerSecurityQuestionDtoList = this.questionForm.value.question;

      for(let x=0; x<this.questionForm.value.question.length; x++) {
        this.questionForm.value.question[x].secQuesId = Number(this.questionForm.value.question[x].secQuesId);
      }

      this.regObj.phoneNo = this.currentUser.data.userInformationResDto.phoneNo;
      this.regObj.nrcNo = this.currentUser.data.userInformationResDto.nrcNo;
      this.regObj.securityQuestionAnswerReqDtoList = this.questionForm.value.question;

      this.authService.confirmSecurityQuestionAnswer(this.currentUser.data.access_token, this.regObj).subscribe((res: any) => {

        if(res.status === 'FAILED' && res.messageCode === 'INVALID_CUSTOMER_ANSWER') {
          this.loading = false;
          this.snackBar.openFromTemplate(this.invalidAnswer, { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
        }

        if(res.status === 'SUCCESS') {
          this.loading = false;
          this.router.navigate(['profile']);
        }
      });
    }

    return;
  }

  private buildForm() {
    this.questionForm = this.fb.group({ question: new FormArray([]) });
    this.dataLoad();
  }

  private dataLoad() {
    this.dataService.securityQuestion().subscribe((res: any) => {
        this.securityQuestion = res.data.securityQuestionDtoList;
        this.numOfAnsChar = res.data.numOfAnsChar;
        this.numOfSecQues = res.data.numOfSecQues;

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

        for(let i = 1; i <= this.numOfSecQues; i++) {
          this.q.push(this.fb.group({
            secQuesId: ['',[ Validators.required]],
            answer: ['', [Validators.required, languageValidator, Validators.maxLength(this.numOfAnsChar), specialchar]]
          }));
        }

      });
  }

  languageChanged() {
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

  errorHandling = (control: string, error: string) => {
    return this.questionForm.controls[control].hasError(error);
  }

  AnswersControlErrorHandling (index: number, error: string) {
    let QuestionFormArray = <FormArray>this.questionForm.get('question');
    let QuestionFormGroup = <FormGroup>QuestionFormArray.controls[index];
    return QuestionFormGroup.controls.answer.hasError(error);
  }
  
  ngOnInit() {
    this.authService.refreshToken();
    this.buildForm();
    this.languageChanged();
  }

  onSubmit() {
    this.loading = true;

    if(this.questionForm.invalid) { 
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
      this.loading = false;
      return; 
    }

    this.securityQuestionValidatosrs();
  }

}
