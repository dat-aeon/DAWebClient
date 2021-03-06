import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { languageValidator, maxAmountOfFinance, imageValidator } from 'src/app/cores/helper/validators';
import { AuthService } from 'src/app/cores/services/auth.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DataService } from 'src/app/cores/helper/data.service';
import { TranslateService } from '@ngx-translate/core';
import { NumeralPipe } from 'ngx-numeral';
import { Router } from '@angular/router';
import { ApplicationFormService } from 'src/app/cores/services/application-form.service';
import { appForm } from 'src/app/cores/helper/app-form';
import { combineAll } from 'rxjs/operators';
import { RegisterComponent } from 'src/app/application/register/register.component';
import { FileUploader } from 'ng2-file-upload';
import { Ng2ImgMaxService } from 'ng2-img-max';


@Component({
  selector: 'app-application-loan-form',
  templateUrl: './application-loan-form.component.html',
  styleUrls: ['./application-loan-form.component.css']
})

export class ApplicationLoanFormComponent implements OnInit {

  loanForm: FormGroup;
  form: appForm;
  passwordConfirmForm: any = FormGroup;
  uploadedImage: Blob;

  maxDate: any = new Date(Date.now());

  currentUser: any;
  imageType: string = 'data:image/png;base64,';

  responseMessage: any = {};
  termOfFinance: any = {};
  productTypeList: any = [];
  passwordLoading: boolean = false;
  confirmModel: any;
  saveObject: any = {};

  id: string;
  uploader: FileUploader;

  currencyOption: any = {
    allowDecimalPadding: true,
    decimalCharacter: '.',
    decimalPlaces: '0',
    digitGroupSeparator: ',',
    digitalGroupSpacing: '3',
    maximumValue: '2000000',
    minimumValue: '0',
    selectNumberOnly: true
  }

  nrcFrontObject: any = { fileType: 1 };
  nrcBackObject: any = { fileType: 2 };
  residentProofAttachmentObject: any = { fileType: 3 };
  incomeProofAttachmentObject: any = { fileType: 4 };
  nrcGuarantorFrontObject: any = { fileType: 5 };
  nrcGuarantorBackObject: any = { fileType: 6 };
  householdCriminalClearanceObject: any = { fileType: 7 };
  applicationPhotoObject: any = { fileType: 8 };
  customerSignObject: any = { fileType: 9 };
  guarantorSignObject: any = {fileType: 11 };

  applicationInfoAttachmentDtoList: any = [
    this.nrcFrontObject,
    this.nrcBackObject,
    this.residentProofAttachmentObject,
    this.incomeProofAttachmentObject,
    this.nrcGuarantorFrontObject,
    this.nrcGuarantorBackObject,
    this.householdCriminalClearanceObject,
    this.applicationPhotoObject,
    this.customerSignObject,
    this.guarantorSignObject,
  ];

  loanCalculateObject: any = {};
  daApplicationTypeId: any;

  submitted: boolean;
  loading: boolean = false;

  @ViewChild('erorrSnack', { static: false })
  erorrSnack: any = TemplateRef;

  @ViewChild('successfullSave', { static: false })
  saveSnackBar: any = TemplateRef;

  @ViewChild('termsAndConditions', { static: false })
  termsAndConditions: any = TemplateRef;

  @ViewChild('passwordForm', { static: false })
  passwordForm: any = TemplateRef;

  @ViewChild('applicationFail', { static: false })
  applicationFail: any = TemplateRef;

  @ViewChild('stepper', { static: false }) stepper:any = TemplateRef;

  constructor(
    private ng2ImgMax: Ng2ImgMaxService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dataService: DataService,
    private authService: AuthService,
    private translateService: TranslateService,
    private applicationFormService: ApplicationFormService,
    private registerForm: RegisterComponent,
    private router: Router
  ) {

    this.maxDate.setDate( this.maxDate.getDate() );
    this.maxDate.setFullYear( this.maxDate.getFullYear() - 18);

    this.authService.currentUser.subscribe( (user: any) => {
      this.currentUser = user.data;
    });
  }

