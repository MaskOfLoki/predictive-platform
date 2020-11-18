import {template} from './home.template';
import './home.component.scss';
import {BaseComponent} from '../../../utils/BaseComponent';
import {MiniSignalBinding} from 'mini-signals';
import {IGameState} from '../../../../../../common';
import m from 'mithril';
import {api} from '../../../services/api';
import { FeatureFlags } from '../../../../../../feature-flags';

export class HomeComponent extends BaseComponent {
    private _isStarted: boolean;
    private readonly _subscription: MiniSignalBinding;

    constructor() {
        super();
        this._subscription = api.state.add(this.stateHandler.bind(this));
        if (!FeatureFlags.HomePage) {
            m.route.set('/play');
        }
    }

    public buttonLogoutHandler() {
        api.logout();
    }

    private stateHandler(value: IGameState) {
        this._isStarted = !!value.sessionId;
        m.redraw();
    }

    public view(vnode) {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }
}
