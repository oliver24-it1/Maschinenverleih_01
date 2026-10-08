import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { LucideFileSpreadsheet, LucideUpload } from '@lucide/angular';

let naechsteId = 0;

/**
 * Drag-and-Drop-Bereich mit echtem <input type="file"> als Basis:
 * per Maus (Ziehen/Klicken), Tastatur (Tab + Enter/Leertaste) und Screenreader bedienbar.
 */
@Component({
  selector: 'app-dropzone',
  imports: [LucideUpload, LucideFileSpreadsheet],
  templateUrl: './dropzone.html',
  host: { class: 'block' },
})
export class Dropzone {
  /** Für das `accept`-Attribut, z. B. „.xlsx,.xls,.csv“ */
  readonly akzeptiert = input.required<string>();
  readonly titel = input('Datei hier ablegen');
  readonly hinweis = input('');
  readonly gesperrt = input(false);

  readonly dateiGewaehlt = output<File>();

  protected readonly id = `dropzone-${naechsteId++}`;
  protected readonly ziehtDarueber = signal(false);

  private readonly eingabe = viewChild.required<ElementRef<HTMLInputElement>>('eingabe');
  /** dragenter/dragleave feuern auch für Kindelemente – Zähler verhindert Flackern. */
  private ziehZaehler = 0;

  protected beimZiehenRein(e: DragEvent): void {
    if (this.gesperrt() || !enthaeltDateien(e)) return;
    e.preventDefault();
    this.ziehZaehler++;
    this.ziehtDarueber.set(true);
  }

  protected beimZiehenUeber(e: DragEvent): void {
    if (this.gesperrt() || !enthaeltDateien(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  }

  protected beimZiehenRaus(): void {
    this.ziehZaehler = Math.max(0, this.ziehZaehler - 1);
    if (this.ziehZaehler === 0) this.ziehtDarueber.set(false);
  }

  protected beimAblegen(e: DragEvent): void {
    e.preventDefault();
    this.ziehZaehler = 0;
    this.ziehtDarueber.set(false);
    if (this.gesperrt()) return;
    const datei = e.dataTransfer?.files?.[0];
    if (datei) this.dateiGewaehlt.emit(datei);
  }

  protected beimAuswaehlen(): void {
    const feld = this.eingabe().nativeElement;
    const datei = feld.files?.[0];
    if (datei) this.dateiGewaehlt.emit(datei);
    // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann
    feld.value = '';
  }
}

function enthaeltDateien(e: DragEvent): boolean {
  return Array.from(e.dataTransfer?.types ?? []).includes('Files');
}
