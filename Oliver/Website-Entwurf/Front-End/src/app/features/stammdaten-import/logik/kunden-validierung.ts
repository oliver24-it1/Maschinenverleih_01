import { ADRESSE_MAX_LAENGE, KUNDE_MAX_LAENGE, Kundentyp } from '../../../models/kunde.model';
import {
  GepruefteZeile,
  KundenImportDatensatz,
  Meldung,
  Rohdatensatz,
  Zeilenstatus,
} from './kunden-import.model';

/**
 * Clientseitige Vorprüfung der Kundendaten (Hilfe für den Nutzer).
 * Verbindlich prüft später die Datenbank (CHECK-Constraints, UNIQUE) – siehe CLAUDE.md §5/§6.
 */

const KUNDENTYP_WERTE: Record<string, Kundentyp> = {
  privat: 'privat',
  privatkunde: 'privat',
  privatperson: 'privat',
  p: 'privat',
  unternehmen: 'unternehmen',
  firma: 'unternehmen',
  firmenkunde: 'unternehmen',
  gewerbe: 'unternehmen',
  gewerblich: 'unternehmen',
  geschaeftskunde: 'unternehmen',
  geschäftskunde: 'unternehmen',
  u: 'unternehmen',
  f: 'unternehmen',
  g: 'unternehmen',
};

// Pragmatische Prüfung (kein vollständiges RFC 5322) – verständlich für Anwender
const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFON_MUSTER = /^\+?[\d\s()/.-]{5,}$/;
const UST_IDNR_MUSTER = /^[A-Z]{2}[0-9A-Z]{2,13}$/;
const UST_IDNR_DE_MUSTER = /^DE\d{9}$/;

export function erkenneKundentyp(wert: string | undefined): Kundentyp | null {
  if (!wert) return null;
  return KUNDENTYP_WERTE[wert.trim().toLowerCase()] ?? null;
}

export function pruefeZeile(roh: Rohdatensatz, zeilennummer: number): GepruefteZeile {
  const meldungen: Meldung[] = [];
  const fehler = (feld: Meldung['feld'], text: string) =>
    meldungen.push({ feld, schwere: 'fehler', text });
  const warnung = (feld: Meldung['feld'], text: string) =>
    meldungen.push({ feld, schwere: 'warnung', text });

  const daten: KundenImportDatensatz = {
    kundennummer: roh.kundennummer ?? '',
    kundentyp: erkenneKundentyp(roh.kundentyp),
    firmenname: roh.firmenname ?? '',
    vorname: roh.vorname ?? '',
    nachname: roh.nachname ?? '',
    email: (roh.email ?? '').toLowerCase(),
    telefon: roh.telefon ?? '',
    ustIdnr: (roh.ustIdnr ?? '').replace(/\s/g, '').toUpperCase(),
    strasse: roh.strasse ?? '',
    hausnummer: roh.hausnummer ?? '',
    adresszusatz: roh.adresszusatz ?? '',
    plz: roh.plz ?? '',
    ort: roh.ort ?? '',
  };

  // --- Kundennummer ---
  if (!daten.kundennummer) fehler('kundennummer', 'Kundennummer fehlt.');

  // --- Kundentyp (CHECK: unternehmen ⇒ firmenname, privat ⇒ nachname) ---
  if (roh.kundentyp && !daten.kundentyp) {
    fehler(
      'kundentyp',
      `Kundentyp „${roh.kundentyp}“ ist unbekannt (erlaubt: Privat, Unternehmen).`,
    );
  } else if (!daten.kundentyp) {
    daten.kundentyp = daten.firmenname ? 'unternehmen' : 'privat';
    warnung(
      'kundentyp',
      `Kundentyp fehlt – als „${daten.kundentyp === 'privat' ? 'Privat' : 'Unternehmen'}“ angenommen.`,
    );
  }
  if (daten.kundentyp === 'unternehmen' && !daten.firmenname) {
    fehler('firmenname', 'Bei Unternehmen ist der Firmenname Pflicht.');
  }
  if (daten.kundentyp === 'privat' && !daten.nachname) {
    fehler('nachname', 'Bei Privatkunden ist der Nachname Pflicht.');
  }

  // --- E-Mail ---
  if (!daten.email) fehler('email', 'E-Mail-Adresse fehlt.');
  else if (!EMAIL_MUSTER.test(daten.email)) fehler('email', 'E-Mail-Adresse ist ungültig.');

  // --- Telefon ---
  if (daten.telefon && !TELEFON_MUSTER.test(daten.telefon)) {
    warnung('telefon', 'Telefonnummer enthält ungewöhnliche Zeichen.');
  }

  // --- USt-IdNr. ---
  if (daten.ustIdnr) {
    if (daten.kundentyp === 'privat') {
      warnung('ustIdnr', 'USt-IdNr. bei einem Privatkunden – bitte Kundentyp prüfen.');
    }
    const gueltig = daten.ustIdnr.startsWith('DE')
      ? UST_IDNR_DE_MUSTER.test(daten.ustIdnr)
      : UST_IDNR_MUSTER.test(daten.ustIdnr);
    if (!gueltig) {
      fehler('ustIdnr', 'USt-IdNr. hat ein ungültiges Format (z. B. DE123456789).');
    }
  }

  // --- Adresse (append-only, wird als Rechnungsadresse angelegt) ---
  const adressteile = [daten.strasse, daten.hausnummer, daten.plz, daten.ort];
  const vorhanden = adressteile.filter(Boolean).length;
  if (vorhanden === 0) {
    warnung(undefined, 'Keine Anschrift – Rechnungsadresse muss später ergänzt werden.');
  } else if (vorhanden < adressteile.length) {
    const fehlend = [
      !daten.strasse && 'Straße',
      !daten.hausnummer && 'Hausnummer',
      !daten.plz && 'PLZ',
      !daten.ort && 'Ort',
    ].filter(Boolean);
    fehler(undefined, `Anschrift unvollständig: ${fehlend.join(', ')} fehlt.`);
  }
  if (daten.plz) {
    if (/^\d{4}$/.test(daten.plz)) {
      fehler('plz', `PLZ „${daten.plz}“ hat nur 4 Stellen – fehlt eine führende Null?`);
    } else if (!/^\d{5}$/.test(daten.plz)) {
      fehler('plz', `PLZ „${daten.plz}“ ist keine gültige deutsche Postleitzahl.`);
    }
  }

  // --- Feldlängen laut ER-Modell ---
  const laengen: [keyof KundenImportDatensatz, number, string][] = [
    ['kundennummer', KUNDE_MAX_LAENGE.kundennummer, 'Kundennummer'],
    ['firmenname', KUNDE_MAX_LAENGE.firmenname, 'Firmenname'],
    ['vorname', KUNDE_MAX_LAENGE.vorname, 'Vorname'],
    ['nachname', KUNDE_MAX_LAENGE.nachname, 'Nachname'],
    ['email', KUNDE_MAX_LAENGE.email, 'E-Mail'],
    ['telefon', KUNDE_MAX_LAENGE.telefon, 'Telefon'],
    ['ustIdnr', KUNDE_MAX_LAENGE.ustIdnr, 'USt-IdNr.'],
    ['strasse', ADRESSE_MAX_LAENGE.strasse, 'Straße'],
    ['hausnummer', ADRESSE_MAX_LAENGE.hausnummer, 'Hausnummer'],
    ['adresszusatz', ADRESSE_MAX_LAENGE.adresszusatz, 'Adresszusatz'],
  ];
  for (const [feld, max, name] of laengen) {
    const wert = daten[feld];
    if (typeof wert === 'string' && wert.length > max) {
      fehler(feld, `${name} ist zu lang (${wert.length} von max. ${max} Zeichen).`);
    }
  }

  return { zeilennummer, daten, meldungen, status: ermittleStatus(meldungen) };
}

