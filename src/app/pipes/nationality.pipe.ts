import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nationality'
})
export class NationalityPipe implements PipeTransform {

  transformData: any;

  transform(value: number, nationalityOther: any): any {
    if(value === 1) {
      this.transformData = 'Myanmar';
    }

    if(value === 2 && nationalityOther !== '') {
      this.transformData = nationalityOther;
    }

    return this.transformData;
  }

}
