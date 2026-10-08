import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';

import { SiteFooter } from './core/layout/site-footer/site-footer';
import { SiteHeader } from './core/layout/site-header/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: './app.html',
})
export class App {
  private readonly injector = inject(Injector);
  private readonly hauptbereich = viewChild.required<ElementRef<HTMLElement>>('hauptbereich');

  constructor() {
    // Nach einem Seitenwechsel den Fokus auf die neue Hauptüberschrift setzen,
    // damit Screenreader- und Tastaturnutzer nicht im Menü „hängen bleiben“.
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((e) => {
        if (e.urlAfterRedirects.includes('#')) return; // Ankersprung: Browser übernimmt
        afterNextRender(() => this.fokussiereHauptueberschrift(), { injector: this.injector });
      });
  }

  private fokussiereHauptueberschrift(): void {
    const main = this.hauptbereich().nativeElement;
    const ziel = main.querySelector<HTMLElement>('h1') ?? main;
    ziel.setAttribute('tabindex', '-1');
    ziel.focus({ preventScroll: true });
  }
}
