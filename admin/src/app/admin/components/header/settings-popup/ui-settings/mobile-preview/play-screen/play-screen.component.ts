import {template} from './play-screen.template';

import './play-screen.style.scss';
import {BasePreviewComponent} from '../BasePreviewComponent';

export class PlayScreenComponent extends BasePreviewComponent {
  public view() {
    return template(this);
  }
}
