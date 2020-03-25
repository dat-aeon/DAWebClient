import { NgModule } from '@angular/core';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CoresRoutingModule } from './cores-routing.module';
import { TemplateModule } from '../cores/template/template.module';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { TranslateCacheModule, TranslateCacheSettings, TranslateCacheService } from 'ngx-translate-cache';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CookieService } from 'ngx-cookie-service';

import { ModalComponent } from '../cores/helper/modal/modal.component';
import { RegistrationComponent } from '../registration/registration.component';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
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
import { SmallLoanComponent } from '../application/small-loan/small-loan.component';
import { LoanDetailComponent } from '../application/detail/loan-detail/loan-detail.component';
import { PurchaseDetailComponent } from '../application/purchase-detail/purchase-detail.component';
import { SecurityQuestionChangeComponent } from '../profile/security-question-change/security-question-change.component';
import { SecurityQuestionChangePreviewComponent } from '../profile/security-question-change-preview/security-question-change-preview.component';

import { NationalityPipe } from '../pipes/nationality.pipe';
import { GenderPipe } from '../pipes/gender.pipe';
import { MaritalStatusPipe } from '../pipes/marital-status.pipe';
import { ResidenceTypePipe } from '../pipes/residence-type.pipe';
import { LivingTypePipe } from '../pipes/living-type.pipe';
import { CompanyStatusPipe } from '../pipes/company-status.pipe';
import { StatusPipe } from '../pipes/status.pipe';
import { LoanTypePipe } from '../pipes/loan-type.pipe';
import { AttachementTypePipe } from '../pipes/attachement-type.pipe';
import { MaterialModule } from './material/material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ServiceNotFoundComponent } from './notification/service-not-found/service-not-found.component';
import { NgAutonumericModule } from '@angularfy/ng-autonumeric';
import { RelationshipPipe } from './pipes/relationship.pipe';
import { ApplicatonRegistrationFormComponent } from '../forms/applicaton-registration-form/applicaton-registration-form.component';
import { ApplicationOccupationFormComponent } from '../forms/application-occupation-form/application-occupation-form.component';
import { ApplicationemErgencyContactFormComponent } from '../forms/applicationem-ergency-contact-form/applicationem-ergency-contact-form.component';
import { ApplicationemguarantorFormmComponent } from '../forms/applicationemguarantor-formm/applicationemguarantor-formm.component';
import { ApplicationLoanFormComponent } from '../forms/application-loan-form/application-loan-form.component';
import { NewUserOccupationComponent } from '../new-user-application/new-user-occupation/new-user-occupation.component';
import { NewUserEmergencyComponent } from '../new-user-application/new-user-emergency/new-user-emergency.component';
import { NewUserGuarantorComponent } from '../new-user-application/new-user-guarantor/new-user-guarantor.component';
import { NewUserLoanComponent } from '../new-user-application/new-user-loan/new-user-loan.component';
import { NewUserComponent } from '../new-user-application/new-user/new-user.component';
import { MyAccountComponent } from '../new-user-application/my-account/my-account.component';
import { NumberDirective } from './helper/numbers-only.directive';
import { AttachmentEditComponent } from '../application/attachment-edit/attachment-edit.component';
import { PurchaseTypePipe } from '../pipes/purchase-type.pipe';

@NgModule({
  declarations: [
    RegistrationComponent,
    RegistrationConfigurationComponent,
    LoginComponent,
    DashboardComponent,
    SecurityQuestionComponent,
    ResetPasswordComponent,
    ResetQuestionsComponent,
    ProfileComponent,
    ProfileEditPreviewComponent,
    RegisterComponent,
    InqueryComponent,
    ModalComponent,
    PasswordComponent,
    ApplicationDataComponent,
    OccupationDetailComponent,
    EmergencyContactDetailComponent,
    GuarantorDetailComponent,
    SmallLoanComponent,
    PurchaseDetailComponent,
    LoanDetailComponent,
    SecurityQuestionChangeComponent,
    SecurityQuestionChangePreviewComponent,
    NationalityPipe,
    GenderPipe,
    MaritalStatusPipe,
    ResidenceTypePipe,
    LivingTypePipe,
    CompanyStatusPipe,
    StatusPipe,
    LoanTypePipe,
    AttachementTypePipe,
    PurchaseTypePipe,
    ServiceNotFoundComponent,
    ApplicatonRegistrationFormComponent,
    ApplicationOccupationFormComponent,
    ApplicationemErgencyContactFormComponent,
    ApplicationemguarantorFormmComponent,
    ApplicationLoanFormComponent,
    RelationshipPipe,
    NewUserOccupationComponent,
    NewUserEmergencyComponent,
    NewUserGuarantorComponent,
    NewUserLoanComponent,
    NewUserComponent,
    MyAccountComponent,
    NumberDirective,
    AttachmentEditComponent,


  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    CoresRoutingModule,
    TemplateModule,
    NgbDatepickerModule,
    NgxMaterialTimepickerModule,
    NgAutonumericModule,
    TranslateModule.forChild(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient]
      }
    }),
    TranslateCacheModule.forRoot({
      cacheService: {
        provide: TranslateCacheService,
        useFactory: (translateService: any, translateCacheSettings: any) => {
          return new TranslateCacheService(translateService, translateCacheSettings);
        },
        deps: [ TranslateService, TranslateCacheSettings ]
      },
      cacheName: 'mylang',
      cacheMechanism: 'Cookie',
      cookieExpiry: 1
    })
  ],
  exports: [ 
    TranslateModule,
    MyAccountComponent,
    SecurityQuestionComponent,
    ApplicatonRegistrationFormComponent,
    ApplicationemErgencyContactFormComponent,
    ApplicationemguarantorFormmComponent,
    ApplicationLoanFormComponent
  ],
  entryComponents: [
    ModalComponent,
    ServiceNotFoundComponent
  ],
  providers: [ CookieService ]
})

export class CoresModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}