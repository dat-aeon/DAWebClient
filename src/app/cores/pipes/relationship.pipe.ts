import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relationship' })

export class RelationshipPipe implements PipeTransform {

  relationship: string;
  relationshipWith: any = ['Parent', 'Spouse', 'Relative', 'Friend', 'Other'];

  transform(value: number): any {
    const indexValue = value - 1;
    this.relationship = this.relationshipWith[indexValue];
    return this.relationship;
  }

}
