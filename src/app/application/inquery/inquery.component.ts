import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from 'src/app/cores/helper/data.service';
import { AuthService } from 'src/app/cores/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { languageValidator, numOnlyValidator, errorMessage } from 'src/app/cores/helper/validators';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/cores/helper/modal/modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatDialog } from '@angular/material';

export interface PeriodicElement {
  applicationNo: any,
  financeAmount: any,
  financeTerm: any,
  daLoanTypeName: any,
  appliedDate: any,
  status: any,
  daApplicationInfoId: any
}

@Component({
  selector: 'app-inquery',
  templateUrl: './inquery.component.html',
  styleUrls: ['./inquery.component.css']
})

export class InqueryComponent implements OnInit, ViewChild {
  descendants: boolean;
  first: boolean;
  read: any;
  isViewQuery: boolean;
  selector: any;
  static: boolean;
  tableData: any = [];

  currentUser: any;
  inquerySearchForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  errorMsg: any  = errorMessage;
  dd: any;
  applicationInfoDtoList: any = [];
  tableShow: boolean = false;
  modalOptions: NgbModalOptions;
  loanTypeList: any = {};
  dataSource: MatTableDataSource<PeriodicElement>;

  displayedColumns: string[] = ['applicationNo', 'appliedDate', 'loanAmount','approvedAmount', 'loanTerm','approvedTerm', 'status', 'daApplicationInfoId'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild( MatSort, {static: true}) sort: MatSort;
  @ViewChild('cancel', { static: false })
  cancel: any = TemplateRef;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private modalService: NgbModal
  ) { 

    this.modalOptions = { backdrop:'static', backdropClass:'customBackdrop' }
    this.authService.currentUser.subscribe( (res: any) => { this.currentUser = res.data; });
  }

  private allInqueryList() {
    const requestObject = {
      customerId: this.currentUser.userInformationResDto.customerId,
      daLoanTypeId: '',
      appliedDate: '',
      applicationNo: '',
      status: null,
      offset: 0,
      limit: 10
    };

    this.dataService.getApplicationInquriesList(this.currentUser.access_token, requestObject).subscribe( (res: any) => {
      this.tableShow = true;

      this.dataService.getLoanTypeList(this.currentUser.access_token).subscribe( (rest: any) => {
        this.loanTypeList = rest.data;

        for(let x=0; x<res.data.applicationInfoDtoList.length; x++) {
          this.loanTypeList.find( (key: any) => {
            if(key.loanTypeId === res.data.applicationInfoDtoList[x].daLoanTypeId) {
              res.data.applicationInfoDtoList[x].daLoanTypeName = key.name;
            }
          });
        }

        let sources: any = [];
        let source: any;
        for(let x=0; x<res.data.applicationInfoDtoList.length; x++) {
          source = {
            applicationNo: res.data.applicationInfoDtoList[x].applicationNo,
            loanAmount: res.data.applicationInfoDtoList[x].financeAmount,
            approvedAmount:res.data.applicationInfoDtoList[x].approvedFinanceAmount,
            loanTerm: res.data.applicationInfoDtoList[x].financeTerm,
            approvedTerm: res.data.applicationInfoDtoList[x].approvedFinanceTerm,
            appliedDate: res.data.applicationInfoDtoList[x].appliedDate,
            status: res.data.applicationInfoDtoList[x].status,
            daApplicationInfoId: res.data.applicationInfoDtoList[x].daApplicationInfoId
          }
  
          sources.push(source);
        }
        
      this.dataSource = new MatTableDataSource<PeriodicElement>(sources);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      });
      
    });
  }


public errorHandling = (control: string, error: string) => {
    return this.inquerySearchForm.controls[control].hasError(error);
  }

  public date(e: any) {
    var convertDate = new Date(e.target.value);
    this.inquerySearchForm.get('appDate').setValue(convertDate, { onlyself: true });
  }

  ngOnInit() {
    this.authService.refreshToken();
    this.allInqueryList();
    this.dataService.getLoanTypeList(this.currentUser.access_token).subscribe( (res: any) => {
      this.loanTypeList = res.data;
    });
    this.inquerySearchFormBuilder();
  }

  onSubmit() {
    this.submitted = true;
    if (this.inquerySearchForm.invalid) { return; }
    this.inquerySearch();
  }

  get f() { return this.inquerySearchForm.controls; }

  inquerySearchFormBuilder() {
    this.inquerySearchForm = this.fb.group( {
      appNo: ['', [languageValidator, numOnlyValidator]],

      appDate: [],

    });
  }
  
  CancelDialogBoxOpen() {
  
    this.dialog.open(this.cancel, { width: '400px' });
  }


  addLoanTypeName (res: any) {
    for(let x=0; x<res.data.applicationInfoDtoList.length; x++) {
      this.loanTypeList.find( (key: any) => {
        if(key.loanTypeId === res.data.applicationInfoDtoList[x].daLoanTypeId) {
          res.data.applicationInfoDtoList[x].daLoanTypeName = key.name;
        }
      });
    }
  }

  inquerySearch() {
    const requestObject = {
      customerId: this.currentUser.userInformationResDto.customerId,

      appliedDate: this.f.appDate.value,
      applicationNo: this.f.appNo.value,

      offset: 0,
      limit: 10
    };

    this.dataService.getApplicationInquriesList(this.currentUser.access_token, requestObject).subscribe( 
      (res: any) => {
        if(res.data.applicationInfoDtoList.length === 0) {
          this.loading = false;
          this.tableShow = false;
        }

        if(res.data.applicationInfoDtoList.length !== 0) {
          this.tableShow = true;
          this.addLoanTypeName(res);
          this.loading = false;

          let sources: any = [];
          let source: any;

          for(let x=0; x<res.data.applicationInfoDtoList.length; x++) {
            source = {
              applicationNo: res.data.applicationInfoDtoList[x].applicationNo,
              loanAmount: res.data.applicationInfoDtoList[x].financeAmount,
              approvedAmount:res.data.applicationInfoDtoList[x].approvedFinanceAmount,
              loanTerm: res.data.applicationInfoDtoList[x].financeTerm,
              approvedTerm: res.data.applicationInfoDtoList[x].approvedFinanceTerm,
              daLoanTypeName: res.data.applicationInfoDtoList[x].daLoanTypeName,
              appliedDate: res.data.applicationInfoDtoList[x].appliedDate,
              status:  res.data.applicationInfoDtoList[x].status,
              daApplicationInfoId: res.data.applicationInfoDtoList[x].daApplicationInfoId
            }

            sources.push(source);
          }

          this.dataSource = new MatTableDataSource<PeriodicElement>(sources);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },

      (error: any) => {
        if(error) {
          this.modalService.open(ModalComponent);
        }
      }
    );
  }


}


