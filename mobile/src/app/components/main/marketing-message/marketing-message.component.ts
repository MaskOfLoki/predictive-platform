import {ClassComponent} from 'mithril';
import {template} from './marketing-message.template';
import './marketing-message.component.scss';
import {IGameState, IMarketingMessage, isEmptyString, MARKETING_MESSAGE_MAX_LENGTH} from '../../../../../../common';
import {MiniSignalBinding} from 'mini-signals';
import {api} from '../../../services/api';
import m from 'mithril';

export class MarketingMessageComponent implements ClassComponent {
    private _message: IMarketingMessage;
    private _messages: IMarketingMessage[] = [];
    private _currentIndex: number;
    private _timer: number;

    private readonly _subscription: MiniSignalBinding;

    constructor() {
        this._subscription = api.state.add(this.stateHandler.bind(this));
    }

    public onClick() {
        if (this._message && this._message.redirectUrl) {
            window.open(this._message.redirectUrl, '_blank');
        }
    }

    private stateHandler(value: IGameState): void {
        if (!value.sessionId) {
            this._message = null;
            m.redraw();
            return;
        }

        this._messages = value.event.marketingMessages;

        if (this._currentIndex == null) {
            this._currentIndex = -1;
            this.showNextMessage();
        }
    }

    private showNextMessage(): void {
        if (this._messages.length === 0) {
            this._currentIndex = null;
            this._message = null;
            m.redraw();
            return;
        }

        this._currentIndex++;

        if (this._currentIndex >= this._messages.length) {
            this._currentIndex = 0;
        }

        this._message = this._messages[this._currentIndex];

        if (this._message && !isEmptyString(this._message.text)) {
            this._message.text = this._message.text.slice(0, MARKETING_MESSAGE_MAX_LENGTH);
        }

        this._timer = window.setTimeout(this.showNextMessage.bind(this), this._message.timer * 1000);
        m.redraw();
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
        clearTimeout(this._timer);
    }

    public get message(): IMarketingMessage {
        return this._message;
    }
}
