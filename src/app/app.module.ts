
import { CoresModule } from './cores/cores.module';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CoresRoutingModule } from './cores/cores-routing.module';
import { TemplateModule } from './cores/template/template.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule} from './cores/material/material.module';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';

import { NativeDateAdapter,DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { formatDate } from '@angular/common';

export const PICK_FORMATS = {

  parse: {
    dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
},
display: {

    dateInput: 'input',
    monthYearLabel: {year: 'numeric', month: 'short'},
    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric', month: 'long'},
}
};

export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'yyyy-MM-dd',this.locale);;
      } else {
          return date.toDateString();
      }
  }};

@NgModule({
  declarations: [ AppComponent, ConfirmPasswordComponent],
  imports: [
    MaterialModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoresModule,
    CoresRoutingModule,
    TemplateModule,
    LoadingBarRouterModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    Title
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
