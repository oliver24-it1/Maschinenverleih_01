// Maschinenverleih + Webshop | PostgreSQL | Deutsch, snake_case, ohne Umlaute
// Geld: numeric(12,2) | Zeitpunkte: timestamptz | FK-Standard: RESTRICT (explizit gesetzt)
Enum kundentyp {
  privat
  unternehmen
}

Enum kundenstatus {
  aktiv
  gesperrt
  anonymisiert
}

Enum benutzerrolle {
  kunde
  mitarbeiter
  admin
}

Enum adressverwendung {
  rechnung
  lieferung
}

Enum maschinenstatus {
  im_bestand
  in_wartung
  defekt
  ausgemustert
}

Enum belegungsart {
  reservierung
  miete
  wartung
  sperre
}

Enum reservierungsstatus {
  angefragt
  bestaetigt
  storniert
  abgelaufen
  umgewandelt
}

Enum mietstatus {
  geplant
  aktiv
  zurueckgegeben
  abgerechnet
  storniert
}

Enum rueckgabezustand {
  einwandfrei
  gebrauchsspuren
  beschaedigt
}

Enum wartungsart {
  inspektion
  reparatur
  sicherheitspruefung
  reinigung
}

Enum wartungsstatus {
  geplant
  in_arbeit
  abgeschlossen
  abgebrochen
}

Enum garantiestatus {
  aktiv
  eingeloest
  erloschen
}

Enum produktart {
  verbrauchsmaterial
  ersatzteil
  zubehoer
}

Enum lagerbewegungsart {
  wareneingang
  warenausgang
  korrektur
  retoure
}

Enum bestellstatus {
  offen
  bezahlt
  in_bearbeitung
  teilgeliefert
  geliefert
  storniert
}

Enum lieferstatus {
  vorbereitet
  versendet
  zugestellt
  retourniert
}

Enum rechnungstyp {
  rechnung
  stornorechnung
}

Enum rechnungsstatus {
  entwurf
  ausgestellt
}

Enum zahlungsart {
  ueberweisung
  lastschrift
  kreditkarte
  paypal
  bar
}

Enum zahlungsstatus {
  ausstehend
  erfolgreich
  fehlgeschlagen
  erstattet
}

Enum auditaktion {
  insert
  update
  delete
}
// ---------- Querschnitt ----------

Table nummernkreis {
  schluessel varchar(50) [pk, note: 'z.B. rechnung_2026, kunde, bestellung, mietvertrag']
  praefix varchar(10)
  letzte_nummer bigint [not null, default: 0]
  Note: 'Lueckenlose Nummern: UPDATE ... RETURNING in derselben Transaktion wie das Ausstellen. Keine SEQUENCE (Luecken bei Rollback).'
}

Table steuersatz {
  id smallint [pk, increment]
  bezeichnung varchar(50) [not null]
  satz_prozent numeric(5,2) [not null]
  gueltig_ab date [not null]
  gueltig_bis date
  Note: 'CHECK satz_prozent >= 0; bezeichnung+gueltig_ab eindeutig'
  indexes {
    (bezeichnung, gueltig_ab) [unique]
  }
}

Table adresse {
  id bigint [pk, increment]
  empfaenger varchar(200) [not null, note: 'Name oder Firma im Adressblock']
  strasse varchar(150) [not null]
  hausnummer varchar(20) [not null]
  adresszusatz varchar(150)
  plz_ort_id int [not null]
  land_code char(2) [not null, default: 'DE']
  created_at timestamptz [not null, default: `now()`]
  Note: 'Append-only: bestehende Zeilen werden nie geaendert, bei Umzug entsteht eine neue Zeile. Dokumente zeigen auf die alte.'
}

Table standort {
  id bigint [pk, increment]
  bezeichnung varchar(100) [not null, unique]
  adresse_id bigint [not null]
}

Table dokument {
  id uuid [pk, default: `gen_random_uuid()`]
  speicherpfad varchar(500) [not null, unique, note: 'S3-Objektschluessel']
  dateiname varchar(255) [not null]
  mime_type varchar(100) [not null]
  groesse_bytes bigint [not null]
  sha256 char(64) [not null, note: 'Integritaetsnachweis (GoBD)']
  maschine_id bigint
  wartung_id bigint 
  schaden_id bigint
  rechnung_id bigint
  hochgeladen_von uuid
  created_at timestamptz [not null, default: `now()`]
  Note: 'Exclusive Arc: CHECK num_nonnulls(maschine_id, wartung_id, schaden_id, rechnung_id) = 1'
}

