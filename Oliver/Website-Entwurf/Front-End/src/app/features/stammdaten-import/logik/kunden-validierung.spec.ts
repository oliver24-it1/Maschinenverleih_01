import { Rohdatensatz } from './kunden-import.model';
import { erkenneKundentyp, pruefeAlleZeilen, pruefeZeile } from './kunden-validierung';

const gueltigerPrivatkunde: Rohdatensatz = {
  kundennummer: 'K-1',
  kundentyp: 'Privat',
  vorname: 'Erika',
  nachname: 'Mustermann',
  email: 'erika@example.com',
  strasse: 'Beispielweg',
  hausnummer: '5',
  plz: '47051',
  ort: 'Duisburg',
};

const texte = (roh: Rohdatensatz) =>
  pruefeZeile(roh, 2)
    .meldungen.map((m) => m.text)
    .join(' | ');

describe('Kundenvalidierung', () => {
  it('akzeptiert einen vollständigen Privatkunden ohne Meldung', () => {
    const z = pruefeZeile(gueltigerPrivatkunde, 2);
    expect(z.status).toBe('ok');
    expect(z.meldungen).toEqual([]);
  });

  it.each([
    ['Privat', 'privat'],
    ['GEWERBE', 'unternehmen'],
    ['Firma', 'unternehmen'],
    ['u', 'unternehmen'],
    ['Verein', null],
  ])('erkennt Kundentyp „%s“', (eingabe, erwartet) => {
    expect(erkenneKundentyp(eingabe)).toBe(erwartet);
  });

  it('verlangt bei Unternehmen den Firmennamen (CHECK aus ER-Modell)', () => {
    const z = pruefeZeile({ ...gueltigerPrivatkunde, kundentyp: 'Unternehmen' }, 2);
    expect(z.status).toBe('fehler');
    expect(z.meldungen.some((m) => m.feld === 'firmenname')).toBe(true);
  });

  it('verlangt bei Privatkunden den Nachnamen', () => {
    expect(texte({ ...gueltigerPrivatkunde, nachname: undefined })).toContain(
      'Bei Privatkunden ist der Nachname Pflicht.',
    );
  });

  it('leitet fehlenden Kundentyp mit Warnung ab', () => {
    const z = pruefeZeile(
      { ...gueltigerPrivatkunde, kundentyp: undefined, firmenname: 'Bau AG' },
      2,
    );
    expect(z.daten.kundentyp).toBe('unternehmen');
    expect(z.status).toBe('warnung');
  });

  it('meldet unbekannten Kundentyp als Fehler', () => {
    expect(pruefeZeile({ ...gueltigerPrivatkunde, kundentyp: 'Verein' }, 2).status).toBe('fehler');
  });

  it.each(['', 'ohne-at.de', 'a@b', 'a b@c.de'])('lehnt E-Mail „%s“ ab', (email) => {
    expect(pruefeZeile({ ...gueltigerPrivatkunde, email }, 2).status).toBe('fehler');
  });

  it('schreibt E-Mail-Adressen klein', () => {
    expect(
      pruefeZeile({ ...gueltigerPrivatkunde, email: 'Erika@Example.COM' }, 2).daten.email,
    ).toBe('erika@example.com');
  });

  it('erkennt vierstellige PLZ als verlorene führende Null', () => {
    expect(texte({ ...gueltigerPrivatkunde, plz: '4109' })).toContain('führende Null');
  });

  it('meldet unvollständige Anschrift als Fehler, fehlende Anschrift nur als Warnung', () => {
    expect(texte({ ...gueltigerPrivatkunde, hausnummer: undefined })).toContain(
      'Anschrift unvollständig: Hausnummer fehlt',
    );
    const ohne = pruefeZeile(
      {
        ...gueltigerPrivatkunde,
        strasse: undefined,
        hausnummer: undefined,
        plz: undefined,
        ort: undefined,
      },
      2,
    );
    expect(ohne.status).toBe('warnung');
  });

  it('prüft deutsche USt-IdNr. (DE + 9 Ziffern)', () => {
    const firma: Rohdatensatz = {
      ...gueltigerPrivatkunde,
      kundentyp: 'Unternehmen',
      firmenname: 'Bau AG',
    };
    expect(pruefeZeile({ ...firma, ustIdnr: 'DE 123 456 789' }, 2).status).toBe('ok');
    expect(pruefeZeile({ ...firma, ustIdnr: 'DE12345' }, 2).status).toBe('fehler');
  });

  it('prüft Feldlängen laut ER-Modell', () => {
    expect(texte({ ...gueltigerPrivatkunde, kundennummer: 'K'.repeat(21) })).toContain(
      'Kundennummer ist zu lang (21 von max. 20 Zeichen)',
    );
  });

  it('erkennt doppelte Kundennummern (Fehler) und doppelte E-Mails (Warnung)', () => {
    const ergebnis = pruefeAlleZeilen([
      { roh: gueltigerPrivatkunde, zeilennummer: 2 },
      { roh: { ...gueltigerPrivatkunde, kundennummer: 'k-1' }, zeilennummer: 3 },
      { roh: { ...gueltigerPrivatkunde, kundennummer: 'K-2' }, zeilennummer: 4 },
    ]);
    expect(ergebnis.map((z) => z.status)).toEqual(['fehler', 'fehler', 'warnung']);
    expect(ergebnis[0].meldungen.map((m) => m.text)).toContain(
      'Kundennummer doppelt (auch in Zeile 3).',
    );
    expect(ergebnis[2].meldungen.map((m) => m.text)).toContain('Gleiche E-Mail wie in Zeile 2, 3.');
  });
});
