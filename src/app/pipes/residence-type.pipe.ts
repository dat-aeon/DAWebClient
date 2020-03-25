import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'residenceType' })

export class ResidenceTypePipe implements PipeTransform {

residenceType = ['Owner','Parental','Rental','Relative','Hostel/Other'];
residance: string;

  transform(value: number, otherResidence: string): any {
    const indexValue = value - 1;

    if(indexValue === 5 && otherResidence !== '') {
      this.residance = otherResidence;
    } else {
      this.residance = this.residenceType[indexValue];
    }

    return this.residance;
  }

}
