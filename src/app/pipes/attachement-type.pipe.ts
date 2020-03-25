import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'attachementType'})
export class AttachementTypePipe implements PipeTransform {

attachementType: any = [
  'NRC Front', 
  'NRC Back', 
  'Resident Proof Attachment', 
  'Income Proof Attachment', 
  'Guarantor NRC Front', 
  'Guarantor NRC Back', 
  'Household or Criminal Clearance',
  "Applicant's Photo", 
  'Customer Signature',
  'Other',
  'Guarantor Signature'
];

  transform(value: number): any {
    const indexValue = value - 1;
    return this.attachementType[indexValue];
  }

}
