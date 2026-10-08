Du agierst ab sofort als führender UI/UX-Designer und Senior Frontend-Entwickler. Wir erstellen gemeinsam eine moderne, performante Webanwendung. 

Lies zuerst aufmerksam das Dokument `Infomaterial/Claude.MD`.
Erstelle anschließend den Ordner `Front-End/` und arbeite ausschließlich innerhalb dieses Ordners für die Website.

---

### 1. Projekt-Grundlagen & CI/CD

- **Betriebsname:** Kettenhof NRW
- **Slogan:** „Leih an Rhein und Ruhr, rund um die Uhr“
- **Asset-Referenzen:** Nutze das vorhandene Logo aus dem Ordner `Infomaterial/` und die Schriftart **Roboto** (Google Fonts / lokale Einbindung) für das gesamte Typografie-System.
- **Design-Aesthetic:** Baustellen-/Bauunternehmens-Vibe – jedoch edel, bodenständig, familiär und hochprofessionell. KEIN überladener „AI-Generated“-Look (keine überflüssigen Glaseffekte, verwaschene Buntheit oder kitschigen Verläufe). Stattdessen: klare Kanten, wertige Micro-Interactions, erstklassige Whitespaces/Spacing und durchdachte Typografie.

---

### 2. Farbsystem & UI-Verteilung (60-30-10 Regel)

Verwende Tailwind CSS (oder CSS-Variablen) strikt nach folgendem Verteilungsschlüssel:
1. **60% Dominant (Hintergründe & Flächen):** Dunkles Schwarz/Grau (`#111417`). Bildet das edle, ruhige Fundament.
2. **30% Sekundär (Struktur, Karten, Schriften, sekundäre Buttons):** Kräftiges Bau-Orange (`#F26A1B`). Verleiht Präsenz, Struktur und Fokus.
3. **10% Akzent (Key Actions, Highlights, Status, Hero-Badges):** Petrol (`#1F5F6B`). Wird sparsam und gezielt für maximal wirksame Call-to-Actions (CTAs) und wichtige Akzente eingesetzt.

---

### 3. Motion Design, UX & Animationen

Das Design muss durch fließende, minimalistische Übergänge überzeugen:
- **Einstiegs-Animationen:** Subtiles Staggering/Fade-In von Elementen beim Scrollen (z. B. via Framer Motion / CSS Transitions) mit sanften Easy-Out Easing-Kurven.
- **Micro-Interactions:** 
  - Buttons reagieren haptisch auf Hover/Active (leichtes Skalieren oder eleganter Shimmer-Akzent).
  - Cards besitzen dezente Border-Highlight-Effekte bei Fokus/Hover.
- **Excel Drag-and-Drop UX (Kernfunktion):**
  - Große, einladende Landing-Zone mit gestrichelter Border.
  - Smooth-Transition beim Drag-Over (Farbumschlag & sanfter Puls-Effekt der Dropzone).
  - Visuelles Feedback nach dem Drop: Animierter Ladebalken/Spinner in Petrol (`#1F5F6B`), gefolgt von einer sauberen, gegliederten Tabellenvorschau der importierten Stammdaten mit Validation-Badges (Erfolg/Fehler).

---

### 4. Navigationsstruktur & Seitenumfang

Erstelle die Grundstruktur der Anwendung mit sauberm Routing / Navigation:

1. **Header / Navigation:**
   - Einbindung des Logos von Kettenhof NRW.
   - Slogan diskret integriert (z.B. im Topbar oder Footer).
   - Navigationselemente:
     - **Home** (Landing Page)
     - **Stammdaten einpflegen** (Excel-Import Zone)
     - *(Platzhalter/Disabled für spätere Module: Reservierung, Verleih, Material)*

2. **Seite 1: Landing Page (Home)**
   - Hero-Section: Klarer Titel, Slogan, CTA-Buttons und eine edle visueller Platzhalter-Grafik/Card.
   - Vertrauensbildende Abschnitte (Feature-Grid, Platzhalter für Maschinen-Vorschau, Kontakt/Footer).

3. **Seite 2: „Stammdaten einpflegen“**
   - Drag-and-Drop Uploadbereich für Excel-Dateien (`.xlsx`, `.xls`, `.csv`).
   - Interaktive Vorschau-Komponente (Data Grid/Table) mit Sortier- und Filteransatz für die eingelesenen Daten.
   - Status-Feedback für den Datei-Upload (Erfolgsmeldung, Zeilenzähler, Fehleranzeige).

---

### 5. Technische Vorgaben & Erstes Vorgehen

- Richte das Projekt modular auf (z. B. React/Next.js/Vite mit Tailwind CSS & Lucide Icons oder ein vergleichbarer moderner Stack).
- Achte auf sauberen, wiederverwendbaren Code (UI-Komponenten für Buttons, Inputs, Cards, Tables, Dropzones).
- Stelle sicher, dass die App komplett responsive (Mobile bis Ultrawide) ist.

**Nächster Schritt:**
Analysiere die Dateien in `Infomaterial/`, erstelle die Ordnerstruktur unter `Front-End/` und erstelle das Grundgerüst sowie das Styling-System. Zeige mir deinen Vorschlag für die Ordnerstruktur und starte mit der Implementierung.
