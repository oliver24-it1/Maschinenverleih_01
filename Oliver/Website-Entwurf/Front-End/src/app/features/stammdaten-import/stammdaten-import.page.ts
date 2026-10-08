import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import {
  LucideCircleAlert,
  LucideCircleCheck,
  LucideDatabase,
  LucideDownload,
  LucideFileSpreadsheet,
  LucideInfo,
  LucideLock,
  LucideRotateCcw,
  LucideSearch,
  LucideTriangleAlert,
} from '@lucide/angular';

import { DataTable, TabellenSpalte } from '../../shared/ui/data-table/data-table';
import { Dropzone } from '../../shared/ui/dropzone/dropzone';
import { RevealDirective } from '../../shared/ui/reveal.directive';
import { ERLAUBTE_ENDUNGEN, ExcelLeserService, ImportFehler } from './logik/excel-leser.service';
import {
  GepruefteZeile,
  ImportErgebnis,
  ImportFeld,
  Zeilenstatus,
} from './logik/kunden-import.model';
import { pruefeAlleZeilen } from './logik/kunden-validierung';
import { ordneSpaltenZu, zeileZuRohdatensatz } from './logik/spalten-zuordnung';
import { erzeugeVorlageCsv, ladeHerunter } from './logik/vorlage';

type Phase = 'bereit' | 'lesen' | 'auswerten' | 'fertig' | 'fehler';
type StatusFilter = 'alle' | Zeilenstatus;

/** Mindestdauer der Ladeanzeige, damit das Feedback wahrnehmbar ist und nicht flackert. */
const MIN_LADEZEIT_MS = 600;

const FELDNAMEN: Record<ImportFeld, string> = {
  kundennummer: 'Kundennummer',
  kundentyp: 'Kundentyp',
  firmenname: 'Firmenname',
  vorname: 'Vorname',
  nachname: 'Nachname',
  email: 'E-Mail',
  telefon: 'Telefon',
  ustIdnr: 'USt-IdNr.',
  strasse: 'Straße',
  hausnummer: 'Hausnummer',
  adresszusatz: 'Adresszusatz',
  plz: 'PLZ',
  ort: 'Ort',
  strasseHausnummer: 'Straße + Hausnummer',
  plzOrt: 'PLZ + Ort',
};

@Component({
  selector: 'app-stammdaten-import-page',
  imports: [
    Dropzone,
    DataTable,
    RevealDirective,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideDatabase,
    LucideDownload,
    LucideFileSpreadsheet,
    LucideInfo,
    LucideLock,
    LucideRotateCcw,
    LucideSearch,
    LucideTriangleAlert,
  ],
  templateUrl: './stammdaten-import.page.html',
})
export class StammdatenImportPage {
  private readonly leser = inject(ExcelLeserService);
  private readonly injector = inject(Injector);

  protected readonly akzeptiert = [
    ...ERLAUBTE_ENDUNGEN,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ].join(',');
  protected readonly feldnamen = FELDNAMEN;

  protected readonly phase = signal<Phase>('bereit');
  protected readonly dateiname = signal('');
  protected readonly fortschritt = signal(0);
  protected readonly fehlermeldung = signal('');
  protected readonly ergebnis = signal<ImportErgebnis | null>(null);

  protected readonly suchbegriff = signal('');
  protected readonly statusFilter = signal<StatusFilter>('alle');

  private readonly ergebnisUeberschrift =
    viewChild<ElementRef<HTMLElement>>('ergebnisUeberschrift');
  private readonly fehlerBox = viewChild<ElementRef<HTMLElement>>('fehlerBox');

  protected readonly beschaeftigt = computed(() => ['lesen', 'auswerten'].includes(this.phase()));

  protected readonly gefilterteZeilen = computed(() => {
    const zeilen = this.ergebnis()?.zeilen ?? [];
    const status = this.statusFilter();
    const begriff = this.suchbegriff().trim().toLowerCase();
    return zeilen.filter(
      (z) =>
        (status === 'alle' || z.status === status) &&
        (!begriff ||
          Object.values(z.daten).some((w) =>
            String(w ?? '')
              .toLowerCase()
              .includes(begriff),
          )),
    );
  });

  protected readonly statusOptionen = computed(() => {
    const z = this.ergebnis()?.zusammenfassung;
    return [
      { wert: 'alle', text: 'Alle', anzahl: z?.gesamt ?? 0 },
      { wert: 'fehler', text: 'Fehler', anzahl: z?.fehler ?? 0 },
      { wert: 'warnung', text: 'Warnungen', anzahl: z?.warnung ?? 0 },
      { wert: 'ok', text: 'Fehlerfrei', anzahl: z?.ok ?? 0 },
    ] satisfies { wert: StatusFilter; text: string; anzahl: number }[];
  });

