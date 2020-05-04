import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationFormService } from 'src/app/cores/services/application-form.service';
import { appForm } from 'src/app/cores/helper/app-form';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  isLinear = false;
  step: any = {};
  form: appForm;
  @ViewChild('stepper', { static: false }) stepper;

  constructor(
    private applicationFormService: ApplicationFormService
  ) {}

  getData($event: any) {
    if($event) {
      this.applicationFormService.applicationFormObject.subscribe((res: any) => {

        this.form = res;
  
      });

      this.applicationFormService.applicantCompanyInfoDto.subscribe((res: any)=> {
        
        this.form.applicantCompanyInfoDto = res;
  
      });

      this.applicationFormService.emergencyContactInfoDto.subscribe((res: any) => {
     
      
     
        this.form.emergencyContactInfoDto = res;
  
 
      });

      this.applicationFormService.guarantorInfoDto.subscribe((res: any) => {
 

        this.form.guarantorInfoDto = res;

  
      });
    
    }

    this.applicationFormService.finalData.next(this.form);

  }
    change(index:any){
  this.stepper.selectedIndex = index;

    }
  ngOnInit() {
  }
}
