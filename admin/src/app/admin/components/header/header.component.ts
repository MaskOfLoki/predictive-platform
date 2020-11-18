import {redraw, ClassComponent} from 'mithril';
import {template} from './header.template';
import './header.component.scss';
import {PopupManager} from '../../utils/PopupManager';
import {SettingsPopupComponent} from './settings-popup/settings-popup.component';
import {api} from '../../services/api';

export class HeaderComponent implements ClassComponent {
    public userCount = 0;

    constructor() {
        api.userCount.add((count: number) => {
            this.userCount = count;
            redraw();
        });
    }

    public buttonSettingsHandler() {
        PopupManager.show(SettingsPopupComponent);
    }

    public view() {
        return template(this);
    }
}
