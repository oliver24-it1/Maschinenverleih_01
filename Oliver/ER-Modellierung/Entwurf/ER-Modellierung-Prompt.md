# Aufgabe: Kritische Finalisierung eines relationalen Datenbankmodells für Maschinenverleih und Webshop

Du bist ein **Senior Software Architect, Datenbankarchitekt und Fachinformatiker für Anwendungsentwicklung** mit Schwerpunkt auf relationalen Datenbanken, E-Commerce-Systemen, ERP-nahen Anwendungen und sicheren Webanwendungen.

Deine Aufgabe ist es, den unten stehenden Datenbankentwurf **rücksichtslos kritisch zu analysieren und anschließend zu einem fachlich konsistenten, normalisierten und produktionsnahen Datenbankmodell weiterzuentwickeln**.

Bewerte den Entwurf nicht danach, ob meine bisherigen Entscheidungen „vernünftig gemeint“ waren. Wenn etwas fachlich falsch, redundant, schlecht normalisiert, mehrdeutig, unvollständig oder langfristig problematisch ist, benenne es klar und ändere es.

## 1. Projektkontext

Eine Firma betreibt einen Webshop und einen Maschinenverleih.

Bisher wird eine große Excel-Tabelle verwendet, um unter anderem:

* Maschinen zu verwalten
* Maschinen zu vermieten
* Reservierungen zu verwalten
* Kunden zu verwalten
* Rechnungen zu erstellen
* Zahlungen zu dokumentieren
* Wartungen zu dokumentieren
* wartungsrelevante Maschinenteile bzw. DP (Detail-/Dokumentations-/Wartungsteile) zu verwalten
* Verbrauchsmaterialien den Maschinen zuzuordnen
* Bestellungen zu verwalten
* Lieferungen bzw. Lieferstatus abzubilden
* Garantieinformationen zu verwalten

Die Excel-Datei soll durch eine relationale Datenbank und eine darauf aufbauende Webanwendung ersetzt werden.

Zusätzlich soll ein Online-Shop entstehen, über den Kunden Verbrauchsmaterialien passend zu den gemieteten Maschinen kaufen können.

Das System soll langfristig nicht nur die Excel-Datei nachbilden, sondern eine **saubere fachliche Grundlage für eine Webanwendung** bilden.

---

# 2. Projektziele

### Systemarchitektur

Die Anwendung soll eine dokumentierte Systemarchitektur besitzen.

Unter anderem sind vorgesehen:

* UML-Diagramme
* Server-/VM-Infrastruktur
* Basisabsicherung nach IT-Grundschutz
* sichere Webanwendung

### Maschinenverleih

Kunden sollen:

* Maschinen suchen
* Maschinen ansehen
* Maschinen auswählen
* Maschinen reservieren
* Maschinen buchen
* gemietete Maschinen verwalten können

Administratoren/Mitarbeiter sollen:

* Maschinen verwalten
* Maschinenstatus verwalten
* Wartungen dokumentieren
* wartungsrelevante Bauteile verwalten
* Garantieinformationen verwalten
* Vermietungen verwalten
* Reservierungen verwalten
* Kunden verwalten

### Rechnungswesen

Das System soll:

* Rechnungen erstellen
* Rechnungspositionen verwalten
* Umsatzsteuer berücksichtigen
* Zahlungen verwalten
* Zahlungsstatus abbilden
* Buchhaltungsschnittstellen ermöglichen
* Audit-Logs bereitstellen

### Compliance

Das System muss konzeptionell auf folgende Anforderungen vorbereitet sein:

* DSGVO
* GoBD
* UStG
* Zugriffskontrolle
* Audit-Trails
* Nachvollziehbarkeit von Änderungen
* historische Nachvollziehbarkeit geschäftlich relevanter Daten

Wichtig:

Du bist **nicht** der Steuerberater oder Jurist. Behaupte daher nicht, dass ein Datenbankmodell allein GoBD-/DSGVO-konform ist.

Stattdessen sollst du beschreiben, welche Datenstrukturen und technischen Mechanismen erforderlich sind, damit die Anwendung diese Anforderungen unterstützen kann.

