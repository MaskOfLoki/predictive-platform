import {BaseComponent} from '../../utils/BaseComponent';
import {template} from './splash.template';
import './splash.component.scss';

export class SplashComponent extends BaseComponent {
  public view() {
    return template(this);
  }
}
