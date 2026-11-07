import { inject, Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

interface BreadcrumbItem {
  label: string;
  url: string;
}

@Service({ autoProvided: false })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly items = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildItems()),
    ),
    {
      requireSync: true,
    },
  );

  private buildItems(): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [];
    let route = this.activatedRoute.root.firstChild;
    let url = '';
    while (route) {
      const segment = route.snapshot.url.map((part) => part.path).join('/');
      if (segment) {
        url += `/${segment}`;
      }
      const label = route.snapshot.title;
      if (label) {
        items.push({
          label,
          url,
        });
      }
      route = route.firstChild;
    }
    return items;
  }
}
