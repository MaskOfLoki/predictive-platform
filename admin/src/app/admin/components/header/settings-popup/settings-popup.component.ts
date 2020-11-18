import {cloneObject} from '@gamechangerinteractive/gc-firebase/utils';
import * as MiniSignal from 'mini-signals';
import {MiniSignalBinding} from 'mini-signals';
import {ClassComponent, redraw} from 'mithril';

import {fillDefaultConfig, IConfig, IGameState} from '../../../../../../../common';
import {api} from '../../../services/api';
import {template} from './settings-popup.template';

import './settings-popup.component.scss';

export class SettingsPopupComponent implements ClassComponent {
    private _closePopup: MiniSignal;
    private _config: IConfig = fillDefaultConfig();
    private readonly _subscriptions: MiniSignalBinding[] = [];

    public selectedTab = 0;
    public gameStarted: boolean;

    public oninit(vnode): any {
        this._closePopup = vnode.attrs.closePopup;
        this._subscriptions.push(
            api.state.add(this.stateHandler.bind(this)),
            api.config.add(this.configHandler.bind(this)),
        );
    }

    private stateHandler(value: IGameState): void {
        this.gameStarted = !!value.sessionId && !!value.event;
        redraw();
    }

    private configHandler(value: IConfig) {
        this._config = cloneObject(value);
        redraw();
    }

    public buttonCloseHandler() {
        this._closePopup.dispatch();
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscriptions.forEach(sub => sub.detach());
    }

    public get config(): IConfig {
        return this._config;
    }
}
