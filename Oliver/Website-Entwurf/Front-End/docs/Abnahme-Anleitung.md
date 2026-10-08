# Abnahme-Anleitung: Kettenhof NRW Front-End (Windows)

Diese Anleitung führt Schritt für Schritt durch Installation, Start und Abnahmetest der Website auf
einem Windows-PC. Am Ende steht ein Abnahmeprotokoll.

| | |
|---|---|
| **Umfang** | Landing Page, Navigation, Excel-Import der Kundenstammdaten (User Story 7), Barrierefreiheit |
| **Dauer** | ca. 15 Min. Installation + 30 Min. Test |
| **Voraussetzungen** | Windows 10/11, Internetzugang, Browser (Edge, Chrome oder Firefox), optional Excel |
| **Adminrechte** | nur für die Installation von Node.js |

---

## Schritt 0 – Projekt bereitstellen *(erledigt Oliver vorab)*

Der Ordner `Front-End` muss auf den PC des Scrum Masters. Entweder:

- **GitHub:** Ordner `Front-End` ins Repository `oliver24-it1/Maschinenverleih_01` committen und pushen, **oder**
- **ZIP:** Ordner `Front-End` zippen – **ohne** die Unterordner `node_modules`, `dist` und `.angular`
  (die entstehen automatisch neu und sind sehr groß).

---

## Schritt 1 – Node.js installieren

Node.js ist die Laufzeitumgebung, mit der die Website lokal gestartet wird.

1. <https://nodejs.org/de/download> öffnen.
2. Den **Windows-Installer (.msi)** der Version **24 LTS** herunterladen.
3. Installer ausführen, alle Standardeinstellungen mit **Weiter** bestätigen.
   Das Häkchen „Tools for Native Modules“ wird **nicht** benötigt.
4. Eingabeaufforderung öffnen: `Windows-Taste + R` → `cmd` eintippen → **Enter**.
5. Installation prüfen:

   ```bat
   node -v
   ```

   **Erwartet:** `v24.…` (z. B. `v24.11.0`)

   ```bat
   corepack --version
   ```

   **Erwartet:** eine Versionsnummer (z. B. `0.34.0`)

