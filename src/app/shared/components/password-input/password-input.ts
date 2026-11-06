import { Component, computed, input, model, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { Autofocus } from '../../directives/autofocus';

@Component({
  imports: [HlmInputGroupImports, NgIcon, Autofocus],
  selector: 'sigdosi-password-input',
  styles: ``,
  templateUrl: './password-input.html',
  providers: [provideIcons({ lucideEye, lucideEyeOff })],
})
export class PasswordInput {
  public readonly inputId = input<string>();
  public readonly placeholder = input<string>();
  public readonly autocomplete = input<string>();
  public readonly sigdosiAutofocus = input<boolean | string>(false);
  public readonly disabled = input<boolean>(false);
  public readonly readonly = input<boolean>(false);

  public readonly touch = output<boolean>();

  public readonly value = model<string>('');

  protected readonly _inputType = signal<'text' | 'password'>('password');
  protected readonly _icon = computed(() =>
    this._inputType() === 'password' ? 'lucideEye' : 'lucideEyeOff',
  );

  public toggleVisibility() {
    this._inputType.update((current) => (current === 'password' ? 'text' : 'password'));
  }
}
