import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  TemplateRef,
  computed,
  contentChild,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  LucideArrowDown,
  LucideArrowUp,
  LucideArrowUpDown,
  LucideChevronLeft,
  LucideChevronRight,
} from '@lucide/angular';

export interface TabellenSpalte<T> {
  schluessel: string;
  titel: string;
  /** Ohne Sortierwert ist die Spalte nicht sortierbar. */
  sortierwert?: (zeile: T) => string | number;
  /** Zusätzliche Klassen für Kopf- und Datenzellen, z. B. Mindestbreite. */
  klasse?: string;
}

export interface ZellKontext<T> {
  $implicit: T;
  spalte: string;
}

type Richtung = 'ascending' | 'descending';

const vergleicher = new Intl.Collator('de', { numeric: true, sensitivity: 'base' });

let naechsteId = 0;

/**
 * Generische Datentabelle: Sortierung per Spaltenkopf, Seitenblättern, Zellen über
 * <ng-template #zelle let-zeile let-spalte="spalte"> frei gestaltbar.
 */
@Component({
  selector: 'app-data-table',
  imports: [
    NgTemplateOutlet,
    LucideArrowUp,
    LucideArrowDown,
    LucideArrowUpDown,
    LucideChevronLeft,
    LucideChevronRight,
  ],
  templateUrl: './data-table.html',
  host: { class: 'block' },
})
export class DataTable<T> {
  readonly spalten = input.required<readonly TabellenSpalte<T>[]>();
  readonly zeilen = input.required<readonly T[]>();
  /** Sichtbare Tabellenbeschriftung (caption) – Pflicht für Barrierefreiheit. */
  readonly beschriftung = input.required<string>();
  readonly zeilenProSeite = input(25);
  readonly zeilenSchluessel = input.required<(zeile: T) => string | number>();
  readonly leerText = input('Keine Einträge gefunden.');

  protected readonly zellVorlage = contentChild.required<TemplateRef<ZellKontext<T>>>('zelle');
  protected readonly id = `tabelle-${naechsteId++}`;

  protected readonly sortierung = signal<{ spalte: string; richtung: Richtung } | null>(null);

  protected readonly sortiert = computed(() => {
    const zeilen = this.zeilen();
    const s = this.sortierung();
    const spalte = s && this.spalten().find((sp) => sp.schluessel === s.spalte);
    if (!s || !spalte?.sortierwert) return zeilen;
    const wert = spalte.sortierwert;
    const faktor = s.richtung === 'ascending' ? 1 : -1;
    return [...zeilen].sort((a, b) => {
      const wa = wert(a);
      const wb = wert(b);
      const ergebnis =
        typeof wa === 'number' && typeof wb === 'number'
          ? wa - wb
          : vergleicher.compare(String(wa), String(wb));
      return ergebnis * faktor;
    });
  });

  /** Springt auf Seite 1 zurück, sobald sich die Daten (z. B. Filter) ändern. */
  protected readonly seite = linkedSignal({ source: this.zeilen, computation: () => 0 });

  protected readonly seitenAnzahl = computed(() =>
    Math.max(1, Math.ceil(this.zeilen().length / this.zeilenProSeite())),
  );

  protected readonly sichtbar = computed(() => {
    const start = this.seite() * this.zeilenProSeite();
    return this.sortiert().slice(start, start + this.zeilenProSeite());
  });

  protected readonly bereichText = computed(() => {
    const gesamt = this.zeilen().length;
    if (gesamt === 0) return 'Keine Zeilen';
    const start = this.seite() * this.zeilenProSeite() + 1;
    const ende = Math.min(gesamt, start + this.zeilenProSeite() - 1);
    return `Zeilen ${start}–${ende} von ${gesamt.toLocaleString('de-DE')}`;
  });

  protected sortiere(spalte: TabellenSpalte<T>): void {
    const aktuell = this.sortierung();
    if (aktuell?.spalte !== spalte.schluessel) {
      this.sortierung.set({ spalte: spalte.schluessel, richtung: 'ascending' });
    } else if (aktuell.richtung === 'ascending') {
      this.sortierung.set({ spalte: spalte.schluessel, richtung: 'descending' });
    } else {
      this.sortierung.set(null);
    }
    this.seite.set(0);
  }

  protected ariaSort(spalte: TabellenSpalte<T>): Richtung | 'none' | null {
    if (!spalte.sortierwert) return null;
    const s = this.sortierung();
    return s?.spalte === spalte.schluessel ? s.richtung : 'none';
  }

  protected blaettern(delta: number): void {
    this.seite.update((s) => Math.min(this.seitenAnzahl() - 1, Math.max(0, s + delta)));
  }
}