### Verbrauchsmaterial-Webshop

Kunden sollen:

* Verbrauchsmaterialien suchen
* Produkte ansehen
* passende Verbrauchsmaterialien für Maschinen finden
* Produkte in einen Warenkorb legen
* Bestellungen durchführen
* bezahlen
* Rechnungen erhalten
* Bestellhistorien einsehen

Die Produkte sollen nach Möglichkeit mit Maschinen bzw. Maschinentypen verknüpft werden können.

---

# 3. Mein bisheriger Datenbankentwurf

Dies ist ausdrücklich nur ein **unfertiger Ausgangsentwurf**.

```dbml
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

```

---

# 4. Deine wichtigste Aufgabe: Hinterfrage das gesamte Modell

Gehe NICHT davon aus, dass meine Tabellen oder Beziehungen korrekt sind.

Prüfe insbesondere:

## A. Fachliche Entitäten

Identifiziere alle notwendigen fachlichen Entitäten.

Prüfe beispielsweise, ob folgende Konzepte wirklich voneinander getrennt werden müssen:

* Hersteller
* Maschinenmodell
* konkrete Maschine
* Produkt
* Verbrauchsmaterial
* Bauteil
* Wartung
* Kunde
* Benutzer
* Adresse
* Reservierung
* Ausleihe/Mietvertrag
* Bestellung
* Bestellposition
* Rechnung
* Rechnungsposition
* Zahlung
* Lieferung
* Garantie
* Maschinenstatus
* Warenkorb
* Lagerbestand

Füge fehlende Entitäten hinzu, wenn sie fachlich notwendig sind.

Entferne Tabellen, die keine eigenständige fachliche Bedeutung besitzen.

---

# 5. Besonders wichtig: Maschine vs. Produkt

Untersuche kritisch, ob meine aktuelle Verwendung von:

* `produktnummer`
* `artikelnummer`
* `Produkt`
* `Maschine`
* `Verbrauchsmaterial`

fachlich korrekt ist.

Eine konkrete physische Maschine ist möglicherweise etwas anderes als ein Artikel bzw. ein Maschinenmodell.

Beispielsweise könnte es fachlich sinnvoll sein, zwischen:

**Maschinenmodell**

> „Bosch GSH 11 VC“

und

**konkreter Maschine**

> Maschine #4711, Seriennummer XYZ123, Baujahr 2023

zu unterscheiden.

Prüfe, ob diese Trennung für einen Maschinenverleih erforderlich ist.

Berücksichtige insbesondere:

* Seriennummer
* interne Inventarnummer
* Hersteller
* Hersteller-Modellnummer
* Maschinenmodell
* konkrete physische Maschine
* Mietbarkeit
* Maschinenstatus
* Wartungshistorie
* Standort
* Anschaffung
* Garantie
* Zustand

Erkläre deine Entscheidung.

---

# 6. Vermietung und Reservierung

Entwirf einen sauberen Datenfluss:

**Kunde → Reservierung → Mietvertrag/Ausleihe → Rückgabe**

Prüfe:

* Kann eine Reservierung mehrere Maschinen enthalten?
* Kann eine Maschine mehrere Reservierungen über die Zeit besitzen?
* Wie wird verhindert, dass eine Maschine doppelt vermietet wird?
* Wie werden Zeiträume modelliert?
* Wie werden Stornierungen abgebildet?
* Wie werden Mietstatus abgebildet?
* Wie werden Abhol- und Rückgabezeitpunkte gespeichert?
* Wie wird der tatsächliche Zustand bei Rückgabe dokumentiert?
* Wie werden Schäden dokumentiert?
* Wie werden Mietpreise gespeichert?
* Können Preise später geändert werden, ohne alte Rechnungen zu verändern?

Entscheide, ob `Ausleihe` wirklich die richtige Bezeichnung und Struktur besitzt oder ob beispielsweise `Mietvertrag`, `Mietvorgang` oder `Vermietung` sinnvoller wäre.

---

# 7. Bestellungen und Webshop

Modelliere einen vollständigen Bestellprozess.

Mindestens soll konzeptionell möglich sein:

