import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'gender'})

export class GenderPipe implements PipeTransform {

gender: string;

  transform(value: number): any {
    if(value === 1) { this.gender = 'Male'; }
    if(value === 2) { this.gender = 'Female'; }
    return this.gender;
  }

}
