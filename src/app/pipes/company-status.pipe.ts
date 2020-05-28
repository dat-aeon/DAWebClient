import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'companyStatus' })

export class CompanyStatusPipe implements PipeTransform {

companyInfo: string;
companyStatus: any = [  
  'Public Company',
  'Factory',
   'Police' ,
   'Private Company' ,
  'SME Owner' ,
  'Government Office',
 'Taxi Owner' ,
    'Specialist' ,
   'SME Officer' ,
     'Military' ,
     'NGO' ,
     'Other' ,
];

  transform(value: number, companyStatusOther: string): any {
    const indexValue = value ;

    if(indexValue === 12 && companyStatusOther !== "") {
 
      this.companyInfo = companyStatusOther;
    } else {
      this.companyInfo = this.companyStatus[indexValue];
    }

    return this.companyInfo;
  }

}
