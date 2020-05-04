import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { config, JSONHeader, BasicAuthHeader} from '../configuration';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Data } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class DataService {

  convertDate: any;
  private dataSource = new BehaviorSubject({});
  applicationForm = this.dataSource.asObservable();
  private errorForm:boolean= false;



  constructor(
    private http: HttpClient
  ) { }

  getStaticInfo() { return this.http.get('/assets/staticInfo.json'); }
  getEducationList() {return this.http.get(config.api+'/information/highest-education-type-list?');}
  townshipCodeList() { return this.http.get(config.api + '/information/township-code-list-web'); }
  securityQuestion() { return this.http.get(config.api + '/reset-password/security-question-list'); }
  getCityTownshipCodeList(){return this.http.get(config.api+'/information/city-township-info-list');}
  getApplicationTypeList () { return this.http.get(config.api + '/information/application-type-list'); }
  getProductTypeList() { return this.http.get(config.api + '/information/product-type-list', { headers : JSONHeader }); }
  getTermsAndConditions () { return this.http.get(config.api + '/information/terms-and-conditions', {headers: JSONHeader}); }

  getCustomerSecurityQuestionList(access_token: string, id: string) {
    return this.http.post(config.api + '/customer-info-manage/get-customer-security-question-list?access_token=' + access_token, { customerId : id}, {headers: JSONHeader});
  }

  getLastApplicationInfo(access_token: any, id: string) {
    return this.http.post(config.api + '/application/last-application-info?access_token=' + access_token, { customerId: id } , { headers: JSONHeader});
  }

  checkAppliantUser(data: any): Observable<any> {
    const body = new HttpParams().set('username', data.username).set('password', data.password) .set('grant_type', 'password');
    
    return this.http.post(config.api + '/oauth/token', body, { headers: BasicAuthHeader }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  saveDraft(access_token: any, body: any) {
    return this.http.post(config.api + '/application/save-draft?access_token=' + access_token, body , { headers: JSONHeader});
  }

  getLoanTypeList(access_token: any) {
    return this.http.get(config.api + '/information/loan-type-list?access_token=' + access_token, {headers: JSONHeader});
  }

  getLoanCalculate(access_token: any, body: any) {
    return this.http.post(config.api + '/loan-calculator/loan-calculate?access_token=' + access_token, body, {headers: JSONHeader});
  }
  getLoanCalculateForNewUser( body: any) {
    return this.http.post(config.api + '/free-token/loan-calculate?' ,  body, {headers: JSONHeader});
  }
  registration(access_token: any, body: any) {
    return this.http.post(config.api + '/application/register?access_token=' + access_token, body, {headers: JSONHeader});
  }
  
  getApplicationInquriesList(access_token: any, body: any) {
    return this.http.post(config.api + '/application/application-inquries-list?access_token=' + access_token, body, { headers: JSONHeader });
  }

  getApplicationDashboardInfo(access_token: string, id: string) {
    return this.http.post(config.api + '/application/dashboard-info?access_token=' + access_token, { customerId: id }, { headers: JSONHeader });
  }

  getApplicationInfoDetail(access_token: any, id: string) {
    return this.http.post(config.api + '/application/application-info-detail?access_token=' + access_token, { daApplicationInfoId: id }, { headers : JSONHeader });
  }
  
  attachmentEdit(access_token: any, requestObject: any) {
    return this.http.post(config.api + '/application/attachment-edit?access_token=' + access_token, requestObject , { headers: JSONHeader });
  }
  getAttachmentEditLis(access_token: any, id:string){
    return this.http.post(config.api + '/application/get-application-attachment-list?access_token=' + access_token,  { daApplicationInfoId: id } , { headers: JSONHeader });
  }

  getPurchaseInfoDetail(access_token: any, id: string) {
    return this.http.post(config.api + '/application/purchase-info-detail?access_token=' + access_token, { daApplicationInfoId: id }, { headers: JSONHeader });
  }
  
  freeRegistration(data: any) {

    return this.http.post(config.api + '/free-application/register' , data, {headers: JSONHeader});
  }
  confirmSecurityQuestionAnswer(access_token: any, body: any) {
    return this.http.post(config.api + '/reset-password/confirm-security-question-answer?access_token=' + access_token, body, { headers: JSONHeader });
  }

  updatedDataSelection(data: any){
    this.dataSource.next(data);
  }
  getValue(){
    return this.dataSource.getValue();
  }
  get formError():boolean{
    return this.errorForm;
  }
  set formError(val: boolean){
    this.errorForm = val;
  }
}
