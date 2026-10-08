import {
  Directive,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  input,
  numberAttribute,
} from '@angular/core';

/**
 * Blendet ein Element beim Hineinscrollen weich ein.
 * `appReveal="2"` verzögert um 2 × 80 ms (Staggering innerhalb einer Gruppe).
 * Bei „Bewegung reduzieren“ sorgt das CSS dafür, dass Inhalte sofort sichtbar sind.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[style.--reveal-delay]': 'verzoegerung()',
  },
})
export class RevealDirective implements OnDestroy {
  /** Leeres Attribut (`appReveal`) ergibt Stufe 0. */
  readonly appReveal = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private beobachter?: IntersectionObserver;

  protected verzoegerung(): string {
    return `${this.appReveal() * 80}ms`;
  }

  constructor() {
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        this.element.classList.add('is-visible');
        return;
      }
      this.beobachter = new IntersectionObserver(
        (eintraege) => {
          for (const eintrag of eintraege) {
            if (eintrag.isIntersecting) {
              this.element.classList.add('is-visible');
              this.beobachter?.disconnect();
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
      );
      this.beobachter.observe(this.element);
    });
  }

  ngOnDestroy(): void {
    this.beobachter?.disconnect();
  }
}