```text
Kunde
 ↓
Warenkorb
 ↓
Bestellung
 ↓
Bestellpositionen
 ↓
Zahlung
 ↓
Lieferung
 ↓
Rechnung
```

Prüfe:

* Kann eine Bestellung mehrere Produkte enthalten?
* Kann ein Produkt in mehreren Bestellungen vorkommen?
* Wo wird der zum Bestellzeitpunkt gültige Preis gespeichert?
* Wo wird die Umsatzsteuer gespeichert?
* Was passiert, wenn sich der Produktpreis später ändert?
* Was passiert, wenn sich die Produktbezeichnung später ändert?
* Wie werden Rabatte behandelt?
* Wie werden Stornierungen behandelt?
* Wie werden Teil-Lieferungen behandelt?
* Wie werden Lieferadressen gespeichert?
* Wie werden Rechnungsadressen gespeichert?
* Wie werden Zahlungsstatus gespeichert?

Verhindere historische Inkonsistenzen.

Eine bereits ausgestellte Rechnung darf beispielsweise nicht rückwirkend ihren Preis ändern, nur weil sich der aktuelle Produktpreis geändert hat.

---

# 8. Rechnungen und Rechnungspositionen

Überarbeite die Rechnungsstruktur vollständig.

Berücksichtige mindestens:

* Rechnungsnummer
* Rechnungsdatum
* Kunde
* Rechnungsadresse
* Leistungs-/Lieferdatum
* Nettobetrag
* Umsatzsteuer
* Bruttobetrag
* Zahlungsstatus
* Fälligkeitsdatum
* Stornierung
* Rechnungspositionen
* Menge
* Einzelpreis
* Rabatt
* Umsatzsteuersatz
* Positionsbetrag

Prüfe außerdem:

**Warum ist `Rechnungsposition.id` aktuell mit `Maschine.artikelnummer` verknüpft?**

Diese Beziehung wirkt fachlich falsch. Erkläre exakt warum und ersetze sie durch eine sinnvolle Struktur.

Berücksichtige auch, dass eine Rechnung sowohl Mietleistungen als auch Verbrauchsmaterialien enthalten könnte.

---

# 9. Preise und historische Daten

Dies ist besonders wichtig.

Entwirf das Modell so, dass historische Geschäftsdaten unverändert nachvollziehbar bleiben.

Beispiel:

Ein Verbrauchsmaterial kostet im Jahr 2026 10 €.

2027 kostet es 12 €.

Eine Bestellung aus 2026 darf nach der Preisänderung nicht plötzlich 12 € wert sein.

Dasselbe gilt für:

* Produktbezeichnungen
* Umsatzsteuersätze
* Mietpreise
* Rabatte
* Rechnungsadressen
* Lieferadressen

Entscheide, welche Werte als Snapshot in Geschäftsdokumenten gespeichert werden müssen und welche über Fremdschlüssel referenziert werden dürfen.

---

# 10. Kunden und Adressen

Die aktuelle Tabelle `Kunde` ist offensichtlich unvollständig.

Prüfe, ob Kunden:

* Privatpersonen
* Unternehmen

sein können.

Berücksichtige ggf.:

* Firmenname
* Vorname
* Nachname
* E-Mail
* Telefon
* Kundennummer
* Rechnungsadresse
* Lieferadresse
* mehrere Adressen
* Standardadresse
* Rechnungs-/Lieferadressen historisch speichern
* USt-IdNr.
* interne Kundennummer
* Status

Vermeide eine unnötige Übermodellierung, wenn etwas nicht benötigt wird.

---

# 11. Hersteller und Adressen

Analysiere insbesondere:

```text
Hersteller
Plz_adresse
```

Prüfe, ob `Plz_adresse` überhaupt sinnvoll modelliert ist.

Eine Postleitzahl ist keine Adresse.

Entscheide, ob beispielsweise folgende Struktur sinnvoller wäre:

```text
Adresse
PLZ
Ort
Straße
Hausnummer
Land
```

oder ob die Adresse anders modelliert werden sollte.

Begründe deine Entscheidung.

---

# 12. Wartung und Bauteile

Das System muss Wartungsinformationen verwalten können.

