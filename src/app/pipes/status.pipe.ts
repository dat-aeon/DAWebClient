import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status'})

export class StatusPipe implements PipeTransform {

statusArray: any = [
  'draft', 
  'new',
  'index',
  'upload finish',
  'document followup waiting',
  'document follow up applicant updated',
  'document follow up checked',
  'cancle',
  'reject',
  'approve',
  'purchase cancel',
  'purchase initial',
  'purchase confirm waiting',
  'purchase confirm',
  'purchase complete',
  'settlement upload finish',
  'settlement pending'
];

  transform(value: number): any {
    const indexValue = value - 1;
    return this.statusArray[indexValue];
  }
  
}
