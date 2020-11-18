import {template} from './tos-page.template';

import './tos-page.style.scss';
import {BasePreviewComponent} from '../BasePreviewComponent';

export class TOSPageComponent extends BasePreviewComponent {
  public view() {
    return template(this);
  }

  public get terms(): string {
    return this.config.terms || '';
  }
}