export function ermittleStatus(meldungen: readonly Meldung[]): Zeilenstatus {
  if (meldungen.some((m) => m.schwere === 'fehler')) return 'fehler';
  if (meldungen.length > 0) return 'warnung';
  return 'ok';
}

/** Prüft alle Zeilen und zusätzlich Dubletten innerhalb der Datei. */
export function pruefeAlleZeilen(
  zeilen: readonly { roh: Rohdatensatz; zeilennummer: number }[],
): GepruefteZeile[] {
  const ergebnisse = zeilen.map(({ roh, zeilennummer }) => pruefeZeile(roh, zeilennummer));

  const nachNummer = gruppiere(ergebnisse, (z) => z.daten.kundennummer.toLowerCase());
  const nachEmail = gruppiere(ergebnisse, (z) => z.daten.email);

  for (const gruppe of nachNummer.values()) {
    if (gruppe.length < 2) continue;
    for (const z of gruppe) {
      const andere = gruppe.filter((o) => o !== z).map((o) => o.zeilennummer);
      z.meldungen.push({
        feld: 'kundennummer',
        schwere: 'fehler',
        text: `Kundennummer doppelt (auch in Zeile ${andere.join(', ')}).`,
      });
    }
  }
  for (const gruppe of nachEmail.values()) {
    if (gruppe.length < 2) continue;
    for (const z of gruppe) {
      const andere = gruppe.filter((o) => o !== z).map((o) => o.zeilennummer);
      z.meldungen.push({
        feld: 'email',
        schwere: 'warnung',
        text: `Gleiche E-Mail wie in Zeile ${andere.join(', ')}.`,
      });
    }
  }

  for (const z of ergebnisse) {
    // Fehler zuerst anzeigen – sie verhindern die Übernahme
    z.meldungen.sort((a, b) => Number(b.schwere === 'fehler') - Number(a.schwere === 'fehler'));
    z.status = ermittleStatus(z.meldungen);
  }
  return ergebnisse;
}

function gruppiere<T>(liste: readonly T[], schluessel: (e: T) => string): Map<string, T[]> {
  const gruppen = new Map<string, T[]>();
  for (const e of liste) {
    const s = schluessel(e);
    if (!s) continue;
    const gruppe = gruppen.get(s);
    if (gruppe) gruppe.push(e);
    else gruppen.set(s, [e]);
  }
  return gruppen;
}
