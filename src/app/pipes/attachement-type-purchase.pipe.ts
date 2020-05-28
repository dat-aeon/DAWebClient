import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'attachementTypePurchase'})
export class AttachementTypePurchasePipe implements PipeTransform {

  attachementTypePurchase: any = [
   'Member Card',					
    'ULoan',				
    'Invoice',		
    'Other',
    'Agreement',	
    'Cash Receipt'
];

  transform(value: number): any {
    const indexValue = value - 1;
    return this.attachementTypePurchase[indexValue];
  }

}
