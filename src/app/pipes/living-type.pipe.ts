import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'livingType' })

export class LivingTypePipe implements PipeTransform {

living: string;
livingWith: any = ['Parent', 'Spouse', 'Relative', 'Friend', 'Alone'];

  transform(value: number): any {
    const indexValue = value - 1;
    this.living = this.livingWith[indexValue];
    return this.living;
  }

}
