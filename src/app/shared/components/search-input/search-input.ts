import { Component, input, linkedSignal } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { map, distinctUntilChanged, debounce, timer, of, skip } from 'rxjs';

@Component({
  imports: [HlmInputGroupImports, HlmInputImports, NgIcon],
  selector: 'sigdosi-search-input',
  styles: ``,
  templateUrl: './search-input.html',
  providers: [provideIcons({ lucideSearch, lucideX })],
})
export class SearchInput {
  public readonly placeholder = input('Buscar...');
  public readonly debounceMs = input(500);
  public readonly value = input<string>('');

  protected readonly searchTerm = linkedSignal(() => this.value());

  public readonly valueChange = outputFromObservable(
    toObservable(this.searchTerm).pipe(
      skip(1),
      map((value) => value.trim()),
      debounce((value) => (value ? timer(this.debounceMs()) : of(value))),
      distinctUntilChanged(),
    ),
  );
}