  get getLoan() {
    return this.loanForm.controls;
  }

  get confirmAccount() {
    return this.passwordConfirmForm.controls;
  }

  private lastApplicationInfo() {


    setTimeout(() => {
      this.prepareRegister();
    },0);

    this.authService.currentUser.subscribe( (user: any) => {
      this.currentUser = user.data;
    });

    this.dataService.getLastApplicationInfo(this.currentUser.access_token, this.currentUser.userInformationResDto.customerId).subscribe((result: any) => {
      if(result.status === 'SUCCESS' && result.data === null) {
        this.saveObject.name = this.currentUser.userInformationResDto.name
        this.saveObject.dob =  new Date(this.currentUser.userInformationResDto.dateOfBirth);
      }

      if(result.status === 'SUCCESS' && result.data !== null) {
  
        this.saveObject = result.data;
        this.daApplicationTypeId = result.data.daApplicationTypeId;
        this.id = result.data.daApplicationTypeId;

        if(result.data.daLoanTypeId === null) {
          this.getLoan.daLoanTypeId.setValue('1');
        } else {
          this.getLoan.daLoanTypeId.setValue(result.data.daLoanTypeId.toString());
        }

        if(result.data.financeAmount !== null) {
          this.getLoan.financeAmount.setValue(this.numberToCurrency(result.data.financeAmount));
          this.termOfFinanceChange();
        }

        if(result.data.financeTerm !== null) {
          this.getLoan.financeTerm.setValue(result.data.financeTerm.toString());
        }

        if(result.data.daProductTypeId !== null) {
          this.getLoan.daProductTypeId.setValue(result.data.daProductTypeId);
        }

        this.getLoan.productDescription.setValue(result.data.productDescription);
        this.loanCalculateObject.loanTerm = result.data.financeTerm;
        this.loanCalculateObject.financeAmount = result.data.financeAmount;
        this.loanCalculateObject.motorCycleLoanFlag = false;

        this.dataService.getLoanCalculate(this.currentUser.access_token, this.loanCalculateObject).subscribe((loanInfo: any) => {

          if(loanInfo.status === 'SUCCESS' && loanInfo.data !== null) {
            this.getLoan.conSaving.setValue(loanInfo.data.conSaving);
            this.getLoan.firstPayment.setValue(this.numberToCurrency(loanInfo.data.firstPayment));
            this.getLoan.lastPayment.setValue(this.numberToCurrency(loanInfo.data.lastPayment));
            this.getLoan.monthlyPayment.setValue(this.numberToCurrency(loanInfo.data.monthlyPayment));
            this.getLoan.processingFees.setValue(this.numberToCurrency(loanInfo.data.processingFees));
            this.getLoan.conSaving.setValue(this.numberToCurrency(loanInfo.data.totalConSaving));
            this.getLoan.totalRepayment.setValue(this.numberToCurrency(loanInfo.data.totalRepayment));
          }

        });

      }
    });
  }

  private loanFormBuilder() {
    this.loanForm = this.fb.group({
      daLoanTypeId: ['1'],
      daProductTypeId:[1],
      productDescription: [''],
      financeAmount: ['', [Validators.required, maxAmountOfFinance(2000000,50000)]],
      financeTerm: ['6'],
      processingFees: [''],
      conSaving: [''],
      totalRepayment: [''],
      firstPayment: [''],
      monthlyPayment: [''],
      lastPayment: [''],
      residentProofAttachment: [null, [Validators.required]],
      incomeProofAttachment: [null, [Validators.required]],
      householdCriminalClearance: [null, [Validators.required]],
      nrcFront: [null, [Validators.required]],
      nrcBack : [null, [Validators.required]],
      nrcGuarantorFront: [null, [Validators.required]],
      nrcGuarantorBack: [null, [Validators.required]],
      applicationPhoto: [null, [Validators.required]],
      customerSign: [null, [Validators.required]],
      guarantorSign: [null, [Validators.required]]
    }, { validators: imageValidator });
  }

