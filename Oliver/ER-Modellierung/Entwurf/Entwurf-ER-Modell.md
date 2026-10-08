Table Maschine {
  produktnummer int [primary key]
  hersteller_id int 
  herstellermodellnummer varchar
  beschreibung varchar
  baujahr date
  gewicht int
  artikelnummer int [unique]
}

Table Hersteller {
  id int [primary key]
  herstellername varchar
  plz_id int
  adresse varchar
  hausnummer varchar
}

Table Plz_adresse {
  id int [primary key]
  plz varchar 
}

Table Kunde { 
  kundennummer int [primary key]
  vorname varchar 
  nachname varchar
  plz_id int
  adresse varchar
  hausnummer varchar
}

Table Ausleihe {
  id int [primary key]
  kundennummer int 
  beginn date 
  ende date
  rueckgabe date
}

Table Ausleihe_Maschine {
  ausleihe_id int [pk] 
  maschine_produktnummer int [pk]

}

Table Reservierung {
  id int [primary key]
  kundennummer int 
  von date 
  bis date 
}

Table Reservierung_Maschine {
  reservierung_id int [pk]
  maschine_produktnummer int [pk]


}

Table Rechnung {
  rechnungsnummer int [primary key]
  kundennummer int 
  auftragsnummer int
  datum date 
}

Table Rechnungsposition {
  id int [primary key]
  rechnungsnummer int 
  produkt_id int 
  menge int 
  einzelpreis decimal 
}

Table Zahlung {
  id int [primary key]
  rechnungsnummer int 
  zahlungsdatum date 
  betrag decimal 
}

Table Wartung {
  id int [primary key]
  maschine_produktnummer int 
  datum date 
  beschreibung varchar
}

Table Bauteil {
  id int [primary key]
  bezeichnung varchar 
  beschreibung varchar
}

Table Maschine_Bauteil {
  maschine_produktnummer int 
  bauteil_id int 
  anzahl int 

}

Table Verbrauchsmaterial {
  produktnummer int [primary key]
  hersteller_id int 
  beschreibung varchar
  artikelnummer int 
}

Table Produkt {
  id int [primary key]
  bezeichnungstext varchar 
}

Table Bestellung {
  id int [primary key]
  kundennummer int 
  bestelldatum date 
}

Table Bestellposition {
  id int [primary key]
  bestellung_id int 
  produkt_id int 
  menge int 
}

Ref: Maschine.hersteller_id > Hersteller.id
Ref: Ausleihe.kundennummer > Kunde.kundennummer
Ref: Hersteller.plz_id > Plz_adresse.id

Ref: Reservierung_Maschine.maschine_produktnummer > Maschine.produktnummer

Ref: Ausleihe_Maschine.ausleihe_id > Ausleihe.id
Ref: Ausleihe_Maschine.maschine_produktnummer > Maschine.produktnummer

Ref: Reservierung.kundennummer > Kunde.kundennummer
Ref: Reservierung_Maschine.reservierung_id > Reservierung.id
Ref: Bestellung.kundennummer > Kunde.kundennummer
Ref: Bestellposition.bestellung_id > Bestellung.id
Ref: Kunde.plz_id > Plz_adresse.id
Ref: Rechnung.kundennummer > Kunde.kundennummer
Ref: Rechnungsposition.rechnungsnummer > Rechnung.rechnungsnummer
Ref: Rechnungsposition.produkt_id > Produkt.id

Ref: Zahlung.rechnungsnummer > Rechnung.rechnungsnummer

Ref: Wartung.maschine_produktnummer > Maschine.produktnummer

Ref: Maschine_Bauteil.maschine_produktnummer > Maschine.produktnummer
Ref: Maschine_Bauteil.bauteil_id > Bauteil.id

Ref: Verbrauchsmaterial.hersteller_id > Hersteller.id


Ref: Bestellposition.produkt_id > Produkt.id
