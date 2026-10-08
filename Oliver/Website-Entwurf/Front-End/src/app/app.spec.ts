import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('rendert Sprunglink, Hauptnavigation und Hauptbereich', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('a.skip-link')?.getAttribute('href')).toBe('#hauptinhalt');
    expect(el.querySelector('nav[aria-label="Hauptnavigation"]')).toBeTruthy();
    expect(el.querySelector('main#hauptinhalt')).toBeTruthy();
  });
});
