import { Component, OnInit, ViewChild, ɵConsole, TemplateRef } from '@angular/core';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { languageValidator, numOnlyValidator, maxAmountOfFinance, errorMessage, numLengthValidator } from 'src/app/cores/helper/validators';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NumeralPipe } from 'ngx-numeral';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-new-user-loan',
  templateUrl: './new-user-loan.component.html',
  styleUrls: ['./new-user-loan.component.css']
})
export class NewUserLoanComponent implements OnInit {

  processingFees: any;
  conSaving: any;
  totalRepayment: any;
  firstPayment: any;
  monthlyPayment: any;
  lastPayment:any;
  hiddenSix = true;
  hiddenNine = true;
  hiddentwelve = true;
  hiddenEighteen = true;
  newRegister: any = {};
  nextLoading = false;
  currentUser: any;
  loanTypeList: any = [];
  daApplicationTypeId: any;
  loanForm: FormGroup;
  passwordConfirmForm: FormGroup;
  loanTypeDefaultValue: any;
  productTypeList: any;
  submitted: boolean;
  loanCalculateErrorState: boolean;
  errorMsg: any = errorMessage;
  imageType: string = 'data:image/png;base64,';
  termsAndConditions: any;
  loanTermInfo: any = {};
  saveObject: any;
  userAuthInfo: any = {};
  resMessage: string;
  defaultLoanType: any;
  id: any;

