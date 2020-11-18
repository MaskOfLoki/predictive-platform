import {template} from './home-screen.template';

import './home-screen.style.scss';
import {BasePreviewComponent} from '../BasePreviewComponent';

export class HomeScreenComponent extends BasePreviewComponent {
  public view() {
    return template(this);
  }
}
