import { ImportFeld, Rohdatensatz, Spaltenzuordnung } from './kunden-import.model';

/**
 * Bekannte Spaltenüberschriften aus Excel-Listen je Zielfeld.
 * Annahme: Das Altsystem nutzt übliche deutsche Bezeichnungen. Die Liste ist bewusst
 * tolerant und kann ergänzt werden, sobald die echte Kundenliste vorliegt.
 */
const ALIASE: Record<ImportFeld, string[]> = {
  // Mehrdeutige Kürzel wie „Nr“ oder „Kunde“ werden bewusst nicht zugeordnet.
  kundennummer: ['kundennummer', 'kundennr', 'kdnr', 'kdnummer', 'kundenid'],
  kundentyp: ['kundentyp', 'typ', 'kundenart', 'art', 'kundengruppe'],
  firmenname: ['firmenname', 'firma', 'unternehmen', 'betrieb', 'firmenbezeichnung'],
  vorname: ['vorname', 'vname'],
  nachname: ['nachname', 'name', 'familienname', 'zuname'],
  email: ['email', 'emailadresse', 'mail', 'emailaddress'],
  telefon: ['telefon', 'tel', 'telefonnummer', 'telnr', 'fon', 'phone', 'mobil', 'handy'],
  ustIdnr: [
    'ustidnr',
    'ustid',
    'ustidnummer',
    'umsatzsteuerid',
    'umsatzsteueridentifikationsnummer',
    'vatid',
  ],
  strasse: ['strasse', 'str'],
  hausnummer: ['hausnummer', 'hausnr', 'hnr'],
  adresszusatz: ['adresszusatz', 'zusatz', 'co', 'adressezusatz'],
  plz: ['plz', 'postleitzahl'],
  ort: ['ort', 'stadt', 'wohnort', 'gemeinde'],
  strasseHausnummer: [
    'strasseundhausnummer',
    'strassehausnummer',
    'strassenr',
    'anschrift',
    'adresse',
  ],
  plzOrt: ['plzort', 'plzundort'],
};

/** Ohne diese Spalten kann kein Datensatz gültig sein. */
const PFLICHTSPALTEN: ImportFeld[] = ['kundennummer', 'email'];

/** Vereinheitlicht Überschriften: „E-Mail-Adresse“ → „emailadresse“, „Straße“ → „strasse“. */
export function normalisiereUeberschrift(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
}

const ALIAS_NACH_FELD = new Map<string, ImportFeld>(
  (Object.entries(ALIASE) as [ImportFeld, string[]][]).flatMap(([feld, aliase]) =>
    aliase.map((a) => [normalisiereUeberschrift(a), feld] as const),
  ),
);

export function ordneSpaltenZu(kopfzeile: readonly string[]): Spaltenzuordnung {
  const felder = new Map<number, ImportFeld>();
  const erkannt: Spaltenzuordnung['erkannt'] = [];
  const ignoriert: string[] = [];
  const vergeben = new Set<ImportFeld>();

  kopfzeile.forEach((spalte, index) => {
    const bezeichnung = spalte.trim();
    if (!bezeichnung) return;
    const feld = ALIAS_NACH_FELD.get(normalisiereUeberschrift(bezeichnung));
    // Erste passende Spalte gewinnt, Dubletten werden ignoriert statt überschrieben
    if (feld && !vergeben.has(feld)) {
      felder.set(index, feld);
      vergeben.add(feld);
      erkannt.push({ spalte: bezeichnung, feld });
    } else {
      ignoriert.push(bezeichnung);
    }
  });

  const fehlendePflicht = PFLICHTSPALTEN.filter((f) => !vergeben.has(f));
  return { felder, erkannt, ignoriert, fehlendePflicht };
}

/** Baut aus einer Tabellenzeile einen Rohdatensatz und teilt Sammelspalten auf. */
export function zeileZuRohdatensatz(
  zeile: readonly unknown[],
  zuordnung: Spaltenzuordnung,
): Rohdatensatz {
  const roh: Rohdatensatz = {};
  for (const [index, feld] of zuordnung.felder) {
    const wert = String(zeile[index] ?? '')
      .replace(/\s+/g, ' ')
      .trim();
    if (wert) roh[feld] = wert;
  }

  if (roh.strasseHausnummer && !roh.strasse) {
    const teile = teileStrasseHausnummer(roh.strasseHausnummer);
    roh.strasse = teile.strasse;
    if (teile.hausnummer && !roh.hausnummer) roh.hausnummer = teile.hausnummer;
  }
  if (roh.plzOrt && !roh.plz && !roh.ort) {
    const treffer = /^(\d{4,5})\s+(.+)$/.exec(roh.plzOrt);
    if (treffer) {
      roh.plz = treffer[1];
      roh.ort = treffer[2];
    } else {
      roh.ort = roh.plzOrt;
    }
  }
  return roh;
}

/** „Hauptstr. 12a“ → { strasse: „Hauptstr.“, hausnummer: „12a“ } */
export function teileStrasseHausnummer(text: string): { strasse: string; hausnummer: string } {
  const treffer = /^(.*\D)\s+(\d+\s?[a-zA-Z]?(?:\s?[-/]\s?\d+\s?[a-zA-Z]?)?)$/.exec(text.trim());
  return treffer
    ? { strasse: treffer[1].trim(), hausnummer: treffer[2].replace(/\s/g, '') }
    : { strasse: text.trim(), hausnummer: '' };
}