Table audit_log {
  id bigint [pk, increment]
  zeitpunkt timestamptz [not null, default: `now()`]
  akteur_id uuid [note: 'Bewusst ohne FK: Log muss Kontolöschung überleben']
  aktion auditaktion [not null]
  tabellenname varchar(100) [not null]
  datensatz_id varchar(64) [not null]
  alte_werte jsonb
  neue_werte jsonb
  Note: 'Append-only (REVOKE UPDATE, DELETE; Trigger). Befuellung per Trigger, Partitionierung nach Monat moeglich.'
  indexes {
    (tabellenname, datensatz_id)
    zeitpunkt
  }
}

// ---------- Stammdaten Kunde / Benutzer ----------

Table kunde {
  id bigint [pk, increment]
  kundennummer varchar(20) [not null, unique]
  kundentyp kundentyp [not null]
  firmenname varchar(200)
  vorname varchar(100)
  nachname varchar(100)
  email varchar(254) [not null]
  telefon varchar(40)
  ust_idnr varchar(20)
  status kundenstatus [not null, default: 'aktiv']
  anonymisiert_am timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  Note: 'CHECK: unternehmen => firmenname not null; privat => nachname not null. Kein deleted_at, sondern Anonymisierung.'
}

Table kunde_adresse {
  id bigint [pk, increment]
  kunde_id bigint [not null]
  adresse_id bigint [not null]
  verwendung adressverwendung [not null]
  ist_standard boolean [not null, default: false]
  indexes {
    (kunde_id, adresse_id, verwendung) [unique]
  }
}

Table plz_ort_id{
  id int [pk]
  plz_id int
  ort_id varchar
}

Table plz {
  id int [pk]
  plz int
}

Table ort {
  id int [pk]
  ort_ortsteil varchar
}

Ref: plz_ort_id.plz_id > plz.id
Ref: plz_ort_id.ort_id > ort.id

Ref: adresse.plz_ort_id > plz_ort_id.id

Table profil {
  id uuid [pk, note: 'Identisch mit auth.users.id (Supabase). FK per SQL. Passwort, Sperre, letzte Anmeldung liegen in Auth/Authelia.']
  rolle benutzerrolle [not null]
  kunde_id bigint
  anzeigename varchar(150) [not null]
  aktiv boolean [not null, default: true]
  anonymisiert_am timestamptz
  created_at timestamptz [not null, default: `now()`]
  Note: 'CHECK: rolle = kunde <=> kunde_id not null. Mitarbeiter/Admin haben kunde_id null.'
}

// ---------- Maschinen ----------

Table hersteller {
  id bigint [pk, increment]
  name varchar(150) [not null, unique]
  adresse_id bigint
  webseite varchar(255)
}

Table maschinenmodell {
  id bigint [pk, increment]
  hersteller_id bigint [not null]
  herstellermodellnummer varchar(60) [not null]
  bezeichnung varchar(200) [not null]
  beschreibung text
  gewicht_kg numeric(8,2)
  standard_garantie_monate smallint
  aktiv boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  indexes {
    (hersteller_id, herstellermodellnummer) [unique]
  }
}

Table maschine {
  id bigint [pk, increment]
  inventarnummer varchar(30) [not null, unique]
  maschinenmodell_id bigint [not null]
  seriennummer varchar(80)
  baujahr smallint
  anschaffungsdatum date
  anschaffungspreis_netto numeric(12,2)
  standort_id bigint
  status maschinenstatus [not null, default: 'im_bestand']
  betriebsstunden numeric(10,1) [not null, default: 0]
  ausgemustert_am date
  notiz text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  Note: '"vermietet" ist kein Status, sondern wird aus belegung berechnet. Seriennummer je Modell eindeutig (SQL, partiell).'
}

Table mietpreis {
  id bigint [pk, increment]
  maschinenmodell_id bigint [not null]
  preis_pro_tag_netto numeric(10,2) [not null]
  kaution numeric(10,2) [not null, default: 0]
  steuersatz_id smallint [not null]
  gueltig_ab date [not null]
  gueltig_bis date
  Note: 'Keine Ueberlappung je Modell (Exclusion Constraint, siehe SQL).'
}

