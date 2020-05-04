import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { config, BasicAuthHeader, JSONHeader } from '../configuration';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material';

import { ServiceNotFoundComponent } from '../notification/service-not-found/service-not-found.component';

@Injectable({ providedIn: 'root'})

export class AuthService {

  public currentUserObject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public userinfo: any = {};

  constructor(
    private http: HttpClient,
    private snackBarCtrl: MatSnackBar
    ) {

    this.currentUserObject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user_info')));
    this.currentUser = this.currentUserObject.asObservable();

  }

  private basicAuthHeader() {
    let httpHeader: any = {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(environment.apiKey + ':' + environment.apiKey)
    }

    return httpHeader;
  }

  private openSnackBar() {
    this.snackBarCtrl.openFromComponent( ServiceNotFoundComponent, { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center' });
  }

  public get currentUserValue(): User { return this.currentUserObject.value; }

  // public loginFromService(data: any) {

  //   const body = new HttpParams().set('username', data.username).set('password', data.password) .set('grant_type', 'password');

  //   return this.http.post (config.api + '/oauth/token', body, { headers: BasicAuthHeader }).pipe(
  //     map( (user: any) => {

  //       if(user.status === 'FAILED') {
  //         return { loginFail: true };
  //       }

  //       if(user.status === 'SUCCESS') {
  //         user.currentUser = true;
  //         user.data.password = data.password;
  //         localStorage.setItem('user_info', JSON.stringify(user));
  //         this.currentUserObject.next(user);
  //         return user;
  //       }
  //     }));
  // }

  public loginFromService(data: any): Observable<any> {

    const body = new HttpParams().set('username', data.username).set('password', data.password) .set('grant_type', 'password');

    return this.http.post (config.api + '/oauth/token', body, { headers: this.basicAuthHeader() }).pipe(
      map((response: any) => {

        if(response) {
          return response;
        }

      },(serverError: any) => {

        if(serverError) {
          this.openSnackBar();
          return { responseMessage: 'Service Not Found' }
        }

      })
    );
  }

  isLoggedIn() {
    return localStorage.getItem('access_token') !== null;
  }

  logout() {
    localStorage.removeItem('user_info');
    this.currentUserObject.next(null);
    location.reload();
  }

  getUserInformation(access_token: any, phone: any) {
   return this.http.post(config.api + '/customer-info-manage/get-user-information?access_token=' + access_token, { phoneNo: phone } , { headers: JSONHeader});
  }

  getCustomerSecurityQuestionList(access_token: any, id: any) {
    return this.http.post(config.api + '/customer-info-manage/get-customer-security-question-list?access_token=' + access_token, {customerId: id }, { headers : JSONHeader });
  }

  updateCustomerProfile(access_token: any, body: any) {
    return this.http.post(config.api + '/customer-info-manage/update-customer-profile?access_token=' + access_token, body, { headers: JSONHeader });
  }

  getCustomerInfoEditReq(access_token: any, body: any) {
    return this.http.post(config.api + '/customer-info-manage/get-customer-info-edit-req?access_token=' + access_token, { customerId: body }, { headers: JSONHeader });
  }

  checkPasswordForRegistration(data: any) {
    const body = new HttpParams().set('username', data.username).set('password', data.password).set('grant_type', 'password');
    return this.http.post(config.api + '/oauth/token', body, {headers: BasicAuthHeader });
  }

  checkAccountLock(body: any) {
    return this.http.post(config.api + '/reset-password/check-account-lock', body, { headers: JSONHeader });
  }

  confirmSecurityQuestionAnswer(access_token: any, body: any) {
    return this.http.post(config.api + '/reset-password/confirm-security-question-answer?access_token=' + access_token, body, { headers: JSONHeader });
  }

 changePassword(access_token: string, body: any) {
   return this.http.post(config.api + '/customer-info-manage/change-password?access_token=' + access_token, body, { headers: JSONHeader });
 }

 resetPassword(body: any) {
   return this.http.post(config.api + '/reset-password/reset-password', body);
 }

 refreshToken() {
  if(localStorage.getItem('user_info')) {
    this.userinfo = JSON.parse(localStorage.getItem('user_info'));
    this.getUserInformation(this.userinfo.data.access_token, this.userinfo.data.userInformationResDto.phoneNo).subscribe(
      (res: any) => {
      },

      (error: any) => {
        if(error.status === 401) {
          localStorage.removeItem('user_info');
          location.reload();
        }

      }
    );
  }
}


  // refreshToken() {
  //   if(localStorage.getItem('user_info')) {
  //     this.userinfo = JSON.parse(localStorage.getItem('user_info'));
  //     this.getUserInformation(this.userinfo.data.access_token, this.userinfo.data.userInformationResDto.phoneNo).subscribe(
  //       (res: any) => {
  //       },

  //       (error: any) => {
  //         if(error.status === 401) {
  //           const requestObject = new HttpParams().set('grant_type', 'refresh_token').set('refresh_token', this.userinfo.data.refresh_token);
  //           this.http.post(config.api + '/oauth/token', requestObject, { headers: BasicAuthHeader }).subscribe(
  //             (res: any) => {
  //               this.userinfo.data.refresh_token = res.data.refresh_token;
  //               this.userinfo.data.access_token = res.data.access_token;
  //               localStorage.setItem('user_info', JSON.stringify(this.userinfo));
  //               location.reload();
  //             });
  //         }

  //       }
  //     );
  //   }
  // }
}
