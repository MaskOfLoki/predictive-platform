import {ClassComponent} from 'mithril';
import {template} from './admin.template';
import './admin.component.scss';
import {IEvent} from '../../../../common';
import {api} from './services/api';

export class AdminComponent implements ClassComponent {
    public event: IEvent;

    constructor() {
        api.init();
    }

    public view() {
        return template(this);
    }
}
