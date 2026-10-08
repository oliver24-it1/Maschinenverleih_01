import { Kundentyp } from '../../../models/kunde.model';

/** Zielfelder des Kunden-Imports (Tabellen `kunde` + Rechnungsadresse in `adresse`). */
export type ImportFeld =
  | 'kundennummer'
  | 'kundentyp'
  | 'firmenname'
  | 'vorname'
  | 'nachname'
  | 'email'
  | 'telefon'
  | 'ustIdnr'
  | 'strasse'
  | 'hausnummer'
  | 'adresszusatz'
  | 'plz'
  | 'ort'
  /* Sammelspalten, die beim Einlesen aufgeteilt werden */
  | 'strasseHausnummer'
  | 'plzOrt';

export type Rohdatensatz = Partial<Record<ImportFeld, string>>;

export interface KundenImportDatensatz {
  kundennummer: string;
  kundentyp: Kundentyp | null;
  firmenname: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  ustIdnr: string;
  strasse: string;
  hausnummer: string;
  adresszusatz: string;
  plz: string;
  ort: string;
}

export type Schwere = 'fehler' | 'warnung';

export interface Meldung {
  feld?: keyof KundenImportDatensatz;
  schwere: Schwere;
  text: string;
}

export type Zeilenstatus = 'ok' | 'warnung' | 'fehler';

export interface GepruefteZeile {
  /** Zeilennummer wie in Excel (1-basiert, inkl. Kopfzeile). */
  zeilennummer: number;
  daten: KundenImportDatensatz;
  meldungen: Meldung[];
  status: Zeilenstatus;
}

export interface Spaltenzuordnung {
  /** Spaltenindex → Zielfeld */
  felder: Map<number, ImportFeld>;
  erkannt: { spalte: string; feld: ImportFeld }[];
  ignoriert: string[];
  /** Pflichtspalten, die in der Datei komplett fehlen. */
  fehlendePflicht: ImportFeld[];
}

export interface ImportErgebnis {
  dateiname: string;
  tabellenblatt: string;
  zuordnung: Spaltenzuordnung;
  zeilen: GepruefteZeile[];
  zusammenfassung: Record<Zeilenstatus, number> & { gesamt: number };
}
