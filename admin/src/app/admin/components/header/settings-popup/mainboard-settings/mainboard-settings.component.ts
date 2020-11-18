import m, {ClassComponent} from 'mithril';
import {template} from './mainboard-settings.template';
import './mainboard-settings.component.scss';
import {MiniSignalBinding} from 'mini-signals';
import {fillDefaultMainboardConfig, IMainboardConfig, IMainboardState, MainboardLayout} from '../../../../../utils';
import {LeaderboardType} from '../../../../../../../../common';

export class MainboardSettingsComponent implements ClassComponent {
    private readonly _subscription: MiniSignalBinding;
    private _layout: MainboardLayout;
    private _config: IMainboardConfig = fillDefaultMainboardConfig().config;

    public leaderboardType: LeaderboardType = LeaderboardType.OVERALL;

    constructor() {
        // this._subscription = mainboardService.state.add(this.stateHandler.bind(this));
    }

    private stateHandler(value: IMainboardState): void {
        value = fillDefaultMainboardConfig(value);
        this._config = value.config;
        this._layout = value.layout ? value.layout : MainboardLayout.FULLSCREEN;
        m.redraw();
    }

    public layoutChangeHandler(value: MainboardLayout) {
        // mainboardService.updateLayout(value);
    }

    public buttonResetHandler() {
        this._config = fillDefaultMainboardConfig().config;
    }

    public buttonActivateHandler() {
        // mainboardService.updateConfig(this._config);
    }

    public view() {
        return template(this);
    }

    public onremove() {
        // this._subscription.detach();
    }

    public get layout(): MainboardLayout {
        return this._layout;
    }

    public get config(): IMainboardConfig {
        return this._config;
    }
}
