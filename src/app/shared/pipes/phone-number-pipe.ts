import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber',
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value?: string | null): string {
    if (value == null || value === undefined || value === '') {
      return 'No registrado';
    }
    const phone = String(value).replace(/\D/g, '');
    return phone.replace(/^(\d{4})(\d{4})$/, '$1-$2');
  }
}