Untersuche:

* Wartung
* Bauteil
* konkrete Maschine
* Maschinenmodell

Beispielsweise:

Eine bestimmte Maschinenart kann ein bestimmtes wartungsrelevantes Bauteil besitzen.

Eine konkrete Maschine besitzt dieses Bauteil tatsächlich.

Das Bauteil kann ausgetauscht werden.

Eine Wartung findet an einer konkreten Maschine statt.

Prüfe daher, ob wir zwischen:

* Bauteiltyp
* konkretem verbautem Bauteil
* Wartung
* Wartungsposition
* Ersatzteil
* Verbrauchsmaterial

unterscheiden müssen.

Berücksichtige:

* Wartungsdatum
* Wartungsart
* Kilometer/Betriebsstunden, falls relevant
* Mitarbeiter
* Kosten
* Beschreibung
* nächster Wartungstermin
* verbaute/ausgetauschte Teile
* Dokumente
* Wartungsstatus

---

# 13. Garantie

Entwirf eine sinnvolle Möglichkeit zur Verwaltung von Garantieinformationen.

Prüfe, ob Garantie:

* auf dem Maschinenmodell
* auf einer konkreten Maschine
* auf einem Bauteil

liegen kann.

Berücksichtige:

* Beginn
* Ende
* Garantiegeber
* Garantiebedingungen
* Referenznummer
* Status

---

# 14. Lager und Verfügbarkeit

Prüfe, ob für einen Webshop ein Lagerbestand benötigt wird.

Falls ja, modelliere sinnvoll:

* Produkt
* Lager
* Lagerbestand
* reservierter Bestand
* verfügbarer Bestand

Verhindere logische Inkonsistenzen.

Beispiel:

100 Stück vorhanden
20 Stück reserviert
→ 80 Stück verfügbar

Überlege, ob `available_stock` tatsächlich gespeichert werden sollte oder aus anderen Daten berechnet werden sollte.

---

# 15. Maschinen und Verbrauchsmaterialien

Der Shop soll Verbrauchsmaterialien anbieten, die zu bestimmten Maschinen passen.

Modelliere beispielsweise:

```text
Maschinenmodell ↔ Verbrauchsmaterial
```

als n:m-Beziehung, sofern fachlich sinnvoll.

Berücksichtige, dass ein Verbrauchsmaterial möglicherweise für mehrere Maschinenmodelle geeignet ist.

Ebenso kann eine Maschine mehrere verschiedene Verbrauchsmaterialien benötigen.

---

# 16. Benutzer und Berechtigungen

Das bisherige Modell enthält noch keine Benutzerverwaltung.

Prüfe, welche Struktur für:

* Kunde
* Mitarbeiter
* Administrator
* Benutzerkonto
* Rolle
* Berechtigung

notwendig ist.

Berücksichtige:

* Login
* Passwort-Hash
* Rollen
* Accountstatus
* letzte Anmeldung
* Sperrung
* Passwortänderungen

Speichere niemals Passwörter im Klartext.

---

# 17. Audit-Logs

Da geschäftlich relevante Daten verarbeitet werden, soll das System Änderungen nachvollziehbar machen.

Entwirf eine Audit-Struktur.

Beispielsweise:

```text
AuditLog
- Wer?
- Wann?
- Was?
- Welche Entität?
- Welche Datensatz-ID?
- Alte Werte?
- Neue Werte?
- Aktion?
```

Prüfe, ob JSON/JSONB für alte/neue Werte sinnvoll wäre.

Berücksichtige, dass Audit-Logs nicht einfach mit normalen Geschäftsdaten überschrieben werden dürfen.

---

# 18. DSGVO

Berücksichtige Datenschutz technisch, ohne zu behaupten, dass die Datenbank allein DSGVO-Konformität herstellt.

Prüfe:

* personenbezogene Daten
* Löschung
* Anonymisierung
* Aufbewahrungsfristen
* Zweckbindung
* Zugriffskontrolle
* Auditierung
* historische Rechnungsdaten
* Benutzerkonten
* Login-Daten

Ein wichtiger Punkt:

