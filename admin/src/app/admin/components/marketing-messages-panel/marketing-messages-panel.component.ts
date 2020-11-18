import {ClassComponent, Vnode} from 'mithril';
import {template} from './marketing-messages-panel.template';
import './marketing-messages-panel.component.scss';
import {PopupManager} from '../../utils/PopupManager';
import {MarketingMessagePopupComponent} from './marketing-message-popup/marketing-message-popup.component';
import {IEvent, IGameState, IMarketingMessage} from '../../../../../../common';
import {api} from '../../services/api';
import m from 'mithril';
import {AlertPopupComponent} from '../alert-popup/alert-popup.component';
import {MiniSignalBinding} from 'mini-signals';

interface IMarketingMessagesAttrs {
    event: IEvent;
}

export class MarketingMessagesPanelComponent implements ClassComponent<IMarketingMessagesAttrs> {
    private _event: IEvent;
    private _isStarted: boolean;
    private readonly _subscription: MiniSignalBinding;

    constructor() {
        this._subscription = api.state.add(this.stateHandler.bind(this));
    }

    private stateHandler(value: IGameState): void {
        this._isStarted = !!value.sessionId;

        if (this._isStarted) {
            this._event = value.event;
            m.redraw();
        }
    }

    public oninit(vnode: Vnode<IMarketingMessagesAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IMarketingMessagesAttrs, this>) {
        if (this._isStarted) {
            return;
        }

        this._event = vnode.attrs.event;

        if (this._event && !this._event.marketingMessages) {
            this._event.marketingMessages = [];
        }
    }

    public async buttonNewMessageHandler() {
        const message: IMarketingMessage = await PopupManager.show(MarketingMessagePopupComponent);

        if (!message) {
            return;
        }

        this._event.marketingMessages.push(message);
        await api.saveEvent(this._event);
        m.redraw();
    }

    public async messageEditHandler(message: IMarketingMessage) {
        const result: IMarketingMessage = await PopupManager.show(MarketingMessagePopupComponent, {
            message,
        });

        if (!result) {
            return;
        }

        await api.saveEvent(this._event);
        m.redraw();
    }

    public async messageRemoveHandler(message: IMarketingMessage) {
        const result = await PopupManager.show(AlertPopupComponent, {
            title: 'WARNING',
            text: 'Are you sure you want to remove the message?',
        });

        if (!result) {
            return;
        }

        const index = this._event.marketingMessages.indexOf(message);

        if (index === -1) {
            return;
        }

        this._event.marketingMessages.splice(index, 1);
        await api.saveEvent(this._event);
        m.redraw();
    }

    public view() {
        return template(this);
    }

    public get event(): IEvent {
        return this._event;
    }
}