  protected readonly spalten: TabellenSpalte<GepruefteZeile>[] = [
    { schluessel: 'zeile', titel: 'Zeile', sortierwert: (z) => z.zeilennummer, klasse: 'w-20' },
    { schluessel: 'status', titel: 'Status', sortierwert: (z) => statusRang(z.status) },
    { schluessel: 'kundennummer', titel: 'Kundennr.', sortierwert: (z) => z.daten.kundennummer },
    {
      schluessel: 'name',
      titel: 'Name / Firma',
      sortierwert: (z) => anzeigename(z),
      klasse: 'min-w-48',
    },
    { schluessel: 'email', titel: 'E-Mail', sortierwert: (z) => z.daten.email, klasse: 'min-w-60' },
    { schluessel: 'telefon', titel: 'Telefon' },
    {
      schluessel: 'anschrift',
      titel: 'Anschrift',
      sortierwert: (z) => z.daten.plz,
      klasse: 'min-w-52',
    },
    { schluessel: 'hinweise', titel: 'Hinweise', klasse: 'min-w-72' },
  ];

  protected readonly zeilenSchluessel = (z: GepruefteZeile) => z.zeilennummer;
  protected readonly anzeigename = anzeigename;

  protected async verarbeite(datei: File): Promise<void> {
    if (this.beschaeftigt()) return;

    this.ergebnis.set(null);
    this.fehlermeldung.set('');
    this.suchbegriff.set('');
    this.statusFilter.set('alle');
    this.dateiname.set(datei.name);

    const problem = this.leser.pruefeDatei(datei);
    if (problem) return this.zeigeFehler(problem);

    const start = performance.now();
    try {
      this.phase.set('lesen');
      this.fortschritt.set(0);
      const bytes = await this.leser.leseBytes(datei, (a) => this.fortschritt.set(a));

      this.phase.set('auswerten');
      const tabelle = await this.leser.werteAus(datei.name, bytes);
      const zuordnung = ordneSpaltenZu(tabelle.kopfzeile);
      const zeilen = pruefeAlleZeilen(
        tabelle.zeilen.map((z) => ({
          roh: zeileZuRohdatensatz(z.zellen, zuordnung),
          zeilennummer: z.zeilennummer,
        })),
      );

      const rest = MIN_LADEZEIT_MS - (performance.now() - start);
      if (rest > 0) await new Promise((r) => setTimeout(r, rest));

      this.ergebnis.set({
        dateiname: datei.name,
        tabellenblatt: tabelle.tabellenblatt,
        zuordnung,
        zeilen,
        zusammenfassung: {
          gesamt: zeilen.length,
          ok: zeilen.filter((z) => z.status === 'ok').length,
          warnung: zeilen.filter((z) => z.status === 'warnung').length,
          fehler: zeilen.filter((z) => z.status === 'fehler').length,
        },
      });
      this.phase.set('fertig');
      this.fokussiereNachRender(this.ergebnisUeberschrift);
    } catch (e) {
      this.zeigeFehler(
        e instanceof ImportFehler ? e.message : 'Unerwarteter Fehler beim Einlesen der Datei.',
      );
    }
  }

  protected zuruecksetzen(): void {
    this.phase.set('bereit');
    this.ergebnis.set(null);
    this.fehlermeldung.set('');
    this.dateiname.set('');
  }

  protected vorlageHerunterladen(): void {
    ladeHerunter(erzeugeVorlageCsv(), 'kettenhof-vorlage-kunden.csv');
  }

  protected setzeStatusFilter(wert: StatusFilter): void {
    this.statusFilter.set(wert);
  }

  private zeigeFehler(text: string): void {
    this.fehlermeldung.set(text);
    this.phase.set('fehler');
    this.fokussiereNachRender(this.fehlerBox);
  }

  private fokussiereNachRender(ziel: () => ElementRef<HTMLElement> | undefined): void {
    afterNextRender(() => ziel()?.nativeElement.focus(), { injector: this.injector });
  }
}

function anzeigename(z: GepruefteZeile): string {
  const d = z.daten;
  if (d.kundentyp === 'unternehmen' && d.firmenname) return d.firmenname;
  return [d.vorname, d.nachname].filter(Boolean).join(' ') || d.firmenname;
}

function statusRang(s: Zeilenstatus): number {
  return { fehler: 0, warnung: 1, ok: 2 }[s];
}
