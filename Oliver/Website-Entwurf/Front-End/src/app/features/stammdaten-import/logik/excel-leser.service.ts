import { Injectable } from '@angular/core';

export const ERLAUBTE_ENDUNGEN = ['.xlsx', '.xls', '.csv'] as const;
export const MAX_DATEIGROESSE_BYTES = 5 * 1024 * 1024;
export const MAX_ZEILEN = 10_000;

export class ImportFehler extends Error {}

export interface GeleseneTabelle {
  tabellenblatt: string;
  /** Erste nicht-leere Zeile = Kopfzeile. */
  kopfzeile: string[];
  /** Datenzeilen mit ihrer Excel-Zeilennummer. */
  zeilen: { zellen: string[]; zeilennummer: number }[];
}

/**
 * Liest Excel-/CSV-Dateien vollständig im Browser.
 * Die Datei wird nicht hochgeladen (Datensparsamkeit, DSGVO) – erst die spätere
 * Übernahme sendet geprüfte Datensätze an die Supabase-API.
 */
@Injectable({ providedIn: 'root' })
export class ExcelLeserService {
  /** Prüft Typ und Größe vor dem Lesen. Liefert eine verständliche Fehlermeldung oder null. */
  pruefeDatei(datei: File): string | null {
    const name = datei.name.toLowerCase();
    if (!ERLAUBTE_ENDUNGEN.some((e) => name.endsWith(e))) {
      return `„${datei.name}“ ist keine Excel- oder CSV-Datei. Erlaubt sind ${ERLAUBTE_ENDUNGEN.join(', ')}.`;
    }
    if (datei.size === 0) return `„${datei.name}“ ist leer.`;
    if (datei.size > MAX_DATEIGROESSE_BYTES) {
      const mb = (datei.size / 1024 / 1024).toFixed(1).replace('.', ',');
      return `„${datei.name}“ ist ${mb} MB groß. Erlaubt sind höchstens 5 MB.`;
    }
    return null;
  }

  /** Liest die Datei mit echtem Fortschritt (0–1) über FileReader-Events. */
  leseBytes(datei: File, fortschritt: (anteil: number) => void): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const leser = new FileReader();
      leser.onprogress = (e) => {
        if (e.lengthComputable) fortschritt(e.loaded / e.total);
      };
      leser.onload = () => {
        fortschritt(1);
        resolve(leser.result as ArrayBuffer);
      };
      leser.onerror = () => reject(new ImportFehler('Die Datei konnte nicht gelesen werden.'));
      leser.readAsArrayBuffer(datei);
    });
  }

  async werteAus(dateiname: string, bytes: ArrayBuffer): Promise<GeleseneTabelle> {
    // SheetJS erst bei Bedarf laden – hält das Start-Bundle klein
    const XLSX = await import('xlsx');

    let mappe: import('xlsx').WorkBook;
    try {
      if (dateiname.toLowerCase().endsWith('.csv')) {
        // raw: Werte als Text belassen (PLZ „04109“, Telefonnummern)
        mappe = XLSX.read(dekodiereText(bytes), { type: 'string', raw: true, dense: true });
      } else {
        mappe = XLSX.read(bytes, { type: 'array', cellDates: true, dense: true });
      }
    } catch {
      throw new ImportFehler(
        'Die Datei ist beschädigt oder kein gültiges Excel-Format. Bitte in Excel öffnen und erneut speichern.',
      );
    }

    const tabellenblatt = mappe.SheetNames[0];
    if (!tabellenblatt) throw new ImportFehler('Die Datei enthält kein Tabellenblatt.');

    const matrix = XLSX.utils.sheet_to_json<unknown[]>(mappe.Sheets[tabellenblatt], {
      header: 1,
      raw: false, // formatierte Anzeige-Werte statt interner Zahlen
      defval: '',
      blankrows: true, // Leerzeilen behalten, damit Zeilennummern zu Excel passen
    });

    const kopfIndex = matrix.findIndex((z) => z.some((zelle) => String(zelle).trim() !== ''));
    if (kopfIndex === -1) throw new ImportFehler('Das erste Tabellenblatt ist leer.');

    const kopfzeile = matrix[kopfIndex].map((z) => String(z));
    const zeilen = matrix
      .slice(kopfIndex + 1)
      .map((zellen, i) => ({
        zellen: zellen.map((z) => String(z)),
        zeilennummer: kopfIndex + i + 2,
      }))
      .filter((z) => z.zellen.some((zelle) => zelle.trim() !== ''));

    if (zeilen.length === 0) {
      throw new ImportFehler('Unter der Kopfzeile wurden keine Datensätze gefunden.');
    }
    if (zeilen.length > MAX_ZEILEN) {
      throw new ImportFehler(
        `Die Datei enthält ${zeilen.length.toLocaleString('de-DE')} Zeilen. Bitte in Teilen mit höchstens ${MAX_ZEILEN.toLocaleString('de-DE')} Zeilen importieren.`,
      );
    }
    return { tabellenblatt, kopfzeile, zeilen };
  }
}

/** CSV aus Excel ist oft Windows-1252 statt UTF-8 kodiert – sonst werden Umlaute zerstört. */
export function dekodiereText(bytes: ArrayBuffer): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^\uFEFF/, '');
  } catch {
    return new TextDecoder('windows-1252').decode(bytes);
  }
}
