import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';

import {TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    MaterialModule
  ],
  exports: [
    NavigationComponent,
    FooterComponent
  ]
})

export class TemplateModule { }