Nicht jede personenbezogene Information darf aufgrund eines Löschwunsches einfach aus Geschäftsdokumenten gelöscht werden, wenn gesetzliche Aufbewahrungspflichten entgegenstehen.

Zeige, wie das Datenmodell solche Konflikte technisch unterstützen kann.

---

# 19. GoBD / UStG

Berücksichtige insbesondere:

* Unveränderbarkeit von Rechnungen
* fortlaufende Rechnungsnummern
* Nachvollziehbarkeit
* Aufbewahrung
* Stornorechnungen
* Korrekturen
* Umsatzsteuer
* historische Preise
* Zahlungsstatus
* Audit-Trail

Unterscheide strikt zwischen:

**fachlicher Datenmodellierung**

und

**tatsächlicher rechtlicher/organisatorischer Compliance**.

---

# 20. Normalisierung

Analysiere das gesamte Modell hinsichtlich:

* 1. Normalform
* 2. Normalform
* 3. Normalform
* sinnvollen Denormalisierungen

Finde:

* redundante Daten
* Update-Anomalien
* Insert-Anomalien
* Delete-Anomalien
* falsche Primärschlüssel
* fehlende Fremdschlüssel
* unnötige IDs
* falsch modellierte n:m-Beziehungen
* fehlende Unique Constraints

Normalisiere sinnvoll, aber betreibe keine akademische Übernormalisierung ohne praktischen Nutzen.

---

# 21. Datentypen und Datenbanktechnik

Prüfe jeden Datentyp.

Insbesondere:

* `int`
* `integer`
* `bigint`
* `decimal`
* `numeric`
* `varchar`
* `text`
* `date`
* `timestamp`
* `boolean`
* UUID

Prüfe insbesondere, ob:

```text
gewicht int
```

sinnvoll ist.

Prüfe, ob Geldbeträge als `float` gespeichert werden sollten.

Sie sollen **nicht** als Floating-Point-Werte gespeichert werden.

---

# 22. Primärschlüssel

Hinterfrage jede ID.

Entscheide zwischen:

* natürlichen Schlüsseln
* technischen IDs
* UUID
* BIGINT
* zusammengesetzten Schlüsseln

Beispielsweise:

```text
Kundennummer
Rechnungsnummer
Produktnummer
Seriennummer
```

müssen nicht automatisch technische Primärschlüssel sein.

Erkläre deine Entscheidung.

---

# 23. Constraints

Definiere sinnvolle:

* PRIMARY KEY
* FOREIGN KEY
* UNIQUE
* NOT NULL
* CHECK
* DEFAULT

Constraints.

Die Datenbank soll möglichst viele fachlich unmögliche Zustände bereits auf Datenbankebene verhindern.

---

# 24. Löschverhalten

Definiere für relevante Beziehungen:

* CASCADE
* RESTRICT
* SET NULL

und erkläre deine Entscheidungen.

Beispiel:

Eine Rechnung darf nicht einfach verschwinden, nur weil ein Kunde gelöscht wurde.

---

# 25. Statusfelder

Vermeide unkontrollierte Freitexte wie:

```text
status varchar
```

wenn ein kontrollierter Wertebereich erforderlich ist.

Prüfe, ob ENUMs, Lookup-Tabellen oder andere Lösungen sinnvoll sind.

Beispiele:

* Maschinenstatus
* Bestellstatus
* Zahlungsstatus
* Reservierungsstatus
* Mietstatus
* Lieferstatus
* Wartungsstatus

---

# 26. Zeit und Historie

Verwende Zeitinformationen dort, wo sie fachlich erforderlich sind.

Prüfe:

* created_at
* updated_at
* deleted_at
* valid_from
* valid_until

Unterscheide zwischen:

* technischer Änderungszeit
* fachlicher Gültigkeit
* tatsächlichem Ereigniszeitpunkt

---

# 27. Ergebnisformat

Liefere deine Antwort in exakt dieser Struktur:

## 1. Executive Summary

Kurze Einschätzung des vorhandenen Entwurfs.

Sag klar:

* was grundsätzlich falsch ist
* was fehlt
* welche Architekturprobleme existieren
* welche Konzepte neu eingeführt werden müssen

