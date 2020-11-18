import {ClassComponent, Vnode} from 'mithril';
import {template} from './buttons-panel.template';
import './buttons-panel.component.scss';
import {api} from '../../services/api';
import {IGameState, IEvent} from '../../../../../../common';
import {PopupManager} from '../../utils/PopupManager';

interface IButtonsPanelAttrs {
    event: IEvent;
}

export class ButtonsPanelComponent implements ClassComponent<IButtonsPanelAttrs> {
    private _isStarted: boolean;
    private _event: IEvent;

    public oninit(vnode: Vnode<IButtonsPanelAttrs, this>) {
        this.onbeforeupdate(vnode);
        api.state.add(this.stateHandler.bind(this));
    }

    public onbeforeupdate(vnode: Vnode<IButtonsPanelAttrs, this>) {
        this._event = vnode.attrs.event;
    }

    private stateHandler(value: IGameState): void {
        this._isStarted = !!value.sessionId;
    }

    public buttonEventHandler() {
        if (!this._isStarted && (!this._event ||
            this._event.data.length === 0 ||
            !this._event.data.some(questionSet => questionSet.questions.length > 0))) {
            PopupManager.warning('Please, add at least one question');
            return;
        }

        this._isStarted = !this._isStarted;

        if (this._isStarted) {
            api.startEvent(this._event);
        } else {
            api.stopEvent();
        }
    }

    public buttonCouponsHandler() {
        // TODO
    }

    public view() {
        return template(this);
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }
}