Table belegung {
  id bigint [pk, increment]
  maschine_id bigint [not null]
  art belegungsart [not null]
  von timestamptz [not null]
  bis timestamptz [not null]
  freigegeben_am timestamptz [note: 'Gesetzt bei Storno, Ablauf, Rueckgabe: Zeitraum ist dann wieder frei']
  created_at timestamptz [not null, default: `now()`]
  Note: 'CHECK bis > von. EXCLUDE gist (maschine_id =, tstzrange(von,bis) &&) WHERE freigegeben_am IS NULL'
}

// ---------- Reservierung / Mietvertrag ----------

Table reservierung {
  id bigint [pk, increment]
  kunde_id bigint [not null]
  erstellt_von uuid
  status reservierungsstatus [not null, default: 'angefragt']
  haelt_bis timestamptz
  bemerkung text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table reservierung_position {
  id bigint [pk, increment]
  reservierung_id bigint [not null]
  belegung_id bigint [not null, unique]
}
 Table mietvertrag {
  id bigint [pk, increment]
  vertragsnummer varchar(30) [not null, unique]
  kunde_id bigint [not null]
  reservierung_id bigint [unique]
  status mietstatus [not null, default: 'geplant']
  abgeschlossen_am timestamptz
  bemerkung text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table mietvertrag_position {
  id bigint [pk, increment]
  mietvertrag_id bigint [not null]
  belegung_id bigint [not null, unique]
  mietpreis_id bigint [not null, note: 'Herkunft des Preises, der Wert selbst steht als Snapshot darunter']
  maschinenbezeichnung varchar(250) [not null, note: 'Snapshot: Modell + Inventarnummer']
  preis_pro_tag_netto numeric(10,2) [not null]
  steuersatz_prozent numeric(5,2) [not null]
  rabatt_prozent numeric(5,2) [not null, default: 0]
  kaution numeric(10,2) [not null, default: 0]
  abholung_am timestamptz
  betriebsstunden_abholung numeric(10,1)
  rueckgabe_am timestamptz
  betriebsstunden_rueckgabe numeric(10,1)
  zustand_rueckgabe rueckgabezustand
  rueckgabe_bemerkung text
  Note: 'CHECK rabatt 0..100, rueckgabe_am >= abholung_am'
}

Table schaden {
  id bigint [pk, increment]
  mietvertrag_position_id bigint [not null]
  beschreibung text [not null]
  festgestellt_am timestamptz [not null, default: `now()`]
  festgestellt_von uuid
  geschaetzte_kosten numeric(10,2)
}

// ---------- Wartung / Bauteile / Garantie ----------

Table bauteiltyp {
  id bigint [pk, increment]
  bezeichnung varchar(200) [not null]
  herstellerteilenummer varchar(80)
  ist_verschleissteil boolean [not null, default: false]
  intervall_betriebsstunden int
  intervall_tage int
}

Table maschinenmodell_bauteiltyp {
  maschinenmodell_id bigint [not null]
  bauteiltyp_id bigint [not null]
  anzahl smallint [not null, default: 1]
  indexes {
    (maschinenmodell_id, bauteiltyp_id) [pk]
  }
}

Table wartung {
  id bigint [pk, increment]
  maschine_id bigint [not null]
  art wartungsart [not null]
  status wartungsstatus [not null, default: 'geplant']
  geplant_fuer date
  durchgefuehrt_am date
  betriebsstunden numeric(10,1)
  durchgefuehrt_von uuid
  beschreibung text
  kosten numeric(10,2)
  naechste_faellig_am date
  naechste_faellig_betriebsstunden numeric(10,1)
  belegung_id bigint [unique]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table maschinenbauteil {
  id bigint [pk, increment]
  maschine_id bigint [not null]
  bauteiltyp_id bigint [not null]
  seriennummer varchar(80)
  eingebaut_am date [not null]
  eingebaut_bei_wartung_id bigint
  ausgebaut_am date
  ausgebaut_bei_wartung_id bigint
  Note: 'Austausch = altes Teil ausbauen (ausgebaut_am setzen), neues Teil neu anlegen. Historie bleibt erhalten.'
}

Table garantie {
  id bigint [pk, increment]
  maschine_id bigint
  maschinenbauteil_id bigint
  garantiegeber varchar(150) [not null]
  referenznummer varchar(80)
  beginn date [not null]
  ende date [not null]
  bedingungen text
  status garantiestatus [not null, default: 'aktiv']
  Note: 'CHECK num_nonnulls(maschine_id, maschinenbauteil_id) = 1 und ende >= beginn'
}

// ---------- Webshop ----------

Table produkt {
  id bigint [pk, increment]
  artikelnummer varchar(40) [not null, unique]
  produktart produktart [not null]
  bezeichnung varchar(250) [not null]
  beschreibung text
  hersteller_id bigint
  einheit varchar(20) [not null, default: 'Stk']
  steuersatz_id smallint [not null]
  aktiv boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table produktpreis {
  id bigint [pk, increment]
  produkt_id bigint [not null]
  preis_netto numeric(12,2) [not null]
  gueltig_ab timestamptz [not null]
  gueltig_bis timestamptz
  Note: 'CHECK preis_netto >= 0. Keine Ueberlappung je Produkt (Exclusion Constraint).'
}

Table maschinenmodell_produkt {
  maschinenmodell_id bigint [not null]
  produkt_id bigint [not null]
  indexes {
    (maschinenmodell_id, produkt_id) [pk]
  }
}

Table lagerbestand {
  standort_id bigint [not null]
  produkt_id bigint [not null]
  menge_physisch int [not null, default: 0]
  menge_reserviert int [not null, default: 0]
  Note: 'CHECK menge_reserviert BETWEEN 0 AND menge_physisch. verfuegbar = physisch - reserviert wird berechnet (View), nicht gespeichert.'
  indexes {
    (standort_id, produkt_id) [pk ]
  }
}

Table lagerbewegung {
  id bigint [pk, increment]
  standort_id bigint [not null]
  produkt_id bigint [not null]
  art lagerbewegungsart [not null]
  menge int [not null, note: 'Vorzeichenbehaftet, Summe = physischer Bestand']
  lieferposition_id bigint
  erfasst_von uuid
  created_at timestamptz [not null, default: `now()`]
}

Table warenkorb {
  id bigint [pk, increment]
  profil_id uuid [not null, unique]
  updated_at timestamptz [not null, default: `now()`]
}

Table warenkorb_position {
  warenkorb_id bigint [not null]
  produkt_id bigint [not null]
  menge int [not null]
  Note: 'CHECK menge > 0. Kein Preis: der Warenkorb zeigt immer den aktuellen Preis.'
  indexes {
    (warenkorb_id, produkt_id) [pk]
  }
}

Table bestellung {
  id bigint [pk, increment]
  bestellnummer varchar(30) [not null, unique]
  kunde_id bigint [not null]
  bestellt_von uuid
  status bestellstatus [not null, default: 'offen']
  rechnungsadresse_id bigint [not null]
  lieferadresse_id bigint [not null]
  waehrung char(3) [not null, default: 'EUR']
  bestellt_am timestamptz [not null, default: `now()`]
  bemerkung text
  updated_at timestamptz [not null, default: `now()`]
}

Table bestellposition {
  id bigint [pk, increment]
  bestellung_id bigint [not null]
  positionsnr smallint [not null]
  produkt_id bigint [not null]
  artikelnummer varchar(40) [not null, note: 'Snapshot']
  bezeichnung varchar(250) [not null, note: 'Snapshot']
  menge int [not null]
  einzelpreis_netto numeric(12,2) [not null, note: 'Snapshot aus produktpreis']
  steuersatz_prozent numeric(5,2) [not null, note: 'Snapshot']
  rabatt_prozent numeric(5,2) [not null, default: 0]
  Note: 'CHECK menge > 0, rabatt 0..100'
  indexes {
    (bestellung_id, positionsnr) [unique]
  }
}

Table lieferung {
  id bigint [pk, increment]
  bestellung_id bigint [not null]
  lieferadresse_id bigint [not null]
  status lieferstatus [not null, default: 'vorbereitet']
  versanddienstleister varchar(60)
  sendungsnummer varchar(80)
  versendet_am timestamptz
  zugestellt_am timestamptz
}

Table lieferposition {
  lieferung_id bigint [not null]
  bestellposition_id bigint [not null]
  menge int [not null]
  Note: 'CHECK menge > 0. Summe je bestellposition <= bestellposition.menge (Trigger).'
  indexes {
    (lieferung_id, bestellposition_id) [pk]
  }
}

// ---------- Abrechnung ----------

Table rechnung {
  id bigint [pk, increment]
  rechnungsnummer varchar(30) [unique, note: 'NULL im Entwurf, wird beim Ausstellen vergeben (nummernkreis)']
  rechnungstyp rechnungstyp [not null, default: 'rechnung']
  status rechnungsstatus [not null, default: 'entwurf']
  kunde_id bigint [not null]
  rechnungsadresse_id bigint [not null]
  empfaenger_ust_idnr varchar(20) [note: 'Snapshot']
  rechnungsdatum date
  leistungsdatum_von date
  leistungsdatum_bis date
  faelligkeitsdatum date
  summe_netto numeric(14,2)
  summe_steuer numeric(14,2)
  summe_brutto numeric(14,2)
  waehrung char(3) [not null, default: 'EUR']
  steuerhinweis varchar(300)
  storno_zu_rechnung_id bigint [unique]
  ausgestellt_am timestamptz
  ausgestellt_von uuid
  created_at timestamptz [not null, default: `now()`]
  Note: 'Ab status = ausgestellt unveraenderlich (Trigger). Zahlungsstatus wird berechnet. CHECK: ausgestellt => Nummer, Datum, Summen, Leistungsdatum not null; brutto = netto + steuer.'
}

Table rechnungsposition {
  id bigint [pk, increment]
  rechnung_id bigint [not null]
  positionsnr smallint [not null]
  bestellposition_id bigint
  mietvertrag_position_id bigint
  bezeichnung varchar(300) [not null, note: 'Snapshot']
  menge numeric(12,3) [not null]
  einheit varchar(20) [not null]
  einzelpreis_netto numeric(12,2) [not null]
  rabatt_prozent numeric(5,2) [not null, default: 0]
  steuersatz_prozent numeric(5,2) [not null]
  betrag_netto numeric(12,2) [not null]
  betrag_steuer numeric(12,2) [not null]
  Note: 'CHECK menge <> 0 (negativ bei Storno), nicht beide Herkunftsverweise gleichzeitig gesetzt'
  indexes {
    (rechnung_id, positionsnr) [unique]
  }
}

Table zahlung {
  id bigint [pk, increment]
  rechnung_id bigint [not null]
  betrag numeric(12,2) [not null, note: 'Negativ bei Erstattung']
  zahlungsart zahlungsart [not null]
  status zahlungsstatus [not null, default: 'ausstehend']
  zahlungsanbieter varchar(60)
  externe_referenz varchar(120)
  ausgefuehrt_am timestamptz
  created_at timestamptz [not null, default: `now()`]
  Note: 'CHECK betrag <> 0'
  indexes {
    (zahlungsanbieter, externe_referenz) [unique]
  }
}



// ---------- Beziehungen ----------

Ref: standort.adresse_id > adresse.id [delete: restrict]
Ref: hersteller.adresse_id > adresse.id [delete: restrict]

Ref: dokument.maschine_id > maschine.id [delete: restrict]
Ref: dokument.wartung_id > wartung.id [delete: restrict]
Ref: dokument.schaden_id > schaden.id [delete: restrict]
Ref: dokument.rechnung_id > rechnung.id [delete: restrict]
Ref: dokument.hochgeladen_von > profil.id [delete: set null]

Ref: kunde_adresse.kunde_id > kunde.id [delete: restrict]
Ref: kunde_adresse.adresse_id > adresse.id [delete: restrict]
Ref: profil.kunde_id > kunde.id [delete: restrict]

Ref: maschinenmodell.hersteller_id > hersteller.id [delete: restrict]
Ref: maschine.maschinenmodell_id > maschinenmodell.id [delete: restrict]
Ref: maschine.standort_id > standort.id [delete: restrict]
Ref: mietpreis.maschinenmodell_id > maschinenmodell.id [delete: restrict]
Ref: mietpreis.steuersatz_id > steuersatz.id [delete: restrict]
Ref: belegung.maschine_id > maschine.id [delete: restrict]

Ref: reservierung.kunde_id > kunde.id [delete: restrict]
Ref: reservierung.erstellt_von > profil.id [delete: set null]
Ref: reservierung_position.reservierung_id > reservierung.id [delete: restrict]
Ref: reservierung_position.belegung_id - belegung.id [delete: restrict]
Ref: mietvertrag.kunde_id > kunde.id [delete: restrict]
Ref: mietvertrag.reservierung_id - reservierung.id [delete: restrict]
Ref: mietvertrag_position.mietvertrag_id > mietvertrag.id [delete: restrict]
Ref: mietvertrag_position.belegung_id - belegung.id [delete: restrict]
Ref: mietvertrag_position.mietpreis_id > mietpreis.id [delete: restrict]
Ref: schaden.mietvertrag_position_id > mietvertrag_position.id [delete: restrict]
Ref: schaden.festgestellt_von > profil.id [delete: set null]

Ref: maschinenmodell_bauteiltyp.maschinenmodell_id > maschinenmodell.id [delete: restrict]
Ref: maschinenmodell_bauteiltyp.bauteiltyp_id > bauteiltyp.id [delete: restrict]
Ref: wartung.maschine_id > maschine.id [delete: restrict]
Ref: wartung.durchgefuehrt_von > profil.id [delete: set null]
Ref: wartung.belegung_id - belegung.id [delete: restrict]
Ref: maschinenbauteil.maschine_id > maschine.id [delete: restrict]
Ref: maschinenbauteil.bauteiltyp_id > bauteiltyp.id [delete: restrict]
Ref: maschinenbauteil.eingebaut_bei_wartung_id > wartung.id [delete: restrict]
Ref: maschinenbauteil.ausgebaut_bei_wartung_id > wartung.id [delete: restrict]
Ref: garantie.maschine_id > maschine.id [delete: restrict]
Ref: garantie.maschinenbauteil_id > maschinenbauteil.id [delete: restrict]

Ref: produkt.hersteller_id > hersteller.id [delete: restrict]
Ref: produkt.steuersatz_id > steuersatz.id [delete: restrict]
Ref: produktpreis.produkt_id > produkt.id [delete: restrict]
Ref: maschinenmodell_produkt.maschinenmodell_id > maschinenmodell.id [delete: cascade]
Ref: maschinenmodell_produkt.produkt_id > produkt.id [delete: cascade]
Ref: lagerbestand.standort_id > standort.id [delete: restrict]
Ref: lagerbestand.produkt_id > produkt.id [delete: restrict]
Ref: lagerbewegung.standort_id > standort.id [delete: restrict]
Ref: lagerbewegung.produkt_id > produkt.id [delete: restrict]
Ref: lagerbewegung.lieferposition_id > lieferung.id [delete: restrict]
Ref: lagerbewegung.erfasst_von >? profil.id [delete: set null]

Ref: warenkorb.profil_id - profil.id [delete: cascade]
Ref: warenkorb_position.warenkorb_id > warenkorb.id [delete: cascade]
Ref: warenkorb_position.produkt_id > produkt.id [delete: restrict]

Ref: bestellung.kunde_id > kunde.id [delete: restrict]
Ref: bestellung.bestellt_von > profil.id [delete: set null]
Ref: bestellung.rechnungsadresse_id > adresse.id [delete: restrict]
Ref: bestellung.lieferadresse_id > adresse.id [delete: restrict]
Ref: bestellposition.bestellung_id > bestellung.id [delete: restrict]
Ref: bestellposition.produkt_id > produkt.id [delete: restrict]
Ref: lieferung.bestellung_id > bestellung.id [delete: restrict]
Ref: lieferung.lieferadresse_id > adresse.id [delete: restrict]
Ref: lieferposition.lieferung_id > lieferung.id [delete: restrict]
Ref: lieferposition.bestellposition_id > bestellposition.id [delete: restrict]

Ref: rechnung.kunde_id > kunde.id [delete: restrict]
Ref: rechnung.rechnungsadresse_id > adresse.id [delete: restrict]
Ref: rechnung.storno_zu_rechnung_id - rechnung.id [delete: restrict]
Ref: rechnung.ausgestellt_von > profil.id [delete: set null]
Ref: rechnungsposition.rechnung_id > rechnung.id [delete: restrict]
Ref: rechnungsposition.bestellposition_id > bestellposition.id [delete: restrict]
Ref: rechnungsposition.mietvertrag_position_id > mietvertrag_position.id [delete: restrict]
Ref: zahlung.rechnung_id > rechnung.id [delete: restrict]
