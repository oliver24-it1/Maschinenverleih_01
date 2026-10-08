import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HAUPTNAVIGATION, SLOGAN } from '../../navigation';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  protected readonly navigation = HAUPTNAVIGATION.filter((e) => e.pfad);
  protected readonly slogan = SLOGAN;
  protected readonly jahr = new Date().getFullYear();
}
