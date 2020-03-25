import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'purchaseType'})
export class PurchaseTypePipe implements PipeTransform {

    purchaseType: any = [

        'Member Card',
        'Uloan',
        'Invoice',
        'Other',
        'Letter of Agreement',
        'Cash Receipt',
];

  transform(value: number): any {
    const indexValue = value - 1;
    return this.purchaseType[indexValue];
  }

}