  private getTermsAndConditions(){
    this.dataService.getTermsAndConditions().subscribe((res: any) => {
      if(res.status === 'SUCCESS' && res.data) {
        this.responseMessage.termsAndConditions = res.data;
      }

      if(this.translateService.store.currentLang === 'mm') {
        this.responseMessage.termsAndConditions = res.data.descriptionMyn;
      }

      if(this.translateService.store.currentLang === 'en') {
        this.responseMessage.termsAndConditions = res.data.descriptionEng;
      }

      this.translateService.onLangChange.subscribe((language: any) => {
        if(language.lang === 'mm') {
          this.responseMessage.termsAndConditions = res.data.descriptionMyn;
        }

        if(language.lang === 'en') {
          this.responseMessage.termsAndConditions = res.data.descriptionEng;
        }
      });
    });
  }

  private getProductTypeList() {
    this.dataService.getProductTypeList().subscribe((res: any) => {
      this.productTypeList = res.data;
    });
  }

  private ConfirmFormBuilder() {
    this.passwordConfirmForm = this.fb.group({
      password: ['', [Validators.required, languageValidator, Validators.minLength(6)]]
    });
  }

  private termOfFinanceChange() {
    let financeAmount = this.getLoan.financeAmount.value;

    if(financeAmount <= 100000 && financeAmount < 160000) {
      this.termOfFinance.type1 = true;
      this.termOfFinance.type2 = false;
      this.termOfFinance.type3 = false;
    }

    if(financeAmount >= 160000 && financeAmount < 700001) {
      this.termOfFinance.type1 = false;
      this.termOfFinance.type2 = true;
      this.termOfFinance.type3 = false;
    }

    if(financeAmount >= 700001) {
      this.termOfFinance.type1 = false;
      this.termOfFinance.type2 = false;
      this.termOfFinance.type3 = true;
    }

    return this.termOfFinance;
  }

  private numberToCurrency(amount: any) {
    let currency: any = new NumeralPipe(amount).format('0,0');
    return currency;
  }

  private loanCalculate(body: any) {
    this.dataService.getLoanCalculate(this.currentUser.access_token, body).subscribe((res: any) => {
      if(res.status === "SUCCESS" && res.data !== null) {
        this.getLoan.processingFees.setValue( this.numberToCurrency(res.data.processingFees));
        this.getLoan.conSaving.setValue( this.numberToCurrency(res.data.conSaving));
        this.getLoan.totalRepayment.setValue(this.numberToCurrency(res.data.totalRepayment));
        this.getLoan.firstPayment.setValue(this.numberToCurrency(res.data.firstPayment));
        this.getLoan.monthlyPayment.setValue(this.numberToCurrency(res.data.monthlyPayment));
        this.getLoan.lastPayment.setValue(this.numberToCurrency(res.data.lastPayment));
      }
    });
  }

  private prepareRegister() {
    this.applicationFormService.finalData.subscribe((res: any) => {
      this.saveObject = res;
    });
  }

  errorHandling = (control: string, error: string) => {
    return this.loanForm.controls[control].hasError(error);
  }

  confirmAccountrrorHandling(control: string, error: string) {
    return this.passwordConfirmForm.controls[control].hasError(error);
  }

  changeFinanceAmount($event: any) {
    const financeAmount = new NumeralPipe($event.target.value).value();
    const financeTerm = this.getLoan.financeTerm.value;

    this.termOfFinanceChange();

    const body = {
      loanTerm : financeTerm,
      financeAmount: financeAmount,
      motorCycleLoanFlag: false
    }

    this.loanCalculate(body);
  }

  termsAndConditionsDialogBoxOpen() {
  
    this.dialog.open(this.termsAndConditions, { width: '400px' });
  }

  imageUploader($event: any) {
    let reader = new FileReader();
    let image = $event.target.files[0];

this.ng2ImgMax.resizeImage(image, 400, 300).subscribe(
  result => {
 
 
    reader.readAsDataURL(  result);
    reader.onload = (_event) => {
      this[$event.target.id + 'Object'].photoByte = (<string>reader.result).split(',')[1];
    }

    $event.target.value = null;

  },
  error => {
    console.log('😢 Oh no!', error);
  }
);

  }

