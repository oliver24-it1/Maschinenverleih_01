import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const BETRIEBSNAME = 'Kettenhof NRW';

/** Setzt eindeutige Seitentitel (WCAG 2.4.2): „Seitenname – Kettenhof NRW“. */
@Injectable()
export class SeitentitelStrategie extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const seitentitel = this.buildTitle(snapshot);
    this.title.setTitle(seitentitel ? `${seitentitel} – ${BETRIEBSNAME}` : BETRIEBSNAME);
  }
}
