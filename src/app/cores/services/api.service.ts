import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { config, BasicAuthHeader, JSONHeader } from '../configuration';

@Injectable({ providedIn: 'root'})

export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  registeration(data: any) {
    return this.http.post(config.api + '/customer-info-registration/register-new-customer', data , { headers: JSONHeader });
  }

  CheckAccountLock(data: any) {
    const body = {
    }
    return this.http.post(config.api + '/reset-password/check-account-lock', body, { headers: JSONHeader } );
  }

  confirmSecurityQuestionAnswer(data: any) {
    // const body = {
    //   phoneNo: data.phoneNo,
    //   nrcNo: data.nrcCode + '/' + data.nrcList + data.nrcType + data.nrcNo,
    //   securityQuestionAnswerReqDtoList: data.customerSecurityQuestionDtoList
    // }

    return this.http.post(config.api + '/reset-password/confirm-security-question-answer', data, { headers: JSONHeader});
  }

  townshipCodeList() {
    return this.http.get(config.api + '/information/township-code-list');
  }

  securityQuestion() {
    return this.http.get(config.api + '/reset-password/security-question-list');
  }
  checkMember(body:any){
    return this.http.post(config.api+'/customer-info-registration/check-registered-customer?',body,{ headers: JSONHeader } );
  }
}
