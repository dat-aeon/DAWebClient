import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../cores/helper/data.service';

@Pipe({ name: 'education' })

export class EducationPipe implements PipeTransform {

education: any;
dataLists:any= ['High School', 'University', 'Graduated'];

  transform(value: number): any {
    const indexValue = value - 1;
    this.education = this.dataLists[indexValue];
    return this.education;
  }

}
    