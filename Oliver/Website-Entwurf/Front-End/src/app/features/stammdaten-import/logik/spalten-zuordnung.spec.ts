import {
  normalisiereUeberschrift,
  ordneSpaltenZu,
  teileStrasseHausnummer,
  zeileZuRohdatensatz,
} from './spalten-zuordnung';

describe('Spaltenzuordnung', () => {
  it('normalisiert Umlaute, Groß-/Kleinschreibung und Sonderzeichen', () => {
    expect(normalisiereUeberschrift('E-Mail-Adresse')).toBe('emailadresse');
    expect(normalisiereUeberschrift(' Straße ')).toBe('strasse');
    expect(normalisiereUeberschrift('USt-IdNr.')).toBe('ustidnr');
  });

  it('erkennt typische Excel-Überschriften', () => {
    const z = ordneSpaltenZu(['Kd-Nr', 'Firma', 'E-Mail', 'Tel.', 'PLZ', 'Ort', 'Bemerkung']);
    expect(z.erkannt.map((e) => e.feld)).toEqual([
      'kundennummer',
      'firmenname',
      'email',
      'telefon',
      'plz',
      'ort',
    ]);
    expect(z.ignoriert).toEqual(['Bemerkung']);
    expect(z.fehlendePflicht).toEqual([]);
  });

  it('meldet fehlende Pflichtspalten', () => {
    expect(ordneSpaltenZu(['Name', 'Ort']).fehlendePflicht).toEqual(['kundennummer', 'email']);
  });

  it('ordnet mehrdeutige Kürzel wie „Nr“ nicht zu', () => {
    expect(ordneSpaltenZu(['Nr']).ignoriert).toEqual(['Nr']);
  });

  it('verwendet bei doppelten Überschriften nur die erste Spalte', () => {
    const z = ordneSpaltenZu(['E-Mail', 'Mail']);
    expect(z.felder.size).toBe(1);
    expect(z.ignoriert).toEqual(['Mail']);
  });

  it('teilt Sammelspalten „Straße Nr.“ und „PLZ Ort“ auf', () => {
    const z = ordneSpaltenZu(['Kundennr', 'Anschrift', 'PLZ Ort']);
    const roh = zeileZuRohdatensatz(['K-1', 'Rüttenscheider Str. 12a', '45130 Essen'], z);
    expect(roh).toMatchObject({
      strasse: 'Rüttenscheider Str.',
      hausnummer: '12a',
      plz: '45130',
      ort: 'Essen',
    });
  });

  it.each([
    ['Hauptstraße 5', 'Hauptstraße', '5'],
    ['Am Markt 12 b', 'Am Markt', '12b'],
    ['Weg 3-5', 'Weg', '3-5'],
    ['Straße des 17. Juni 100', 'Straße des 17. Juni', '100'],
    ['Ohne Nummer', 'Ohne Nummer', ''],
  ])('teilt „%s“ korrekt', (eingabe, strasse, hausnummer) => {
    expect(teileStrasseHausnummer(eingabe)).toEqual({ strasse, hausnummer });
  });

  it('entfernt überflüssige Leerzeichen', () => {
    const z = ordneSpaltenZu(['Vorname']);
    expect(zeileZuRohdatensatz(['  Erika   Maria '], z).vorname).toBe('Erika Maria');
  });
});
