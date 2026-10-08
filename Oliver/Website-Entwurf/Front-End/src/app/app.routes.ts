import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Maschinenverleih an Rhein und Ruhr',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'stammdaten',
    title: 'Stammdaten einpflegen',
    loadComponent: () =>
      import('./features/stammdaten-import/stammdaten-import.page').then(
        (m) => m.StammdatenImportPage,
      ),
  },
  {
    path: '**',
    title: 'Seite nicht gefunden',
    loadComponent: () =>
      import('./features/nicht-gefunden/nicht-gefunden.page').then((m) => m.NichtGefundenPage),
  },
];