  imageCancle(photoControl: any, photoObject: any){
    if(photoObject.photoByte !== undefined && photoObject.photoByte !== null) {
      photoObject.photoByte = null;
      let value : any = this.getLoan[photoControl];
      value.value = null;
      value.errors = { required: true };
    }
  }

  financeTermCalculate($event: any){
    if(this.getLoan.financeAmount.value !== '' || this.getLoan.financeAmount.value !== null) {
      const financeAmount = new NumeralPipe(this.getLoan.financeAmount.value).value();

      const body = {
        loanTerm : $event.value,
        financeAmount: financeAmount,
        motorCycleLoanFlag: false
      }
      this.loanCalculate(body);
    }
  }

  loanSave() {

    this.loading = true;
    this.submitted = true;
  
    if(this.saveObject.applicationFormError){
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.loading = false;
    this.registerForm.change(0);
      return;
    }
    if(this.saveObject.applicantCompanyInfoDto === null || this.saveObject.applicantCompanyInfoDto.occupationFormError){
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.loading = false;
    this.registerForm.change(1);
      return;
    }
    if(this.saveObject.emergencyContactInfoDto === null || this.saveObject.emergencyContactInfoDto.emergencyFormError){
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.loading = false;
    this.registerForm.change(2);
      return;
    }
    if(this.saveObject.guarantorInfoDto === null || this.saveObject.guarantorInfoDto.guarantorFormError){
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.loading = false;
    this.registerForm.change(3);
      return;
    }

    if(this.loanForm.invalid) {
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.loading = false;
      return;
    }

    this.saveObject.applicationInfoAttachmentDtoList = this.applicationInfoAttachmentDtoList;
    this.saveObject.applicationInfoAttachmentDtoList = this.applicationInfoAttachmentDtoList;
    this.saveObject.daLoanTypeId = Number(this.getLoan.daLoanTypeId.value);
    this.saveObject.financeAmount =this.getLoan.financeAmount.value;
    this.saveObject.financeTerm = Number(this.getLoan.financeTerm.value);
    this.saveObject.daProductTypeId = Number(this.getLoan.daProductTypeId.value);
    this.saveObject.productDescription = this.getLoan.productDescription.value;
    this.saveObject.customerId = this.currentUser.userInformationResDto.customerId;
    this.saveObject.channelType = 2;
    this.saveObject.daApplicationTypeId = 1;  


   //this.snackBar.openFromTemplate(this.saveSnackBar, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
    this.confirmModel = this.dialog.open(this.passwordForm);

    this.loading = false;
    this.submitted = false;
  }

  checkAppliantUser() {
    this.passwordLoading = true;

    let authRequset: any = {
      password: this.passwordConfirmForm.controls.password.value,
      username: this.currentUser.userInformationResDto.phoneNo
    }
    delete this.saveObject['applicationFormError'];
    delete this.saveObject.applicantCompanyInfoDto['occupationFormError'];
    delete this.saveObject.emergencyContactInfoDto['emergencyFormError'];
    delete this.saveObject.guarantorInfoDto['guarantorFormError'];

    this.dataService.checkAppliantUser(authRequset).subscribe((auth: any) => {
      if(auth.status === 'FAILED') {
        this.passwordConfirmForm.controls.password.setErrors({loginFail: true});
        this.passwordLoading = false;
      }

      if(auth.status === 'SUCCESS') {
        this.confirmModel.close();


        this.dataService.registration(this.currentUser.access_token, this.saveObject).subscribe((res: any) => {

          if(res.status === 'FAILED') {
            this.responseMessage = res.message;
            this.snackBar.openFromTemplate(this.applicationFail, { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center'})
            this.passwordLoading = false;
          }

          if(res.status === 'SUCCESS') {
            this.router.navigateByUrl('/inquery');
            this.passwordLoading = false;
          }
        });
      }
    });

  }

  ngOnInit() {

    this.authService.refreshToken();
    this.loanFormBuilder();
    this.getProductTypeList();
    this.getTermsAndConditions();
    this.ConfirmFormBuilder();
    setTimeout(() => {
      this.prepareRegister();
    },0);
  }



}
