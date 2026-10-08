# Designsystem Kettenhof NRW

Alle Tokens stehen in `src/styles.css` (`@theme`) und sind als Tailwind-Klassen nutzbar
(`bg-ink-900`, `text-orange-500`, `text-petrol-200` …).

## Farbverteilung 60-30-10

| Anteil | Rolle | Farbe | Einsatz |
|---|---|---|---|
| 60 % | Dominant | `#111417` (ink-900) | Hintergründe, Flächen (Karten: `#1a1e22`) |
| 30 % | Sekundär | `#F26A1B` (orange-500) | Struktur, Linien, Icons, sekundäre Buttons, aktive Navigation |
| 10 % | Akzent | `#1F5F6B` (petrol-500) | Haupt-CTA, Badges, Ladebalken, Drag-Over |

## Kontraste (WCAG 2.1 AA)

Die Vorgabefarben erfüllen nicht in jeder Kombination AA. Deshalb gelten diese Regeln:

| Kombination | Kontrast | Regel |
|---|---|---|
| Weiß auf Orange | 3,06 : 1 ✗ | **nicht verwenden** |
| Dunkel `#111417` auf Orange | 6,03 : 1 ✓ | Schrift auf orangen Flächen ist immer dunkel |
| Petrol auf Dunkel (als Schrift) | 2,56 : 1 ✗ | **nicht verwenden** |
| Petrol hell `#6CC3D3` auf Dunkel | 9,14 : 1 ✓ | Petrol als Schrift, Icon, Fokusring |
| Weiß auf Petrol | 7,22 : 1 ✓ | Petrol-Buttons mit weißer Schrift |
| Petrol-Rand `#2A8798` auf Dunkel | 4,42 : 1 ✓ | Rand um Petrol-Buttons (Bedienelemente ≥ 3 : 1) |
| Orange auf Dunkel | 6,03 : 1 ✓ | Überschriften-Akzente, Links |
| Text `#F2F0EC` auf Dunkel | 16,2 : 1 ✓ | Fließtext |
| Grau `#A7AEB5` auf Karte | 7,48 : 1 ✓ | Nebentexte |
| Fehler `#FF7A7A` / Warnung `#F2C14E` auf Karte | 6,6 / 10,0 : 1 ✓ | Statusmeldungen |

## Umgesetzte Anforderungen

- **Tastatur:** Sprunglink „Zum Inhalt springen“, sichtbarer Fokusring, Dropzone über echtes
  `<input type="file">`, Filter als native Radiogruppe (Pfeiltasten), Escape schließt das Mobil-Menü.
- **Screenreader:** Landmarks (`header`, `nav`, `main`, `footer`), eindeutige Seitentitel, Fokus auf
  die `<h1>` nach Seitenwechsel, `aria-live` für Import-Status, `aria-sort` in der Tabelle, Fehler
  mit `role="alert"`.
- **Nicht nur Farbe (1.4.1):** Status immer mit Icon + Text, „belegt“ zusätzlich schraffiert.
- **Bewegung:** Alle Animationen entfallen bei „Bewegung reduzieren“ (`prefers-reduced-motion`).
- **Zielgrößen:** Buttons mindestens 44 px hoch.
- **Datenschutz:** Roboto wird lokal ausgeliefert (`@fontsource/roboto`), keine Anfrage an Google.

## Motion

| Element | Effekt |
|---|---|
| Abschnitte | Fade-in + 14 px nach oben, gestaffelt in 80-ms-Schritten (`appReveal="n"`) |
| Buttons | Hover: 1 px nach oben, Primär mit Lichtstreif; Klick: Skalierung 0,98 |
| Karten | Hover/Fokus: oranger Rand + Kante oben |
| Dropzone | Drag-Over: durchgezogener Petrol-Rand, Puls, Icon hebt sich |
| Import | Ladebalken (echter Fortschritt beim Lesen, unbestimmt beim Prüfen), Ergebnis blendet ein |

Easing überall: `cubic-bezier(0.22, 1, 0.36, 1)` (sanftes Ease-out).
