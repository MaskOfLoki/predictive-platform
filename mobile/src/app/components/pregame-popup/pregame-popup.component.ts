import {BaseComponent} from '../../utils/BaseComponent';
import {IConfig, IFileData} from '../../../../../common';
import {template} from './pregame-popup.template';
import './pregame-popup.style.scss';

import {redraw, route} from 'mithril';
import {api} from '../../services/api';

export class PregamePopupComponent extends BaseComponent {
    public popup: IFileData;
    private readonly _subscription = api.config.add(this.configHandler.bind(this));

    private configHandler(value: IConfig) {
        if (value?.popup) {
            this.popup = value.popup;
            localStorage.setItem('popup_url', this.popup.url);
            redraw();
        } else {
            this.buttonClickHandler();
        }
    }

    public buttonClickHandler(): void {
        route.set('/home');
    }

    public view() {
        return template(this);
    }

    public onremove() {
        if (this._subscription) {
            this._subscription.detach();
        }
    }
}
