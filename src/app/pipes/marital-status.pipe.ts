import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maritalStatus'})

export class MaritalStatusPipe implements PipeTransform {
marital: string;
  transform(value: number): any {
    if(value === 1) { this.marital = 'Single'; }
    if(value === 2) { this.marital = 'Married'; }
    return this.marital;
  }
}
