import {template} from './open-response.template';
import './open-response.component.scss';
import m, {ClassComponent, Vnode} from 'mithril';
import {
    getPayout,
    IOpenResponseQuestion,
    IQuestionAnswer,
    isEmptyString,
    IUser,
    QuestionType,
} from '../../../../../../../../common';
import * as MiniSignal from 'mini-signals';
import {MiniSignalBinding} from 'mini-signals';
import {api} from '../../../../../services/api';

interface IOpenResponseAttrs {
    question: IOpenResponseQuestion;
    closePopup: MiniSignal;
    answers: IQuestionAnswer[];
    answer: IQuestionAnswer;
}

export class OpenResponseComponent implements ClassComponent<IOpenResponseAttrs> {
    private _question: IOpenResponseQuestion;
    private _closePopup: MiniSignal;
    private _playerAnswers: IQuestionAnswer[] = [];
    private _userId: string;
    private readonly _subscriptions: MiniSignalBinding[] = [];

    public value: string;

    public async oninit(vnode: Vnode<IOpenResponseAttrs, this>) {
        this._subscriptions.push(api.user.add(this.userHandler.bind(this)));
        this._question = vnode.attrs.question;
        this._closePopup = vnode.attrs.closePopup;
        this._playerAnswers = vnode.attrs.answers;
        const answer: IQuestionAnswer = vnode.attrs.answer;

        if (!answer) {
            return;
        }

        this.value = answer.answer;
        m.redraw();
    }

    private userHandler(user: IUser): void {
        if (user) {
            this._userId = user.uid;
            m.redraw();
        }
    }

    public buttonCloseHandler(): void {
        this._closePopup.dispatch();
    }

    public async buttonSubmitHandler(): Promise<void> {
        await api.submitAnswer({
            questionId: this._question.id,
            type: this._question.type,
            answer: this.value,
            payout: this.payout,
        });
        this._closePopup.dispatch();
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscriptions.forEach(item => item.detach());
    }

    public get question(): IOpenResponseQuestion {
        return this._question;
    }

    public get payout(): number {
        if (this._question.type === QuestionType.QUESTION_OPEN_RESPONSE ||
            this._question.type === QuestionType.POLL_OPEN_RESPONSE) {
            return this._question.points;
        }

        if (isEmptyString(this.value)) {
            return 0;
        }

        return getPayout(this._question, this.value, this._playerAnswers, this._userId);
    }
}
