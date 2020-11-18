import {BaseComponent} from '../../utils/BaseComponent';
import {template} from './main.template';
import './main.component.scss';
import {IGameState} from '../../../../../common';
import m, {Vnode} from 'mithril';
import {MiniSignalBinding} from 'mini-signals';
import {api} from '../../services/api';

export class MainComponent extends BaseComponent {
    private _isStarted: boolean;
    private readonly _subscription: MiniSignalBinding;

    constructor() {
        super();
        this._subscription = api.state.add(this.stateHandler.bind(this));
    }

    private stateHandler(value: IGameState): void {
        const isStarted = !!value.sessionId;

        if (this._isStarted === false && isStarted && m.route.get() === '/rank') {
            m.route.set('/play');
        }

        this._isStarted = isStarted;
    }

    public view(vnode: Vnode) {
        return template(vnode);
    }

    public onremove() {
        this._subscription.detach();
    }
}
