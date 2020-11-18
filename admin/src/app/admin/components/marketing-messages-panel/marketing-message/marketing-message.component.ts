import {ClassComponent, Vnode} from 'mithril';
import {template} from './marketing-message.template';
import './marketing-message.component.scss';
import {IMarketingMessage, isEmptyString, MARKETING_MESSAGE_MAX_LENGTH} from '../../../../../../../common';

interface IMarketingMessageAttrs {
    message: IMarketingMessage;
    onedit: (message: IMarketingMessage) => void;
    ondelete: (message: IMarketingMessage) => void;
}

export class MarketingMessageComponent implements ClassComponent<IMarketingMessageAttrs> {
    private _message: IMarketingMessage;
    private _onedit: (message: IMarketingMessage) => void;
    private _ondelete: (message: IMarketingMessage) => void;

    public oninit(vnode: Vnode<IMarketingMessageAttrs, this>) {
        this._onedit = vnode.attrs.onedit;
        this._ondelete = vnode.attrs.ondelete;
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IMarketingMessageAttrs, this>) {
        if (this._message !== vnode.attrs.message) {
            this._message = vnode.attrs.message;

            if (this._message && !isEmptyString(this._message.text)) {
                this._message.text = this._message.text.slice(0, MARKETING_MESSAGE_MAX_LENGTH);
            }
        }
    }

    public view() {
        return template(this);
    }

    public get message(): IMarketingMessage {
        return this._message;
    }

    public get onedit(): (message: IMarketingMessage) => void {
        return this._onedit;
    }

    public get ondelete(): (message: IMarketingMessage) => void {
        return this._ondelete;
    }
}
