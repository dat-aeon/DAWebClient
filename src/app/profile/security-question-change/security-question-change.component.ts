import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { AuthService } from 'src/app/cores/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { languageValidator, specialchar } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-security-question-change',
  templateUrl: './security-question-change.component.html',
  styleUrls: ['./security-question-change.component.css']
})

export class SecurityQuestionChangeComponent implements OnInit {

  dynamicForm: FormGroup;
  questionForm: FormGroup;
  currentUser: any;
  securityQuestion: any = [];
  numOfAnsChar: number;
  numOfSecQues: number;
  responseMessage: string;
  snackBarOption: any = { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' }
  securityQuestionAnswerReqDtoList: any = [];
  loading: boolean = false;

  @ViewChild('erorrSnack', { static: false })
  private erorrSnack: any = TemplateRef;

  @ViewChild('invalidAnswer', { static: false })
  private invalidAnswer: any = TemplateRef;

  @ViewChild('success', { static: false})
  private success: any = TemplateRef

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

  get f() { return this.dynamicForm.controls; }
  get q() { return this.f.questions as FormArray; }
  
  private buildForm() {
    this.dataService.getCustomerSecurityQuestionList(this.currentUser.data.access_token, this.currentUser.data.userInformationResDto.customerId).subscribe((res: any) => {
      this.securityQuestion = res.data.customerSecurityQuestionDtoList;
      this.numOfAnsChar = res.data.numOfAnsChar;
      this.numOfSecQues = res.data.numOfSecQues;

      if(this.translateService.store.currentLang === 'mm') {
        for (let x=0; x < this.securityQuestion.length; x++) {
          this.securityQuestion[x].selected = this.securityQuestion[x].questionMyan;
        }
      }

      if(this.translateService.store.currentLang === 'en') {
        for (let x=0; x < this.securityQuestion.length; x++) {
          this.securityQuestion[x].selected = this.securityQuestion[x].questionEng;
        }
      }
      

      for (let i = 0;i < this.numOfSecQues; i++) {
        this.q.push(this.fb.group({
          answer: [this.securityQuestion[i].answer, [Validators.required, languageValidator, specialchar]]
      }));
      }

    });
  }

  AnswersControlErrorHandling (index: number, error: string) {
    let QuestionFormArray = <FormArray>this.dynamicForm.get('questions');
    let QuestionFormGroup = <FormGroup>QuestionFormArray.controls[index];
    return QuestionFormGroup.controls.answer.hasError(error);
  }

  getQuestion(index: any) {
    return this.securityQuestion[index].selected;
  }

  languageChanged() {
    this.translateService.onLangChange.subscribe( (res: any) => {
      if(res.lang === 'mm') {
        for (let x=0; x < this.securityQuestion.length; x++) {
          this.securityQuestion[x].selected = this.securityQuestion[x].questionMyan;
        }
      }

      if(res.lang === 'en') {
        for (let x=0; x < this.securityQuestion.length; x++) {
          this.securityQuestion[x].selected = this.securityQuestion[x].questionEng;
        }
      }
    });
  }


  onSubmit() {
    this.loading = true;

    if (this.dynamicForm.invalid) {
        this.loading = false;

        this.snackBar.openFromTemplate(this.erorrSnack, this.snackBarOption);
        return;
    }


    let editObject: any = null;


    for (let i=0; i<this.q.controls.length; i++) {
      let answer: any = this.q.controls[i];
   

      let questionObject = {
        secQuesId: this.securityQuestion[i].secQuesId,
        answer : answer.value.answer,
      }

      this.securityQuestionAnswerReqDtoList.push(questionObject);
    }


    editObject  = {
      securityQuestionAnswerReqDtoList: this.securityQuestionAnswerReqDtoList,
      customerId: this.currentUser.data.userInformationResDto.customerId,
      password:  this.f.password.value,
    }
    this.dataService.updateSecurityQuestionAnswer(this.currentUser.data.access_token, editObject).subscribe((res: any) => {
      if(res.status === 'SUCCESS') {
        this.snackBar.openFromTemplate(this.success, this.snackBarOption);
      }

      if(res.status === 'FAILED') {

        this.snackBar.openFromTemplate(this.invalidAnswer, this.snackBarOption);
        this.f.password.setErrors({wrongPass:true});
      }
    });

    this.loading = false;
    
}
public errorHandling = (control: string, error: string) => {
  return this.dynamicForm.controls[control].hasError(error);
}

  ngOnInit() {
    this.authService.refreshToken();

    this.dynamicForm = this.fb.group({
      questions: new FormArray([]),
      password:[,[Validators.required, languageValidator, Validators.minLength(6)]],
    });

    this.buildForm();

    this.languageChanged();
  }


}
