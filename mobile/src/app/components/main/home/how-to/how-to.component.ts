import {template} from './how-to.template';
import './how-to.component.scss';
import {BaseComponent} from '../../../../utils/BaseComponent';

export class HowToComponent extends BaseComponent {
    public view() {
        return template(this);
    }
}
