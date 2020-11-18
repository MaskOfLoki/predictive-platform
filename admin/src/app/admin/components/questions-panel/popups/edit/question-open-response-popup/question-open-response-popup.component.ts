import m, {ClassComponent, Vnode} from 'mithril';
import {template} from './question-open-response-popup.template';
import './question-open-response-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {MiniSignalBinding} from 'mini-signals';
import {
    IGameState,
    IOpenResponseQuestion,
    isEmptyString,
    QuestionSubType,
    QuestionType,
} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {uuid} from '@gamechangerinteractive/gc-firebase/utils';
import {api} from '../../../../../services/api';

export interface IQuestionOpenResponseAttrs {
    closePopup: MiniSignal;
    question: IOpenResponseQuestion;
}

export class QuestionOpenResponsePopupComponent implements ClassComponent {
    protected _closePopup: MiniSignal;
    protected _question: IOpenResponseQuestion = {
        id: uuid(),
        title: 'QUESTION - OPEN RESPONSE',
        type: QuestionType.QUESTION_OPEN_RESPONSE,
        question: '',
        subHeader: '',
        subType: QuestionSubType.PREDICTIVE,
        points: 100,
    };

    protected _isStarted: boolean;

    private _subscription: MiniSignalBinding;

    public oninit(vnode: Vnode<IQuestionOpenResponseAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;

        if (vnode.attrs.question) {
            this._question = vnode.attrs.question;
        }

        this._subscription = api.state.add(this.stateHandler.bind(this));
    }

    protected stateHandler(value: IGameState): void {
        this._isStarted = !!value.sessionId;
        m.redraw();
    }

    public subTypeChangeHandler(value: QuestionSubType, selected: boolean) {
        if (selected) {
            this._question.subType = value;
        }
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

    protected validate(): boolean {
        if (isEmptyString(this._question.question)) {
            PopupManager.warning('Please, provide question');
            return false;
        }

        if (this._question.points <= 0) {
            PopupManager.warning('Please, provide points');
            return false;
        }

        if (isEmptyString(this._question.title)) {
            PopupManager.warning('Please, provide question title');
            return false;
        }

        if (this._question.subType === QuestionSubType.LIVE &&
            (isNaN(this._question.timer) || this._question.timer <= 0)) {
            PopupManager.warning('Please, provide timer value');
            return false;
        }

        return true;
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
    }

    public get question(): IOpenResponseQuestion {
        return this._question;
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }
}
