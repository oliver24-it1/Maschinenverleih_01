# Kettenhof NRW – Front-End

Weboberfläche des Maschinenverleihs „Kettenhof NRW“ (*Leih an Rhein und Ruhr, rund um die Uhr*).
Angular 21 · TypeScript (strict) · Tailwind CSS 4 · Lucide Icons · SheetJS

## Starten

Auf dem Rechner ist kein `npm` installiert – pnpm läuft über das mitgelieferte **corepack**:

```bash
corepack pnpm install        # Abhängigkeiten
corepack pnpm start          # Dev-Server → http://localhost:4200
corepack pnpm run build      # Produktions-Build → dist/front-end
corepack pnpm test           # Unit-Tests (Vitest, Watch-Modus)
corepack pnpm run test:einmal  # Unit-Tests einmalig (für Abnahme/CI)
```

**Abnahme unter Windows:** Schritt-für-Schritt-Anleitung mit Testfällen und Protokoll in
[docs/Abnahme-Anleitung.md](docs/Abnahme-Anleitung.md).

## Ordnerstruktur

```
src/
├── styles.css                    Designsystem: Farb-Tokens, Buttons, Karten, Dropzone, Tabelle
├── index.html                    lang="de", Meta-Daten
└── app/
    ├── app.ts / app.html         Rahmen: Sprunglink, Header, <main>, Footer, Fokus nach Seitenwechsel
    ├── app.routes.ts             Lazy-Routen mit Seitentiteln
    ├── core/
    │   ├── navigation.ts         Menüeinträge + Slogan (eine Quelle für Header und Footer)
    │   ├── layout/               site-header, site-footer
    │   └── services/             SeitentitelStrategie („Seite – Kettenhof NRW“)
    ├── models/                   Typen passend zum ER-Modell (kunde, adresse)
    ├── shared/ui/                wiederverwendbare Bausteine
    │   ├── dropzone/             Drag-and-Drop auf Basis von <input type="file">
    │   ├── data-table/           generische Tabelle: Sortierung, Seiten, Zell-Template
    │   └── reveal.directive.ts   Scroll-Einblendung mit Staggering
    └── features/
        ├── home/                 Landing Page
        ├── stammdaten-import/    Excel-Import (Seite + logik/)
        │   └── logik/            reine Funktionen, ohne Angular testbar
        │       ├── spalten-zuordnung.ts   Excel-Überschriften → Datenbankfelder
        │       ├── kunden-validierung.ts  Prüfregeln laut ER-Modell
        │       ├── excel-leser.service.ts Datei lesen (Fortschritt), SheetJS lazy
        │       └── vorlage.ts             CSV-Vorlage zum Herunterladen
        └── nicht-gefunden/       404-Seite
testdaten/                        fiktive Beispieldateien zum Vorführen
docs/                             Designsystem, KI-Protokoll
```

## Excel-Import (User Story 7)

- Liest `.xlsx`, `.xls`, `.csv` (max. 5 MB, 10 000 Zeilen) **nur im Browser** – nichts wird hochgeladen.
- Erkennt übliche Spaltennamen („Kd-Nr“, „E-Mail“, „Straße“ …) und teilt Sammelspalten („Hauptstr. 12“, „45127 Essen“).
- CSV: Semikolon/Komma automatisch, UTF-8 oder Windows-1252, führende Nullen bleiben erhalten.
- Prüfregeln aus `ER-Modell.md`: Pflichtfelder, CHECK `unternehmen ⇒ firmenname` / `privat ⇒ nachname`,
  Feldlängen, E-Mail, PLZ, USt-IdNr., Dubletten innerhalb der Datei.
- Die clientseitige Prüfung ist **Hilfe**, nicht Sicherheit. Die Übernahme in die Datenbank (Button
  vorbereitet) folgt über Supabase und wird dort erneut geprüft.

Zum Ausprobieren: `testdaten/kunden-beispiel.xlsx` auf die Dropzone ziehen.

## Barrierefreiheit (WCAG 2.1 AA / ISO 9241-110)

Geprüft mit axe-core 4.10: **0 Verstöße** auf Start- und Import-Seite (Desktop + Mobil).
Details und Kontrastwerte: [docs/Designsystem.md](docs/Designsystem.md).