Keine Beschönigung.

---

## 2. Kritische Fehler im aktuellen Modell

Erstelle eine Tabelle:

| Aktuelles Element | Problem | Konsequenz | Lösung |
| ----------------- | ------- | ---------- | ------ |

Gehe dabei auf jede relevante Tabelle und Beziehung ein.

---

## 3. Fachliches Zielmodell

Beschreibe alle finalen Entitäten und ihre Verantwortlichkeiten.

Beispiel:

```text
Hersteller
    ↓
Maschinenmodell
    ↓
Maschine
```

und:

```text
Kunde
    ↓
Reservierung
    ↓
Mietvertrag
    ↓
Rechnung
    ↓
Zahlung
```

sowie:

```text
Kunde
    ↓
Bestellung
    ↓
Bestellposition
    ↓
Produkt
```

---

## 4. ER-Modell

Beschreibe die Beziehungen inklusive:

* 1:1
* 1:n
* n:m

und erkläre jede nicht triviale Beziehung.

---

## 5. Finales DBML

Erstelle anschließend ein **vollständiges DBML-Modell**, das direkt in dbdiagram.io importiert werden kann.

Das DBML muss:

* syntaktisch korrekt sein
* konsistente Namen verwenden
* Primärschlüssel enthalten
* Fremdschlüssel enthalten
* sinnvolle Datentypen verwenden
* Constraints soweit DBML unterstützt definieren
* n:m-Beziehungen über Zwischentabellen modellieren
* keine Phantom-Referenzen enthalten
* keine Tabellen enthalten, die nicht benötigt werden

Verwende einheitliche Namenskonventionen.

Bevorzuge beispielsweise:

```text
snake_case
```

und konsistente englische oder deutsche Bezeichnungen.

Entscheide dich für **eine Sprache und bleibe konsequent dabei**.

---

## 6. Warum dieses Modell besser ist

Erkläre anschließend die wichtigsten Architekturentscheidungen.

Insbesondere:

* Maschine vs. Maschinenmodell
* Produkt vs. Verbrauchsmaterial
* Reservierung vs. Mietvertrag
* Bestellung vs. Rechnung
* Rechnungsposition vs. Bestellposition
* Kunde vs. Benutzer
* Bauteil vs. Verbrauchsmaterial
* aktuelle Daten vs. historische Snapshots

---

## 7. Geschäftsprozesse

Zeige anhand konkreter Beispiele, wie das Modell folgende Prozesse abbildet:

### Prozess A

Kunde reserviert eine Maschine.

### Prozess B

Kunde holt Maschine ab.

### Prozess C

Kunde gibt Maschine zurück.

### Prozess D

Maschine muss gewartet werden.

### Prozess E

Kunde kauft Verbrauchsmaterial.

### Prozess F

Kunde bezahlt Bestellung.

### Prozess G

Rechnung wird erstellt.

### Prozess H

Produktpreis ändert sich.

### Prozess I

Kunde möchte personenbezogene Daten löschen lassen.

### Prozess J

Rechnung muss Jahre später nachvollzogen werden.

---

## 8. Offene fachliche Entscheidungen

Identifiziere Dinge, die ohne weitere Informationen nicht eindeutig entschieden werden können.

Stelle diese am Ende als konkrete Fragen dar.

Beispielsweise:

1. Können nur Unternehmen oder auch Privatkunden bestellen?
2. Können Maschinen mehrfach physisch vorhanden sein?
3. Gibt es mehrere Lager?
4. Gibt es verschiedene Miettarife?
5. Werden Maschinen nach Betriebsstunden abgerechnet?
6. Können Maschinen während einer Reservierung ausgetauscht werden?
7. Gibt es Teilzahlungen?
8. Welche Zahlungsanbieter werden verwendet?
9. Gibt es mehrere MwSt.-Sätze?
10. Welche Buchhaltungssoftware wird angebunden?

Wichtig:

**Wenn eine sinnvolle Annahme getroffen werden kann, triff sie selbst und kennzeichne sie als Annahme.**

Stelle nicht 30 Rückfragen, wenn das Modell trotzdem sinnvoll entworfen werden kann.

