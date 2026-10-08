/**
 * Typen passend zu ER-Modell.md (Tabellen `kunde`, `adresse`).
 * Spaltennamen der DB sind snake_case, in TypeScript camelCase.
 */

export type Kundentyp = 'privat' | 'unternehmen';
export type Kundenstatus = 'aktiv' | 'gesperrt' | 'anonymisiert';
export type Adressverwendung = 'rechnung' | 'lieferung';

/** Maximale Feldlängen laut ER-Modell (varchar(n)). */
export const KUNDE_MAX_LAENGE = {
  kundennummer: 20,
  firmenname: 200,
  vorname: 100,
  nachname: 100,
  email: 254,
  telefon: 40,
  ustIdnr: 20,
} as const;

export const ADRESSE_MAX_LAENGE = {
  strasse: 150,
  hausnummer: 20,
  adresszusatz: 150,
} as const;
