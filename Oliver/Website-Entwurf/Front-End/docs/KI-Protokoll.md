# KI-Protokoll – Front-End-Grundgerüst

> Pflicht laut Projektregeln: Prompt und Bewertung des Ergebnisses dokumentieren.

| | |
|---|---|
| **Datum** | 08.10.2026 |
| **Werkzeug** | Claude Code (Modell Claude Opus 5.5) |
| **Prompt** | `_Repo/Oliver/Website-Entwurf/Website-Entwurf-masterprompt.md` + Kontext `CLAUDE.md`, `ER-Modell.md` |
| **Ergebnis** | Ordner `Front-End/` (Angular-Grundgerüst, Designsystem, Landing Page, Excel-Import) |

## Entscheidungen der KI (mit Begründung)

1. **Angular statt React:** `CLAUDE.md` legt Angular als Default fest, der Masterprompt erlaubt
   „vergleichbare Stacks“. Version 21, weil Angular 22 Node ≥ 22.22.3 verlangt (installiert: 22.22.1).
2. **Kundendaten statt Maschinendaten importieren:** `CLAUDE.md` §2.6 – „Maschinendaten werden neu
   erfasst, nicht importiert“; passt zu User Story 7.
3. **Farbkontraste korrigiert:** Weiß auf Orange und Petrol als Schrift fallen durch WCAG AA, deshalb
   dunkle Schrift auf Orange und eine helle Petrol-Abstufung (`docs/Designsystem.md`).
4. **Kein Speichern in die Datenbank:** Es gibt noch kein Supabase-Backend. Der Button ist vorbereitet,
   aber deaktiviert.

## Annahmen (bitte im Team prüfen)

- Spaltennamen der echten Excel-Kundenliste sind unbekannt → tolerante Erkennung, Liste in
  `spalten-zuordnung.ts` erweiterbar.
- Alte Kundennummern werden übernommen (nicht neu aus `nummernkreis` vergeben).
- Kontaktdaten, Impressum, Datenschutz: Platzhalter „folgt“.
- Maschinenkategorien auf der Startseite sind Platzhalter bis zur Datenbankanbindung.

## Gemeldete Unstimmigkeiten im ER-Modell (nicht verändert)

- `lagerbewegung.lieferposition_id` → `lieferung.id` (bereits in `CLAUDE.md` bekannt).
- `plz_ort_id.ort_id` ist `varchar`, `ort.id` aber `int` – Fremdschlüssel mit unterschiedlichen Typen.
- `plz.plz` ist `int` – führende Nullen (z. B. 01067 Dresden) gehen verloren; Empfehlung `char(5)`.

## Prüfung durch die KI

- Build ohne Fehler/Warnungen, 33 Unit-Tests grün (Spaltenzuordnung, Validierung).
- Im Browser getestet: Import mit Beispieldatei (10 Zeilen, erwartete 1/3/6 Verteilung), 180 Zeilen
  (Seiten, Sortierung, Filter, Suche), defekte Datei (Fehlermeldung), Mobilansicht, Tastatur-Menü.
- axe-core 4.10 (WCAG 2.1 A/AA + Best Practice): 0 Verstöße.

## Bewertung durch das Team

*(vom Team auszufüllen: Was war brauchbar, was musste korrigiert werden, wie gut war der Prompt?)*
