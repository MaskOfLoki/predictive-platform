import {template} from './stats.template';

import './stats.style.scss';
import {BasePreviewComponent} from '../BasePreviewComponent';

export class StatsComponent extends BasePreviewComponent {
  public view() {
    return template(this);
  }
}
