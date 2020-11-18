import m, {ClassComponent, Vnode} from 'mithril';
import {template} from './poll-open-response-popup.template';
import './poll-open-response-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {IOpenResponseQuestion, isEmptyString, QuestionType, IGameState} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {uuid} from '@gamechangerinteractive/gc-firebase/utils';
import { api } from '../../../../../services/api';
import { MiniSignalBinding } from 'mini-signals';

export interface IPollOpenResponseAttrs {
    closePopup: MiniSignal;
    question: IOpenResponseQuestion;
}

export class PollOpenResponsePopupComponent implements ClassComponent {
    private _isStarted: boolean;
    private _subscription: MiniSignalBinding;

    protected _closePopup: MiniSignal;
    protected _question: IOpenResponseQuestion = {
        id: uuid(),
        question: '',
        subHeader: '',
        points: 100,
        type: QuestionType.POLL_OPEN_RESPONSE,
        title: 'POLL - OPEN RESPONSE',
    };

    public oninit(vnode: Vnode<IPollOpenResponseAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;

        if (vnode.attrs.question) {
            this._question = vnode.attrs.question;
        }

        this._subscription = api.state.add(this.stateHandler.bind(this));
    }

    public buttonCancelHandler() {
        this._closePopup.dispatch();
    }

    public async buttonConfirmHandler() {
        if (!this.validate()) {
            return;
        }

        await this.onSave();

        this._closePopup.dispatch(this._question);
    }

    protected async onSave(): Promise<void> {
        return;
    }

    protected stateHandler(value: IGameState): void {
        this._isStarted = !!value.sessionId;
        m.redraw();
    }

    protected validate(): boolean {
        if (isEmptyString(this.question.question)) {
            PopupManager.warning('Please, provide question');
            return false;
        }

        if (this.question.points <= 0) {
            PopupManager.warning('Please, provide points');
            return false;
        }

        if (isEmptyString(this._question.title)) {
            PopupManager.warning('Please, provide question title');
            return false;
        }

        return true;
    }

    public view() {
        return template(this);
    }

    public get question(): IOpenResponseQuestion {
        return this._question;
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }

}
