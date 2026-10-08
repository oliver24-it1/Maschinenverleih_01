import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideClock, LucideMenu, LucideX } from '@lucide/angular';
import { filter } from 'rxjs';

import { HAUPTNAVIGATION, SLOGAN } from '../../navigation';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, LucideMenu, LucideX, LucideClock],
  templateUrl: './site-header.html',
  host: {
    class: 'sticky top-0 z-40 block',
    '(document:keydown.escape)': 'schliesseMenueMitFokus()',
  },
})
export class SiteHeader {
  protected readonly navigation = HAUPTNAVIGATION;
  protected readonly slogan = SLOGAN;
  protected readonly menueOffen = signal(false);

  private readonly menueKnopf = viewChild.required<ElementRef<HTMLButtonElement>>('menueKnopf');

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menueOffen.set(false));
  }

  protected umschalten(): void {
    this.menueOffen.update((offen) => !offen);
  }

  protected schliesseMenueMitFokus(): void {
    if (!this.menueOffen()) return;
    this.menueOffen.set(false);
    this.menueKnopf().nativeElement.focus();
  }
}
