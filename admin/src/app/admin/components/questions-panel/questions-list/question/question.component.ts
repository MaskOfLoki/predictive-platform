import MiniSignal, { MiniSignalBinding } from 'mini-signals';
import m, { ClassComponent, Vnode } from 'mithril';

import { getLeftTime, IGameState, IQuestion, QuestionType } from '../../../../../../../../common';
import { api } from '../../../../services/api';
import { template } from './question.template';

import './question.component.scss';

interface IQuestionsListAttrs {
    question: IQuestion;
    active: boolean;
    ondelete: (question: IQuestion) => void;
    onedit: (question: IQuestion, isAward?: boolean) => void;
    onmakelive: (question: IQuestion) => void;
    onmoveup: (question: IQuestion) => void;
    onmovedown: (question: IQuestion) => void;
    answercountsignal: MiniSignal;
}

export class QuestionComponent implements ClassComponent<IQuestionsListAttrs> {
    private _question: IQuestion;
    private _ondelete: (question: IQuestion) => void;
    private _onedit: (question: IQuestion, isAward?: boolean) => void;
    private _onmakelive: (question: IQuestion) => void;
    private _onmoveup: (question: IQuestion) => void;
    private _onmovedown: (question: IQuestion) => void;
    private _isStarted: boolean;
    private _subscriptions: MiniSignalBinding[];
    private _timer: number;

    private _answerCount;

    public gettingAnswerCount = false;

    public oninit(vnode: Vnode<IQuestionsListAttrs, this>) {
        this._ondelete = vnode.attrs.ondelete;
        this._onedit = vnode.attrs.onedit;
        this._onmakelive = vnode.attrs.onmakelive;
        this._onmoveup = vnode.attrs.onmoveup;
        this._onmovedown = vnode.attrs.onmovedown;
        this.onbeforeupdate(vnode);
        this._subscriptions = [
            api.state.add(this.stateHandler.bind(this)),
        ];

        if (vnode.attrs.answercountsignal && this._question.type !== QuestionType.BANNER_IMAGE) {
            this._subscriptions.push(vnode.attrs.answercountsignal.add(this.checkAnswerCount.bind(this)));
        }
    }

    public onbeforeupdate(vnode: Vnode<IQuestionsListAttrs, this>) {
        const oldQuestion = this._question;
        this._question = vnode.attrs.question;

        if (oldQuestion && this._question.id === oldQuestion.id) {
            return;
        }
    }

    private async checkAnswerCount() {
        if (this.isStarted) {
            this.gettingAnswerCount = true;
            m.redraw();
            this._answerCount = await api.getQuestionAnswerCount(this._question.id);
            this.gettingAnswerCount = false;
            m.redraw();
        }
    }

    private stateHandler(value: IGameState): void {
        this._isStarted = !!value.sessionId;

        if (this._isStarted && this._timer == null) {
            this._timer = window.setInterval(() => m.redraw(), 1000);
        } else if (!this._isStarted && this._timer != null) {
            clearInterval(this._timer);
            this._timer = null;
        }

        if (!this._isStarted) {
            this._answerCount = null;
        }
    }

    public buttonMakeLiveHandler(event: Event): void {
        event.stopImmediatePropagation();
        this._onmakelive(this._question);
    }

    public buttonEditHandler(event: Event) {
        const target: HTMLElement = event.target as HTMLElement;

        if (target.classList.contains('btn')) {
            event.stopImmediatePropagation();

            if (target.classList.contains('button-edit')) {
                this._onedit(this._question, false);
            }
        } else {
            this._onedit(this._question, true);
        }
    }

    public buttonRemoveHandler() {
        this._ondelete(this._question);
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscriptions.forEach(sub => sub.detach());
    }

    public get question(): IQuestion {
        return this._question;
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }

    public get timer(): number {
        return getLeftTime(this._question);
    }

    public get onmoveup() {
        return this._onmoveup;
    }

    public get onmovedown() {
        return this._onmovedown;
    }

    public get answerCount(): number {
        return this._answerCount;
    }
}
