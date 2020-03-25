import { NgModule } from '@angular/core';
import { AuthGuard } from '../cores/guard/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RegistrationComponent } from '../registration/registration.component';
import { SecurityQuestionComponent } from '../registration/security-question/security-question.component';
import { ResetPasswordComponent } from '../login/reset-password/reset-password.component';
import { ResetQuestionsComponent } from '../login/reset-questions/reset-questions.component';
import { RegistrationConfigurationComponent } from '../registration/registration-configuration/registration-configuration.component';
import { ProfileComponent } from '../profile/profile.component';
import { ProfileEditPreviewComponent } from '../profile/profile-edit-preview/profile-edit-preview.component';
import { RegisterComponent } from '../application/register/register.component';
import { InqueryComponent } from '../application/inquery/inquery.component';
import { PasswordComponent } from '../profile/password/password.component';
import { ApplicationDataComponent } from '../application/detail/application-data/application-data.component';
import { OccupationDetailComponent } from '../application/detail/occupation-detail/occupation-detail.component';
import { EmergencyContactDetailComponent } from '../application/detail/emergency-contact-detail/emergency-contact-detail.component';
import { GuarantorDetailComponent } from '../application/detail/guarantor-detail/guarantor-detail.component';
import { LoanDetailComponent } from '../application/detail/loan-detail/loan-detail.component';
import { PurchaseDetailComponent } from '../application/purchase-detail/purchase-detail.component';
import { SecurityQuestionChangeComponent } from '../profile/security-question-change/security-question-change.component';
import { SecurityQuestionChangePreviewComponent } from '../profile/security-question-change-preview/security-question-change-preview.component';
import { NewUserComponent } from '../new-user-application/new-user/new-user.component';
import { NewUserOccupationComponent } from '../new-user-application/new-user-occupation/new-user-occupation.component';
import { NewUserEmergencyComponent } from '../new-user-application/new-user-emergency/new-user-emergency.component';
import { NewUserGuarantorComponent } from '../new-user-application/new-user-guarantor/new-user-guarantor.component';
import { NewUserLoanComponent } from '../new-user-application/new-user-loan/new-user-loan.component';
import { MyAccountComponent } from '../new-user-application/my-account/my-account.component';
import { AttachmentEditComponent } from '../application/attachment-edit/attachment-edit.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],  data:{ title: 'Home'} },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'security-questions-change', component: SecurityQuestionChangeComponent, canActivate: [AuthGuard] },
  { path: 'security-question-change-preview', component: SecurityQuestionChangePreviewComponent, canActivate: [AuthGuard] },
  { path: 'profile-edit-preview', component: ProfileEditPreviewComponent, canActivate: [AuthGuard] },
  { path: 'application', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'inquery', component: InqueryComponent, canActivate: [AuthGuard], data:{ title: 'Inquery' } },
  { path: 'password', component: PasswordComponent, canActivate: [AuthGuard] },
  { path: 'application-detail', component: ApplicationDataComponent, canActivate: [AuthGuard] },
  { path: 'occupation-detail', component: OccupationDetailComponent, canActivate: [AuthGuard] },
  { path: 'emergency-contact-detail', component: EmergencyContactDetailComponent, canActivate: [AuthGuard] },
  { path: 'guarantor-detail', component: GuarantorDetailComponent, canActivate: [AuthGuard] },
  { path: 'loan-detail', component: LoanDetailComponent, canActivate: [AuthGuard], data: { title: 'Application Inqueries Detail' }},
  { path: 'purchase-detail', component: PurchaseDetailComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, data: {title: 'Digital Application'} },
  { path: 'registration', component: RegistrationComponent, data: { title: 'Registration'} },
  { path: 'security-question', component: SecurityQuestionComponent, data:{ title: 'Security Questions'} },
  { path: 'registration-configuration', component: RegistrationConfigurationComponent, data: { title: 'Congratulation' } },
  { path: 'reset-password', component: ResetPasswordComponent, data: {title: 'Reset Password'} },
  { path: 'reset-questions', component: ResetQuestionsComponent },
  { path: 'new-user', component: NewUserComponent, data: { title: 'New User'} },
  { path: 'new-user-occupation', component: NewUserOccupationComponent, data: { title: 'New User Occupation'} },
  { path: 'new-user-emergency', component: NewUserEmergencyComponent, data: { title: 'New User Emergency'} },
  { path: 'new-user-guarantor', component: NewUserGuarantorComponent, data: { title: 'New User Guarantor'} },
  { path: 'new-user-loan', component: NewUserLoanComponent, data: { title: 'New User Loan'} },
  { path: 'my-account', component: MyAccountComponent, data: { title: 'My Account'} },
  { path: 'attachment-edit',component:AttachmentEditComponent,canActivate: [AuthGuard], data:{title:'Attachment Edit'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CoresRoutingModule { }
