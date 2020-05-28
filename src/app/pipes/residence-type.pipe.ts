import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'residenceType' })

export class ResidenceTypePipe implements PipeTransform {

residenceType = ['Owner','Parental','Rental','Relative','Hostel/Other'];
residance: string;

  transform(value: number): any {
    const indexValue = value - 1;

      this.residance = this.residenceType[indexValue];


    return this.residance;
  }

}
