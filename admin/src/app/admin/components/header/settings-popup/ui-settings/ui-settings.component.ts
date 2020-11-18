import {ClassComponent} from 'mithril';
import {template} from './ui-settings.template';
import './ui-settings.component.scss';
import {fillDefaultConfig, IColors, IConfig} from '../../../../../../../../common';
import {api} from '../../../../services/api';
import {redraw} from 'mithril';
import {MiniSignalBinding} from 'mini-signals';
import {cloneObject} from '@gamechangerinteractive/gc-firebase/utils';

export class UiSettingsComponent implements ClassComponent {
    private _config: IConfig = fillDefaultConfig();
    private _subscription: MiniSignalBinding;
    public emailPassword: string;

    public oninit(vnode): any {
        this._subscription = api.config.add(this.configHandler.bind(this));
        this.emailPassword = localStorage.getItem('gc.email.validation');
    }

    private configHandler(value: IConfig): void {
        this._config = cloneObject(value);
        redraw();
    }

    public buttonActivateHandler() {
        api.saveConfig(this._config);
        localStorage.setItem('gc.email.validation', this.emailPassword);
    }

    public buttonResetHandler() {
        this._config = fillDefaultConfig();
        this.emailPassword = localStorage.getItem('gc.email.validation');
    }

    public view() {
        return template(this);
    }

    public onremove() {
        if (this._subscription) {
            this._subscription.detach();
        }
    }

    public get config(): IConfig {
        return this._config;
    }

    public get colors(): IColors {
        return this._config.colors;
    }
}
