import { Component, input, signal } from '@angular/core';
import { toObservable, outputFromObservable } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { distinctUntilChanged, skip, debounce, timer } from 'rxjs';

@Component({
  imports: [HlmInputGroupImports, HlmInputImports, NgIcon],
  selector: 'sigdosi-search-input',
  styles: ``,
  templateUrl: './search-input.html',
  providers: [provideIcons({ lucideSearch })],
})
export class SearchInput {
  public readonly placeholder = input('Buscar...');
  public readonly debounce = input(500);

  protected readonly value = signal('');

  protected readonly valueChange = outputFromObservable(
    toObservable(this.value).pipe(
      skip(1),
      debounce(() => timer(this.debounce())),
      distinctUntilChanged(),
    ),
  );
}
