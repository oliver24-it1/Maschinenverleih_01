import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nicht-gefunden-page',
  imports: [RouterLink],
  template: `
    <section class="container-page py-24 md:py-32">
      <p class="eyebrow">Fehler 404</p>
      <h1 class="mt-4 text-4xl font-black md:text-5xl">Diese Seite gibt es nicht.</h1>
      <p class="mt-4 max-w-xl text-lg text-chalk-muted">
        Die Adresse ist falsch geschrieben oder die Seite wurde verschoben.
      </p>
      <a routerLink="/" class="btn btn-primary btn-shimmer mt-10">Zur Startseite</a>
    </section>
  `,
})
export class NichtGefundenPage {}
