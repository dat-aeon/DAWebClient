import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/cores/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { errorMessage } from 'src/app/cores/helper/validators';
import { DataService } from 'src/app/cores/helper/data.service';
import { config } from 'src/app/cores/configuration';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NumeralPipe } from 'ngx-numeral';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.css'] 
})

export class LoanDetailComponent implements OnInit {

  @ViewChild('mymodal', { static: true })
  private  mymodal: any;

  appInfo : any = {};
  currentUser: any;
  id: any;
  loanTypeList: any = [];
  loanForm: FormGroup;
  submitted: boolean;
  loanCalculateErrorState: boolean;
  errorMsg: any = errorMessage;
  imageType: string;
  imagePath: string;
  userAuthInfo: any = {};
  nrfcObject: any = {};
  nrcbObject: any = {};
  ipaObject: any = {};
  rpaObject: any = {};
  gnrfObject: any = {};
  gnrcbObject: any = {};
  hccaObject: any = {};
  appPhotoObject: any = {};
  csmSignObject: any = {};
  loanInfo: any = {};
  responseMessage: any;
  loanCalculateInfo: any = {};
  modalOptions:NgbModalOptions;
  loanEdit: boolean = false;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { 

    const navigation = this.router.getCurrentNavigation();

    if(navigation.extras.state) {
      this.id = navigation.extras.state.orderId;
    } else {
      this.router.navigateByUrl('/inquery');
    }

    this.authService.currentUser.subscribe( (user: any) => {
      this.currentUser = user.data;
    });

    this.modalOptions = { backdrop:'static', backdropClass:'customBackdrop' }
  }

  ngOnInit() {
    this.authService.refreshToken();
    this.imagePath = config.imageUrl;
    this.imageType = config.imageType;
    this.loanFormBuilder();
    this.loadLoanInfo();
  }

  private loadLoanInfo() {
    this.dataService.getApplicationInfoDetail(this.currentUser.access_token, this.id).subscribe( (res: any) => {
      console.log(res);
      if(Number(res.data.status) === 5) {
        this.loanEdit = true;
      }

      const body = {
        financeAmount: res.data.financeAmount,
        loanTerm: res.data.financeTerm,
        motorCycleLoanFlag: false
      }

      this.dataService.getLoanTypeList(this.currentUser.access_token).subscribe( (loanType: any) => {
        loanType.data.find((key: any) => {
          if(key.loanTypeId === res.data.daLoanTypeId) {
            this.appInfo.daLoanTypeTitle = key.name;
          }
        });
      });

      this.dataService.getProductTypeList().subscribe( (product: any) => {
        product.data.find( (key: any) => {
          if(key.productTypeId === res.data.daProductTypeId) {
            this.appInfo.productType = key.name;
          }
        });
      });

      // this.dataService.getLoanCalculate(this.currentUser.access_token, body).subscribe( (res: any) => {
      //   this.loanCalculateInfo = res.data;
      // });

      this.appInfo = res.data;
      this.appInfo.financeAmount = new NumeralPipe(res.data.financeAmount).format('0,0');
      this.appInfo.processingFees = new NumeralPipe(res.data.processingFees).format('0,0');
      this.appInfo.totalInterest = new NumeralPipe(res.data.totalInterest).format('0,0');
      this.appInfo.totalRepayment = new NumeralPipe(res.data.totalRepayment).format('0,0');
      this.appInfo.monthlyInstallment = new NumeralPipe(res.data.monthlyInstallment).format('0,0');
      this.appInfo.firstPayment = new NumeralPipe(res.data.firstPayment).format('0,0');
      this.appInfo.lastPayment = new NumeralPipe(res.data.lastPayment).format('0,0');
      this.appInfo.modifyTotalRepayment = new NumeralPipe(res.data.modifyTotalRepayment).format('0,0');
      this.appInfo.totalConSaving = new NumeralPipe(res.data.totalConSaving).format('0,0');

      this.nrfcObject = res.data.applicationInfoAttachmentDtoList[0];
      this.nrcbObject = res.data.applicationInfoAttachmentDtoList[1];
      this.ipaObject =  res.data.applicationInfoAttachmentDtoList[2];
      this.rpaObject = res.data.applicationInfoAttachmentDtoList[3];
      this.gnrfObject = res.data.applicationInfoAttachmentDtoList[4];
      this.gnrcbObject = res.data.applicationInfoAttachmentDtoList[5];
      this.hccaObject = res.data.applicationInfoAttachmentDtoList[6];
      this.appPhotoObject = res.data.applicationInfoAttachmentDtoList[7];
      this.csmSignObject = res.data.applicationInfoAttachmentDtoList[8];

    });
  }


  get f() { return this.loanForm.controls; }

  loanFormBuilder() {
    this.loanForm = this.fb.group({
      nrfc: [ null, [ Validators.required ]],
      nrcb: [ null, [ Validators.required ]],
      ipa: [ null, [ Validators.required ]],
      rpa: [ null, [ Validators.required ]],
      gnrf: [ null, [ Validators.required ]],
      gnrcb: [ null, [ Validators.required ]],
      hcca: [ null, [ Validators.required ]],
      appPhoto: [ null, [ Validators.required ]],
      csmSign: [ null, [ Validators.required ]]
    });
  }

  imageUploader($event: any) {
    const reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);

    if ($event.target.files[0].type.match(/image\/*/) == null) { 
      this.errorMsg.imgError = "Only support image file and (PNG, JPEG, GIF) format!";
      return; 
    }
    
    reader.onload = (_event) => { 
      this[$event.target.id + 'Object'].photoByte = (<string>reader.result).split(',')[1];
    } 
  }

  editPhoto() {
    
    const requestObject = {
      daApplicationInfoId: this.id,
      applicationInfoAttachmentDtoList: [ 
        this.nrfcObject, 
        this.nrcbObject, 
        this.ipaObject, 
        this.rpaObject, 
        this.gnrfObject, 
        this.gnrcbObject,
        this.hccaObject, 
        this.appPhotoObject,
        this.csmSignObject
      ]
    }

    this.dataService.attachmentEdit(this.currentUser.access_token, requestObject).subscribe( (res: any) => {
      if(res.status === 'SUCCESS' && res.data === null) {
        this.responseMessage = 'Attachment update is successfully!';
        this.modalService.open(this.mymodal);
      } 

      if(res.status === 'FAILED') {
        this.responseMessage = res.message;
        this.modalService.open(this.mymodal);
      }
    });
  }

}