  nrcFrontObject: any = { fileType: 1};
  nrcBackObject: any = { fileType: 2 };
  residentProofAttachmentObject: any = { fileType: 3 };
  incomeProofAttachmentObject: any = { fileType: 4 };
  nrcGuarantorFrontObject: any = { fileType: 5 };
  nrcGuarantorBackObject: any = { fileType: 6 };
  householdCriminalClearanceObject: any = { fileType: 7 };
  applicationPhotoObject: any = { fileType: 8 };
  customerSignObject: any = { fileType: 9 };
  guarantorSignObject: any = { fileType: 11};
  loanCalculateObject: any = {};
  loading: boolean = false;
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
  @ViewChild('erorrSnack', { static: false })
  erorrSnack: any = TemplateRef;
  

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

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
      if (localStorage.getItem('newRegister')) {
      this.newRegister = JSON.parse(localStorage.getItem('newRegister'));
      console.log(this.newRegister);
      if(!('guarantorInfoDto' in this.newRegister)||this.newRegister.applicantFormError || this.newRegister.applicantCompanyInfoDto.occupationFormError || this.newRegister.emergencyContactInfoDto.emergencyFormError||this.newRegister.guarantorInfoDto.guarantorFormError){
        this.dataService.formError=true;
        this.router.navigate(['/new-user-guarantor/']);
      }
      if(this.dataService.formError){
        this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.dataService.formError=false;
      }

    
    } else {
      this.router.navigate(['login']);


  }


  }

  ngOnInit() {
    this.submitted = false;
    this.loanCalculateErrorState = false;
    this.authService.refreshToken();
    this.loanFormBuilder();

  }



  public errorHandling = (control: string, error: string) => {
    return this.loanForm.controls[control].hasError(error);
  }

  public errorHandlingConfirm = (control: string, error: string) => {
    return this.passwordConfirmForm.controls[control].hasError(error);
  }



  loanFormBuilder() {
    this.loanForm = this.fb.group({

      financeAmount: ['', [Validators.required,  maxAmountOfFinance(2000000,50000)]],
      financeTerm: [null, [Validators.required]],

      residentProofAttachment: [null],
      incomeProofAttachment: [null],
      householdCriminalClearance: [null],
      nrcFront: [null ],
      nrcBack : [null],
      nrcGuarantorFront: [null],
      nrcGuarantorBack: [null],
      applicationPhoto: [null],
      customerSign: [null],
      guarantorSign:[null],
      // otherPhoto: [null, [Validators.required]]
    });



    if('applicationInfoAttachmentDtoList' in this.newRegister){
      this.newRegister.applicationInfoAttachmentDtoList.find( (key: any) => {

        if ( 1 === key.fileType){
          this.nrcFrontObject.photoByte = key.photoByte;
        
        }
        if ( 2 === key.fileType){
          this.nrcBackObject.photoByte =key.photoByte;
          this.f.nrcBack.setErrors({required:false});   
        }
        if (3 === key.fileType) {
        this.residentProofAttachmentObject.photoByte=key.photoByte;
        this.f.residentProofAttachment.setErrors({required:false});   

        }
        if (4 === key.fileType){
        this.incomeProofAttachmentObject.photoByte =key.photoByte;
        this.f.incomeProofAttachment.setErrors({required:false});   
        }
        if( 5 === key.fileType){
          this.nrcGuarantorFrontObject.photoByte = key.photoByte;
     this.f.nrcGuarantorFront.setErrors({required:false});   
        }
        if( 6 === key.fileType){
          this.nrcGuarantorBackObject.photoByte = key.photoByte;
     this.f.nrcGuarantorBack.setErrors({required:false});   
        }
        if( 7 === key.fileType){
          this.householdCriminalClearanceObject.photoByte = key.photoByte;
    this.f.householdCriminalClearance.setErrors({required:false});   
        }
        if ( 8 === key.fileType){
          this.applicationPhotoObject.photoByte = key.photoByte;
      this.f.applicationPhoto.setErrors({required:false});   
        }
        if( 9 === key.fileType){
          this.customerSignObject.photoByte = key.photoByte;
       this.f.customerSign.setErrors({required:false});   
        }
        if( 11 ===key.fileType){
          this.guarantorSignObject.photoByte = key.photoByte;
          this.f.guarantorSign.setErrors(null);   
        }

      });

    }
    if ('financeAmount' in this.newRegister){
      this.f.financeAmount.setValue(this.newRegister.financeAmount);
      this.f.financeTerm.setValue(this.newRegister.financeTerm);
      this.financeTermCalculation(this.f.financeAmount.value);
    if(this.f.financeAmount.value === '' || !Number(this.f.financeAmount.value)) {
      this.loanCalculateErrorState = true;
    } else {
      const body = {
        loanTerm :this.f.financeTerm.value,
        financeAmount: this.f.financeAmount.value,
        motorCycleLoanFlag: false
      }

      this.dataService.getLoanCalculateForNewUser( body).subscribe((res: any) => {
        if(res.status === "FAILED") {
          this.errorMsg.getLoanErrorMessage = 'Minimum of finance amount must be 100000.';
        }
      console.log('Hello');
        if(res.status === "SUCCESS" && res.data !== null) {
          
          this.loanCalculateErrorState = false;
          this.processingFees= res.data.processingFees;
          this.conSaving= (res.data.conSaving);
          this.totalRepayment= (res.data.totalRepayment);
          this.firstPayment = (res.data.firstPayment);
          this.monthlyPayment = (res.data.monthlyPayment);
          this.lastPayment = (res.data.lastPayment);
        }},(error: any) => {
          console.log('Error : ' + JSON.stringify(error))
          if(error) { this.modalService.open(ModalComponent); }
      });
    }
  }

  }

  get f() { return this.loanForm.controls; }
  get p() { return this.passwordConfirmForm.controls; }

  loanCalculate($event: any){
    console.log($event.value);
    if(this.f.financeAmount.value === '' || !Number(this.f.financeAmount.value)) {
      this.loanCalculateErrorState = true;
    } else {
      const body = {
        loanTerm : $event.value,
        financeAmount: this.f.financeAmount.value,
        motorCycleLoanFlag: false
      }

      this.dataService.getLoanCalculateForNewUser( body).subscribe((res: any) => {
        if(res.status === "FAILED") {
          this.errorMsg.getLoanErrorMessage = 'Minimum of finance amount must be 100000.';
        }
      console.log('Hello');
        if(res.status === "SUCCESS" && res.data !== null) {
          this.loanCalculateErrorState = false;
          this.processingFees=(res.data.processingFees);
          this.conSaving=(res.data.conSaving);
          this.totalRepayment=(res.data.totalRepayment);
          this.firstPayment=(res.data.firstPayment);
          this.monthlyPayment=(res.data.monthlyPayment);
          this.lastPayment=(res.data.lastPayment);
        }},(error: any) => {
          console.log('Error : ' + JSON.stringify(error))
          if(error) { this.modalService.open(ModalComponent); }
      });
    }
  }



  resetFinanceTerm() {
    this.f.financeTerm.setValue(null);
  }

  imageUploader($event: any) {
    let reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    
      
    reader.onload = (_event) => { 
      this[$event.target.id + 'Object'].photoByte = (<string>reader.result).split(',')[1];
    }

    $event.target.value = null;
    console.log(this.f.nrcFront.value);
  


  }
    nextSubmit() {
    this.submitted = true;
    this.nextLoading = true;
    this.checkError();
    if (this.loanForm.invalid) { this.nextLoading = false; return; }
    this.saveDraft();
    this.router.navigate(['/my-account/'], { queryParams:  filter, skipLocationChange: true});
  }

  imageCancle($event: any){

    this[$event.target.value + 'Object'].photoByte = null;
    this.f[$event.target.value].setValue(null);
  }

  saveDraft() {
  
    this.loading = true;
    this.newRegister.applicationInfoAttachmentDtoList = this.applicationInfoAttachmentDtoList;
    this.newRegister.financeAmount= this.f.financeAmount.value;
    this.newRegister.financeTerm= this.f.financeTerm.value;
    if(this.loanForm.invalid){    this.newRegister.loanFormError=true;
    }
    else{
      this.newRegister.loanFormError=false;
    }
    localStorage.setItem('newRegister', JSON.stringify(this.newRegister));

  }
  changeFinanceAmount($event){

    this.financeTermCalculation(new NumeralPipe($event.target.value).value());

  }
  financeTermCalculation (data :any){
   
    this.hiddenSix = true;
    this.hiddenNine = true;
    this.hiddentwelve = true;
    this.hiddenEighteen = true;
    if (data >= 50000 && data<= 150000){
    this.hiddenSix=false;
    }
    else if (data >= 150001 && data <= 700000){
      this.hiddenSix = false;
      this.hiddenNine = false;
      this.hiddentwelve = false;
      this.hiddenEighteen = false;
      }
      else if (data >= 700000 && data <= 2000000){

        this.hiddenNine = false;
        this.hiddentwelve = false;
        this.hiddenEighteen = false;
        }


  }
  clickLink($event: any){
    console.log (this.f.residentProofAttachment);
    this.submitted = true;
    this.nextLoading = true;
    this.checkError();
    if (this.loanForm.invalid) {
      this.snackBar.openFromTemplate(this.erorrSnack, { duration: 3000, verticalPosition : "top", horizontalPosition : "center"});
      this.nextLoading = false; return; }
    this.saveDraft();
    console.log('Next');
    this.router.navigate(['/'+$event.target.id+'/'], { queryParams:  filter, skipLocationChange: true});

  }
  clickBackLink($event: any){
    this.saveDraft();
    this.router.navigate(['/'+$event.target.id+'/'], { queryParams:  filter, skipLocationChange: true});
  }
  checkError(){

    if (this.nrcFrontObject.photoByte === null || this.nrcFrontObject.photoByte ===""){
      this.f.nrcFront.setErrors({required:true});
    }
    if (this.nrcBackObject.photoByte === null || this.nrcBackObject.photoByte ===""){
      this.f.nrcBack.setErrors({required:true});
    }
    if (this.residentProofAttachmentObject.photoByte === null || this.residentProofAttachmentObject.photoByte ===""){
      this.f.residentProofAttachment.setErrors({required:true}); 
    }
    if (this.incomeProofAttachmentObject.photoByte === null || this.incomeProofAttachmentObject.photoByte ===""){
      this.f.incomeProofAttachment.setErrors({required:true});
    }
    if (this.householdCriminalClearanceObject.photoByte === null || this.householdCriminalClearanceObject.photoByte ===""){
      this.f.householdCriminalClearance.setErrors({required:true});
    }
    if (this.nrcGuarantorFrontObject.photoByte === null || this.nrcGuarantorFrontObject.photoByte ===""){
      this.f.nrcGuarantorFront.setErrors({required:true});
    }
    if (this.nrcGuarantorBackObject.photoByte === null || this.nrcGuarantorBackObject.photoByte ===""){
      this.f.nrcGuarantorBack.setErrors({required:true});
    }
    if (this.applicationPhotoObject.photoByte === null || this.applicationPhotoObject.photoByte ===""){
      this.f.applicationPhoto.setErrors({required:true});
    }
    if (this.customerSignObject.photoByte === null || this.customerSignObject.photoByte ===""){
      this.f.customerSign.setErrors({required:true});
    }
    if (this.guarantorSignObject.photoByte === null || this.guarantorSignObject.photoByte ===""){
      this.f.guarantorSign.setErrors({required:true});
    }
 

  }
  back(){
    this.saveDraft(); this.router.navigate(['/new-user-guarantor/'], { queryParams:  filter, skipLocationChange: true});
  }

}