---

# 28. Kritische Architekturregel

Du darfst meinen bestehenden Entwurf vollständig verändern.

Du bist ausdrücklich berechtigt:

* Tabellen umzubenennen
* Tabellen zu löschen
* Tabellen aufzuteilen
* Tabellen zusammenzuführen
* neue Tabellen hinzuzufügen
* Beziehungen zu ändern
* Primärschlüssel zu ändern
* Datentypen zu ändern
* zusätzliche historische Snapshot-Felder einzuführen

Das Ziel ist **nicht**, meinen bisherigen Entwurf möglichst ähnlich zu halten.

Das Ziel ist ein **fachlich sauberes, langfristig wartbares relationales Datenmodell für einen Maschinenverleih mit integriertem E-Commerce-System**.

Wenn meine Modellierung falsch ist, sage explizit:

> „Diese Modellierung ist fachlich falsch, weil …“

und korrigiere sie.

---

# 29. Qualitätsprüfung vor der finalen Ausgabe

Führe vor deiner finalen Antwort selbstständig einen Review durch.

Prüfe mindestens:

### Referential Integrity

Kann irgendwo ein Fremdschlüssel auf eine falsche Entität zeigen?

### Historisierung

Kann eine alte Rechnung nachträglich ihren Betrag verändern?

### Mehrfachverwendung

Kann ein Produkt in mehreren Bestellungen vorkommen?

### Maschinenverfügbarkeit

Kann dieselbe konkrete Maschine gleichzeitig an zwei Kunden vermietet werden?

### Löschung

Kann das Löschen eines Kunden versehentlich eine Rechnung löschen?

### Preise

Kann eine Preisänderung historische Bestellungen verändern?

### Adressen

Kann eine historische Rechnung nach einer Adressänderung plötzlich eine andere Adresse anzeigen?

### Wartung

Kann eine Wartung eindeutig einer konkreten Maschine zugeordnet werden?

### Bauteile

Kann ein Bauteilwechsel historisch nachvollzogen werden?

### Bestellung

Kann eine Bestellung mehrere Positionen enthalten?

### Rechnung

Kann eine Rechnung mehrere Positionen enthalten?

### Zahlung

Kann eine Rechnung mehrere Zahlungsvorgänge besitzen?

### Lieferung

Kann eine Bestellung mehrere Lieferungen besitzen?

### Datenschutz

Kann ein Benutzerkonto deaktiviert/anonymisiert werden, ohne historische Geschäftsdaten unbrauchbar zu machen?

### Audit

Kann nachvollzogen werden, wer geschäftlich relevante Daten geändert hat?

### Normalisierung

Existieren unnötige Redundanzen?

### Skalierbarkeit

Würde das Modell auch bei zehntausenden Kunden, Produkten, Bestellungen und Maschinen noch sinnvoll funktionieren?

Wenn du bei einem dieser Punkte Probleme findest, korrigiere das Modell **vor** der Ausgabe des finalen DBML.

---

# 30. Wichtig: Keine oberflächliche Antwort

Ich möchte keine allgemeine Datenbank-Theorie und keine oberflächliche Liste von Verbesserungsvorschlägen.

Ich möchte, dass du tatsächlich als Datenbankarchitekt arbeitest und einen **konkreten finalen Entwurf** erstellst.

Der finale DBML-Entwurf ist das wichtigste Ergebnis.

Begründe Architekturentscheidungen dort, wo sie für das Verständnis relevant sind, aber verliere dich nicht in allgemeiner Theorie.

**Priorität:**

1. fachliche Korrektheit
2. Datenintegrität
3. historische Nachvollziehbarkeit
4. Wartbarkeit
5. Sicherheit und Compliance-Unterstützung
6. Erweiterbarkeit
7. Verständlichkeit
8. Performance
9. möglichst geringe unnötige Komplexität

Wenn zwei Lösungen möglich sind, wähle diejenige, die für ein professionelles mittelgroßes Websystem langfristig besser wartbar ist, und begründe die Entscheidung.

Beginne jetzt mit der kritischen Analyse des vorhandenen Modells.
