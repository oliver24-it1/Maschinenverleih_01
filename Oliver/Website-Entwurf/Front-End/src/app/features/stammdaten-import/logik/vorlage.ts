/**
 * CSV-Vorlage für den Kunden-Import (Semikolon + BOM, damit Excel sie korrekt öffnet).
 * Beispielzeilen sind fiktiv (example.com laut RFC 2606).
 */
const KOPF = [
  'Kundennummer',
  'Kundentyp',
  'Firmenname',
  'Vorname',
  'Nachname',
  'E-Mail',
  'Telefon',
  'USt-IdNr',
  'Straße',
  'Hausnummer',
  'Adresszusatz',
  'PLZ',
  'Ort',
];

const BEISPIELE = [
  [
    'K-10001',
    'Unternehmen',
    'Musterbau GmbH',
    '',
    '',
    'info@musterbau.example.com',
    '0201 000000',
    'DE123456789',
    'Industriestraße',
    '12',
    'Halle 3',
    '45127',
    'Essen',
  ],
  [
    'K-10002',
    'Privat',
    '',
    'Erika',
    'Mustermann',
    'erika.mustermann@example.com',
    '',
    '',
    'Beispielweg',
    '5a',
    '',
    '47051',
    'Duisburg',
  ],
];

export function erzeugeVorlageCsv(): Blob {
  const zeilen = [KOPF, ...BEISPIELE].map((z) => z.join(';')).join('\r\n');
  return new Blob(['\uFEFF' + zeilen], { type: 'text/csv;charset=utf-8' });
}

export function ladeHerunter(blob: Blob, dateiname: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = dateiname;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
