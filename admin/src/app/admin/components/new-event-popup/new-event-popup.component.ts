import {ClassComponent, Vnode} from 'mithril';
import {template} from './new-event-popup.template';
import './new-event-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {EventType, IEvent, isEmptyString} from '../../../../../../common';
import {PopupManager} from '../../utils/PopupManager';

export interface INewEventAttrs {
    event?: IEvent;
    closePopup: MiniSignal;
}

export class NewEventPopupComponent implements ClassComponent<INewEventAttrs> {
    private _closePopup: MiniSignal;
    private _event: IEvent = {
        id: '',
        type: EventType.PREDICTIVE,
        data: [],
        marketingMessages: [],
        progressMessage: '',
        completeMessage: '',
    };

    public editing = false;

    public oninit(vnode: Vnode<INewEventAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;
        if (vnode.attrs.event) {
            this._event = vnode.attrs.event;
            this.editing = true;
        }
    }

    public buttonCancelHandler(): void {
        this._closePopup.dispatch();
    }

    public buttonConfirmHandler(): void {
        if (isEmptyString(this._event.id)) {
            PopupManager.warning('Please, provide event name');
            return;
        }

        this._closePopup.dispatch(this._event);
    }

    public view() {
        return template(this);
    }

    public get event(): IEvent {
        return this._event;
    }
}
