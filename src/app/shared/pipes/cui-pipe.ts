import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cui',
})
export class CuiPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/^(\d{4})(\d{5})(\d{4})$/, '$1 $2 $3');
  }
}
