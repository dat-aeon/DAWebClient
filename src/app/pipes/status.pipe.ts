import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status'})

export class StatusPipe implements PipeTransform {

statusArray: any = [
	'ON PROCESS',						
  'ON PROCESS',						
	'ON PROCESS',						
	'ON PROCESS',							
  'ON PROCESS',				
  'ON PROCESS',				
  'ON PROCESS',						
	'CANCEL',				
	'UNSUCCESSFUL',				
	'APPROVE',			
	'APPROVE',				
	'APPROVE',					
  'APPROVE',						
  'APPROVE',					
  'APPROVE',					
  'APPROVE',					
  'COMPLETE',				
  'COMPLETE',								
  'COMPLETE',				
  'COMPLETE',
];

  transform(value: number): any {
    const indexValue = value - 1;
    return this.statusArray[indexValue];
  }
  
}
