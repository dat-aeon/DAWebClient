import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'companyStatus' })

export class CompanyStatusPipe implements PipeTransform {

companyInfo: string;
companyStatus: any = [
  'Trading',
  'Factory & Garment & Manucature',
  'Construction',
  'Engineering',
  'Insurance, Service & Agency',
  'Mobile & Electronic',
  'Transportation',
  'Media & Entertainment',
  'Supermarket & Convenience Store',
  'Security Service',
  'Communication',
  'Manufacturing & Distribution',
  'Government',
  'Military',
  'Police',
  'Hotel & Restaurant',
  'Travels and Tours',
  'Hospital & Clinic',
  'Private School',
  'Microfinance',
  'Aeon Orange',
  'NGO',
  'Bank',
  'Fire station',
  'Other'
];

  transform(value: number, companyStatusOther: string): any {
    const indexValue = value - 1;

    if(indexValue === 24 && companyStatusOther !== "") {
      this.companyInfo = companyStatusOther;
    } else {
      this.companyInfo = this.companyStatus[indexValue];
    }

    return this.companyInfo;
  }

}
