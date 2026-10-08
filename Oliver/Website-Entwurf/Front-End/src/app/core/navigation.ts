export interface NavEintrag {
  bezeichnung: string;
  /** Fehlt der Pfad, ist das Modul noch nicht umgesetzt (Platzhalter). */
  pfad?: string;
}

export const HAUPTNAVIGATION: readonly NavEintrag[] = [
  { bezeichnung: 'Home', pfad: '/' },
  { bezeichnung: 'Stammdaten einpflegen', pfad: '/stammdaten' },
  { bezeichnung: 'Reservierung' },
  { bezeichnung: 'Verleih' },
  { bezeichnung: 'Material' },
];

export const SLOGAN = 'Leih an Rhein und Ruhr, rund um die Uhr';
