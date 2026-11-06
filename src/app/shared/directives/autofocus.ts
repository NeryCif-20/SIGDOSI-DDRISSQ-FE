import { afterNextRender, Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: 'input[sigdosiAutofocus]',
})
export class Autofocus {
  private input = inject(ElementRef<HTMLInputElement>);

  public activate = input<boolean | string>(true, { alias: 'sigdosiAutofocus' });

  constructor() {
    afterNextRender({
      write: () => {
        if (this.activate() || this.activate() === '') {
          this.input.nativeElement.focus();
        }
      },
    });
  }
}
