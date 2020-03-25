import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/cores/services/auth.service';
import { languageValidator } from '../../cores/helper/validators';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})

export class PasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  submitted: boolean = false;
  currentUser: any = {};
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { 

    this.authService.currentUser.subscribe( (res: any) => {
      this.currentUser = res.data;
    });
  }

  get f() { return this.resetPasswordForm.controls; }

  private changePassword() {
    this.loading = true;

    const requestObject = {
      customerId: this.currentUser.userInformationResDto.customerId,
      oldPassword: this.f.oldPwd.value,
      newPassword: this.f.newPwd.value,
      confirmNewPassword: this.f.confirmPwd.value
    };

    this.authService.changePassword(this.currentUser.access_token, requestObject).subscribe((res: any) => {
        if(res.status === 'SUCCESS' && res.data === null) {
          localStorage.removeItem('user_info');
          location.reload();
        }
      });
  }

  private resetPasswordFormBuilder() {
    this.resetPasswordForm = this.fb.group({
      oldPwd: ['', [Validators.required, languageValidator, Validators.minLength(6)]],
      newPwd: ['', [Validators.required, languageValidator, Validators.minLength(6)]],
      confirmPwd: ['', [Validators.required, languageValidator, Validators.minLength(6)]]
    });
  }

  errorHandling = (control: string, error: string) => {
    return this.resetPasswordForm.controls[control].hasError(error);
  }

  ngOnInit() {
    this.authService.refreshToken();
    this.resetPasswordFormBuilder();
  } 

  onSubmit() {
    this.loading = true;
    if (this.resetPasswordForm.invalid) { 
      this.loading = false;
      return; 
    }

    if(this.f.newPwd.value !== this.f.confirmPwd.value) {
      this.f.newPwd.setErrors({ passwordMatch: true });
      this.loading = false;
      return;
    }

    if(this.f.oldPwd.value !== this.currentUser.password) {
      this.f.oldPwd.setErrors({ incorrectCurrentPassword: true });
      this.loading = false;
      return;
    }

    this.changePassword();
  }

}
