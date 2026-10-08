import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowRight,
  LucideCalendarCheck,
  LucideClock,
  LucideConstruction,
  LucideForklift,
  LucideMail,
  LucideMapPin,
  LucidePackage,
  LucidePhone,
  LucideReceiptText,
  LucideShovel,
  LucideTrees,
  LucideWrench,
} from '@lucide/angular';

import { SLOGAN } from '../../core/navigation';
import { RevealDirective } from '../../shared/ui/reveal.directive';

interface Kachel {
  titel: string;
  text: string;
  icon: string;
}

interface Belegungstag {
  kuerzel: string;
  tag: string;
  frei: boolean;
}

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    RevealDirective,
    LucideArrowRight,
    LucideCalendarCheck,
    LucideClock,
    LucideConstruction,
    LucideForklift,
    LucideMail,
    LucideMapPin,
    LucidePackage,
    LucidePhone,
    LucideReceiptText,
    LucideShovel,
    LucideTrees,
    LucideWrench,
  ],
  templateUrl: './home.page.html',
})
export class HomePage {
  protected readonly slogan = SLOGAN;

  protected readonly leistungen: readonly Kachel[] = [
    {
      icon: 'kalender',
      titel: 'Online reservieren',
      text: 'Verfügbarkeit prüfen und Maschinen verbindlich reservieren – jederzeit, ohne Warteschleife.',
    },
    {
      icon: 'wartung',
      titel: 'Gewartet & geprüft',
      text: 'Wartungen werden anhand der Betriebsstunden vorausschauend geplant, bevor es zu Ausfällen kommt.',
    },
    {
      icon: 'rechnung',
      titel: 'Transparente Abrechnung',
      text: 'Nachvollziehbare Rechnungen mit allen Pflichtangaben – digital, revisionssicher und übersichtlich.',
    },
    {
      icon: 'paket',
      titel: 'Verbrauchsmaterial',
      text: 'Passendes Zubehör und Verbrauchsmaterial direkt zur gebuchten Maschine mitbestellen.',
    },
  ];

  /** Platzhalter-Kategorien bis der Katalog aus der Datenbank kommt. */
  protected readonly kategorien: readonly Kachel[] = [
    { icon: 'bagger', titel: 'Erdbewegung', text: 'Bagger, Lader und Dumper' },
    {
      icon: 'verdichtung',
      titel: 'Verdichtung & Absicherung',
      text: 'Rüttelplatten, Baustellensicherung',
    },
    { icon: 'hebe', titel: 'Hebe- & Transporttechnik', text: 'Stapler, Arbeitsbühnen' },
    {
      icon: 'garten',
      titel: 'Garten & Landschaft',
      text: 'Geräte für Grünflächen und Außenanlagen',
    },
  ];

  protected readonly ablauf: readonly Omit<Kachel, 'icon'>[] = [
    {
      titel: 'Maschine wählen',
      text: 'Nach Kategorie, Zeitraum und Standort filtern und vergleichen.',
    },
    {
      titel: 'Zeitraum reservieren',
      text: 'Wunschtermin festlegen – Sie erhalten sofort eine Bestätigung.',
    },
    {
      titel: 'Übernehmen & loslegen',
      text: 'Einsatzbereite Maschine übernehmen und direkt starten.',
    },
  ];

  /** Beispieldaten für die Hero-Vorschau – keine echten Belegungen. */
  protected readonly beispielwoche: readonly Belegungstag[] = [
    { kuerzel: 'Mo', tag: 'Montag', frei: false },
    { kuerzel: 'Di', tag: 'Dienstag', frei: false },
    { kuerzel: 'Mi', tag: 'Mittwoch', frei: true },
    { kuerzel: 'Do', tag: 'Donnerstag', frei: true },
    { kuerzel: 'Fr', tag: 'Freitag', frei: true },
    { kuerzel: 'Sa', tag: 'Samstag', frei: true },
    { kuerzel: 'So', tag: 'Sonntag', frei: false },
  ];
}
