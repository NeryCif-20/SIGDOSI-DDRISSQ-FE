import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../types/user-types';

@Pipe({
  name: 'fullName',
})
export class FullNamePipe implements PipeTransform {
  transform({ firstName, lastName }: User): string {
    return `${firstName} ${lastName}`;
  }
}
