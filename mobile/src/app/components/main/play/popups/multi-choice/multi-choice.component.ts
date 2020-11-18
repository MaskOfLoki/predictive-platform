import {template} from './multi-choice.template';
import './multi-choice.component.scss';
import {ClassComponent, Vnode} from 'mithril';
import {
    getPayout,
    IMultipleChoiceQuestion,
    IQuestionAnswer,
    isEmptyString, IUser, QuestionType,
} from '../../../../../../../../common';
import * as MiniSignal from 'mini-signals';
import {api} from '../../../../../services/api';
import m from 'mithril';
import {MiniSignalBinding} from 'mini-signals';

interface IMultiChoiceAttrs {
    question: IMultipleChoiceQuestion;
    answers: IQuestionAnswer[];
    answer: IQuestionAnswer;
    closePopup: MiniSignal;
}

export class MultiChoiceComponent implements ClassComponent<IMultiChoiceAttrs> {
    private _question: IMultipleChoiceQuestion;
    private _closePopup: MiniSignal;
    private _playerAnswers: IQuestionAnswer[] = [];
    private _userId: string;
    private _answersAmount: Map<string, number> = new Map();

    private readonly _subscriptions: MiniSignalBinding[] = [];

    public value: string;

    public async oninit(vnode: Vnode<IMultiChoiceAttrs, this>) {
        this._question = vnode.attrs.question;
        this._closePopup = vnode.attrs.closePopup;
        this._subscriptions.push(api.user.add(this.userHandler.bind(this)));
        this._playerAnswers = vnode.attrs.answers;

        if (!this._playerAnswers || this._playerAnswers.length === 0) {
            this._playerAnswers = await api.getQuestionAnswers(this._question.id);
        }

        this.refreshAnswers();
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

    private refreshAnswers(): void {
        this._answersAmount.clear();
        let koef = 0;

        if (this._playerAnswers.length > 0) {
            koef = 100 / this._playerAnswers.length;
        }

        this._question.answers.forEach(answer => {
            const amount = this._playerAnswers.filter(item =>
                !!item && item.answer === answer).length;
            this._answersAmount.set(answer, Math.round(amount * koef));
        });

        m.redraw();
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

    public getAnswerAmount(answer: string): string {
        let amount = this._answersAmount.get(answer);

        if (amount == null) {
            amount = 0;
        }

        return `${amount} % of Users`;
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscriptions.forEach(item => item.detach());
    }

    public get question(): IMultipleChoiceQuestion {
        return this._question;
    }

    public get payout(): number {
        if (isEmptyString(this.value) && this._question.type !== QuestionType.POLL_MULTIPLE_CHOICE) {
            return 0;
        }

        return getPayout(this._question, this.value, this._playerAnswers, this._userId);
    }
}