> **Hinweis:** Bitte Version **24 LTS** wählen. Ab Node.js 25 ist `corepack` nicht mehr enthalten
> (Lösung dann siehe [Fehlerbehebung](#fehlerbehebung)).

---

## Schritt 2 – Projekt auf den PC holen

> **Wichtig:** Einen kurzen Pfad **außerhalb von OneDrive** verwenden, z. B. `C:\Projekte`.
> Desktop und Dokumente werden oft mit OneDrive synchronisiert – das sperrt Dateien während der
> Installation und führt zu Fehlern. Zu lange Pfade können unter Windows ebenfalls Probleme machen.

1. Im Explorer den Ordner `C:\Projekte` anlegen.
2. **Variante ZIP:** ZIP-Datei nach `C:\Projekte` kopieren → Rechtsklick → **Alle extrahieren…** → **Extrahieren**.
   Nicht direkt aus der ZIP heraus arbeiten!

   **Variante GitHub mit Git:**

   ```bat
   cd /d C:\Projekte
   git clone https://github.com/oliver24-it1/Maschinenverleih_01.git
   ```

   **Variante GitHub ohne Git:** Auf der Repository-Seite **Code → Download ZIP**, dann wie bei Variante ZIP.

3. In den Ordner `Front-End` wechseln. Er enthält u. a. `package.json`, `src` und `testdaten`.

---

## Schritt 3 – Eingabeaufforderung im Projektordner öffnen

1. Im Explorer den Ordner `Front-End` öffnen.
2. Oben in die **Adressleiste** klicken, `cmd` eintippen und **Enter** drücken.
3. Es öffnet sich ein schwarzes Fenster, das bereits im richtigen Ordner steht
   (z. B. `C:\Projekte\Front-End>`).

> **Bitte die Eingabeaufforderung (cmd) verwenden, nicht PowerShell.** PowerShell blockiert auf vielen
> Schul-PCs das Ausführen von Skripten.

---

## Schritt 4 – Abhängigkeiten installieren

```bat
corepack pnpm install
```

- Beim ersten Mal fragt corepack: *„Corepack is about to download … pnpm-9.15.9.tgz. Do you want to
  continue? [Y/n]“* → `Y` eingeben und **Enter**.
- Dauer: ca. 1–3 Minuten.

**Erwartet:** Am Ende erscheint `Done in …s using pnpm v9.15.9`. Es entsteht der Ordner `node_modules`.

---

## Schritt 5 – Website starten

```bat
corepack pnpm start
```

**Erwartet** nach einigen Sekunden:

```
➜  Local:   http://localhost:4200/
```

1. Browser öffnen und **<http://localhost:4200>** aufrufen.
2. Falls die **Windows-Firewall** fragt: **Abbrechen** genügt – die Seite läuft nur lokal.
3. **Das schwarze Fenster während des Tests offen lassen.** Schließen = Website aus.
4. Beenden nach dem Test: im schwarzen Fenster `Strg + C` drücken, Frage mit `J` bestätigen.

---

## Schritt 6 – Abnahmetests

Die Testdateien liegen im Projekt unter `Front-End\testdaten\`. Alle Daten darin sind **fiktiv**.
In der Spalte „OK“ abhaken, Abweichungen unter „Bemerkung“ notieren.

### A – Startseite und Navigation

| Nr. | Aktion | Erwartetes Ergebnis | OK | Bemerkung |
|---|---|---|---|---|
| A1 | <http://localhost:4200> öffnen | Logo Kettenhof, Slogan „Leih an Rhein und Ruhr, rund um die Uhr“ oben, Überschrift „Starke Maschinen. Verlässlich verliehen.“ Browser-Tab: „Maschinenverleih an Rhein und Ruhr – Kettenhof NRW“ | ☐ | |
| A2 | Menüpunkte ansehen | „Home“ ist orange unterstrichen. „Reservierung“, „Verleih“, „Material“ tragen das Schild „Bald“ und sind nicht anklickbar | ☐ | |
| A3 | Auf „Maschinen ansehen“ klicken | Seite scrollt zum Abschnitt „Maschinenpark“ | ☐ | |
| A4 | Langsam nach unten scrollen, mit der Maus über Buttons und Karten fahren | Abschnitte blenden weich ein; Buttons heben sich leicht an; Karten bekommen einen orangen Rand | ☐ | |
| A5 | Im Menü auf „Stammdaten einpflegen“ klicken | Import-Seite öffnet sich, Menüpunkt jetzt orange, Tab-Titel „Stammdaten einpflegen – Kettenhof NRW“ | ☐ | |
| A6 | <http://localhost:4200/gibtsnicht> aufrufen | Seite „Diese Seite gibt es nicht.“ mit Button „Zur Startseite“ | ☐ | |

### B – Excel-Import (User Story 7)

| Nr. | Aktion | Erwartetes Ergebnis | OK | Bemerkung |
|---|---|---|---|---|
| B1 | Auf der Import-Seite „Vorlage herunterladen (CSV)“ klicken | Datei `kettenhof-vorlage-kunden.csv` landet im Download-Ordner | ☐ | |
| B2 | Diese Vorlage aus dem Explorer auf die Fläche „Excel-Datei hier ablegen“ ziehen | Vorschau: **Zeilen gesamt 2 · Fehlerfrei 2** | ☐ | |
| B3 | `testdaten\kunden-beispiel.xlsx` langsam auf die Fläche ziehen, **noch nicht loslassen** | Rahmen wird durchgezogen und petrolfarben, Text „Jetzt loslassen“, leichtes Pulsieren | ☐ | |
| B4 | Loslassen | Kurz Ladebalken in Petrol, dann Vorschau: **Zeilen gesamt 10 · Fehlerfrei 1 · Mit Warnungen 3 · Mit Fehlern 6** | ☐ | |
| B5 | Tabelle ansehen (Spalte „Hinweise“) | Zeile 3 und 6: „Kundennummer doppelt“ · Zeile 4: „Bei Unternehmen ist der Firmenname Pflicht.“ · Zeile 5: „E-Mail-Adresse ist ungültig.“ und „PLZ „4109“ hat nur 4 Stellen – fehlt eine führende Null?“ · Zeile 8: „Anschrift unvollständig: Hausnummer fehlt.“ | ☐ | |
| B6 | „Spaltenzuordnung“ aufklappen | Erkannt u. a. „Kd-Nr → Kundennummer“, „Anschrift → Straße + Hausnummer“; nicht verwendet: „Bemerkung“ | ☐ | |
| B7 | Filter „Fehler“ wählen, danach „Alle“ | Erst 6 Zeilen, dann wieder 10 | ☐ | |
| B8 | Ins Suchfeld `Mustermann` eingeben, danach Feld leeren | Genau 1 Zeile (Erika Mustermann), danach wieder alle | ☐ | |
| B9 | Auf Spaltenkopf „Kundennr.“ klicken, dann noch einmal | Erst aufsteigend (Pfeil nach oben), dann absteigend (Pfeil nach unten) | ☐ | |
| B10 | „Andere Datei wählen“ → `testdaten\kunden-180-zeilen.xlsx` ablegen | **180 · Fehlerfrei 154 · Warnungen 0 · Fehler 26**; unter der Tabelle „Zeilen 1–25 von 180“ | ☐ | |
| B11 | Unter der Tabelle auf „Weiter“ klicken | „Zeilen 26–50 von 180“, „Seite 2 / 8“ | ☐ | |
| B12 | Eine beliebige PDF- oder Textdatei ablegen | Rote Meldung: „… ist keine Excel- oder CSV-Datei. Erlaubt sind .xlsx, .xls, .csv.“ | ☐ | |
| B13 | *Optional mit Excel:* Vorlage aus B1 in Excel öffnen, einen Nachnamen in `Müller` ändern, **Speichern unter → „CSV (Trennzeichen-getrennt)“**, Datei ablegen | Umlaut wird korrekt als „Müller“ angezeigt | ☐ | |
| B14 | Button „In Datenbank übernehmen“ ansehen | Ist bewusst ausgegraut – die Datenbank-Anbindung folgt im nächsten Sprint (Hinweistext daneben) | ☐ | |

### C – Barrierefreiheit (WCAG 2.1 AA)

| Nr. | Aktion | Erwartetes Ergebnis | OK | Bemerkung |
|---|---|---|---|---|
| C1 | Startseite neu laden (`F5`), einmal `Tab` drücken | Oben links erscheint „Zum Inhalt springen“ | ☐ | |
| C2 | Mit `Tab` weiter durch die Seite gehen | Jedes Bedienelement erhält einen gut sichtbaren hellblauen Rahmen; Reihenfolge logisch von oben nach unten | ☐ | |
| C3 | Auf der Import-Seite mit `Tab` bis zur Dropzone, dann `Enter` | Ganze Fläche ist umrahmt; `Enter` öffnet den Datei-Dialog von Windows | ☐ | |
| C4 | Nach einem Import mit `Tab` zum Statusfilter, dann `Pfeil rechts` | Filter wechselt auf „Fehler“, Tabelle aktualisiert sich | ☐ | |
| C5 | In Edge/Chrome `F12` → Reiter **Lighthouse** → nur „Barrierefreiheit“ anhaken → **Seitenaufbau analysieren** (Start- und Import-Seite) | Keine Einträge unter „Fehlgeschlagene Prüfungen“ | ☐ | |
| C6 | Windows: **Einstellungen → Barrierefreiheit → Visuelle Effekte → Animationseffekte: Aus**, Seite neu laden | Inhalte erscheinen sofort ohne Einblend-Animation (danach Einstellung zurücksetzen) | ☐ | |

### D – Responsive Darstellung

| Nr. | Aktion | Erwartetes Ergebnis | OK | Bemerkung |
|---|---|---|---|---|
| D1 | `F12` → `Strg + Umschalt + M` (Geräteansicht) → oben z. B. „iPhone 12 Pro“ wählen | Menü wird zum Button „Menü“; Inhalte einspaltig; keine seitliche Scrollleiste | ☐ | |
| D2 | „Menü“ antippen, dann `Esc` drücken | Menü klappt auf; `Esc` schließt es wieder | ☐ | |
| D3 | In der Geräteansicht eine Beispieldatei importieren | Tabelle lässt sich innerhalb ihres Rahmens seitlich wischen, die Seite selbst nicht | ☐ | |

### E – Automatische Prüfungen

Dafür ein **zweites** cmd-Fenster im Ordner `Front-End` öffnen (Schritt 3), das erste läuft weiter.

| Nr. | Befehl | Erwartetes Ergebnis | OK | Bemerkung |
|---|---|---|---|---|
| E1 | `corepack pnpm run test:einmal` | `Test Files 3 passed (3)` und `Tests 33 passed (33)` | ☐ | |
| E2 | `corepack pnpm run build` | `Application bundle generation complete.` ohne `ERROR` | ☐ | |

---

## Bekannte Grenzen (kein Mangel)

- Es gibt **noch kein Backend**: Importierte Daten werden nur geprüft und angezeigt, nicht gespeichert.
- Die Excel-Datei wird nur im Browser ausgewertet und **nicht hochgeladen** (Datenschutz).
- Kontaktdaten, Impressum, Datenschutzerklärung und der Maschinenkatalog sind als Platzhalter markiert.
- Reservierung, Verleih und Material sind spätere Module („Bald“).

---

## Fehlerbehebung

| Problem | Lösung |
|---|---|
| `"node" wird nicht als interner oder externer Befehl … erkannt` | cmd-Fenster schließen und neu öffnen. Hilft das nicht: Node.js neu installieren (Schritt 1) |
| `"corepack" wird nicht … erkannt` | Node.js 25 oder neuer installiert. Entweder Node.js 24 LTS installieren oder `npm install -g corepack` ausführen. Alternativ in allen Befehlen `corepack pnpm` durch `npx pnpm@9.15.9` ersetzen |
| `Die Ausführung von Skripts ist auf diesem System deaktiviert` | Das ist PowerShell. Stattdessen die Eingabeaufforderung `cmd` verwenden (Schritt 3) |
| `Port 4200 is already in use` | `corepack pnpm start --port 4300` und dann <http://localhost:4300> öffnen |
| Installation bricht mit Netzwerkfehler ab (`ECONNRESET`, `ETIMEDOUT`) | Das Schulnetz blockiert evtl. `registry.npmjs.org` oder `cdn.sheetjs.com`. Anderes Netz nutzen (z. B. Handy-Hotspot) und Schritt 4 wiederholen |
| `EPERM: operation not permitted` | Projekt liegt in OneDrive oder der Virenscanner sperrt Dateien. Nach `C:\Projekte` verschieben, Ordner `node_modules` löschen, Schritt 4 wiederholen |
| Browser zeigt „Diese Website ist nicht erreichbar“ | Läuft das schwarze Fenster aus Schritt 5 noch? Steht dort `Local: http://localhost:4200/`? |
| Seite bleibt weiß | `Strg + F5` drücken. Sonst `F12` → Reiter „Konsole“ → rote Meldung an Oliver schicken |

---

## Abnahmeprotokoll

| | |
|---|---|
| **Projekt** | Kettenhof NRW – Front-End (Landing Page, Excel-Import) |
| **Datum** | |
| **Geprüft von (Scrum Master)** | |
| **Entwickler** | Oliver Jidkov |
| **Testumgebung** | Windows-Version: ______ · Browser: ______ · Node.js: ______ |
| **Bestanden** | ____ von 31 Testfällen |

**Ergebnis:**
☐ Abgenommen  ☐ Abgenommen mit Auflagen  ☐ Nicht abgenommen

**Auflagen / Mängel:**

&nbsp;

&nbsp;

**Unterschrift Scrum Master:** ______________________ **Unterschrift Entwickler:** ______________________
