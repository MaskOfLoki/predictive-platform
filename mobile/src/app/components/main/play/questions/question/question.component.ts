import {template} from './question.template';
import './question.component.scss';
import m, {ClassComponent, Vnode} from 'mithril';
import {
    IBannerQuestion,
    IBetMoneylineQuestion,
    IBetPropQuestion,
    IOpenResponseQuestion,
    IQuestion,
    IQuestionAnswer,
    IQuestionTeam,
    isBetQuestion,
    isEmptyString,
    isPollQuestion,
    QuestionSubType,
    QuestionType,
} from '../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {QuestionPopupFactory} from '../../../../../utils/QuestionPopupFactory';
import {api} from '../../../../../services/api';
import {isCorrect} from '../../../../../utils';
import {MiniSignalBinding} from 'mini-signals';

export interface IQuestionAttrs {
    question: IQuestion;
    label: string;
}

export class QuestionComponent implements ClassComponent<IQuestionAttrs> {
    protected _question: IQuestion;
    protected _label: string;
    protected _answer: IQuestionAnswer;
    protected _answers: IQuestionAnswer[] = [];
    protected readonly _subscription: MiniSignalBinding;

    public average = 0;

    constructor() {
        this._subscription = api.state.add(this.refreshAnswer.bind(this));
    }

    public oninit(vnode: Vnode<IQuestionAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IQuestionAttrs, this>) {
        this._label = vnode.attrs.label;
        const newQuestion = vnode.attrs.question;

        if (this._question !== newQuestion) {
            this._question = newQuestion;
            this.refreshAnswer();
        }
    }

    public onClick(): void {
        if (this._question.type === QuestionType.BANNER_IMAGE) {
            const banner = (this._question as IBannerQuestion);
            if (!isEmptyString(banner.redirectUrl)) {
                window.open(banner.redirectUrl, '_blank');
            }
        }
    }

    private async refreshAnswer() {
        if (!this._question) {
            return;
        }

        this._answer = await api.getSubmittedAnswer(this._question.id);

        if (this._answer) {
            if (isPollQuestion(this._question)) {
                this._question.awarded = true;
                this._question.locked = true;
            } else if (isBetQuestion(this._question)) {
                this._question.locked = true;
            }
        }

        m.redraw();

        this._answers = await api.getQuestionAnswers(this._question.id);

        if ((this._question.type === QuestionType.POLL_OPEN_RESPONSE ||
            this._question.type === QuestionType.QUESTION_OPEN_RESPONSE)
            && this._answers.length > 0) {
            const results = this._answers
                .map(answer => parseFloat(answer.answer));

            if (results.length === 0) {
                this.average = 0;
            } else {
                this.average = results.reduce((total, current) => total + current) / results.length;
            }
        }

        m.redraw();
    }

    public async clickHandler(): Promise<void> {
        if (this._question.locked ||
            this._question.awarded ||
            this._question.type === QuestionType.QUESTION_MULTIPLE_CHOICE) {
            return;
        }

        await PopupManager.show(QuestionPopupFactory.get(this._question.type), {
            question: this._question,
            answers: this._answers,
            answer: this._answer,
        });

        this.refreshAnswer();
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
    }

    public get label(): string {
        return this._label;
    }

    public get question(): IQuestion {
        return this._question;
    }

    public get hasTeams(): boolean {
        return !!this.teamA && !!this.teamB;
    }

    public get teamA(): IQuestionTeam {
        return (this._question as IBetMoneylineQuestion).teamA;
    }

    public get teamB(): IQuestionTeam {
        return (this._question as IBetMoneylineQuestion).teamB;
    }

    public get selectedTeam(): IQuestionTeam {
        if (!this._answer || !this.answer.team) {
            return null;
        }

        return this.answer.team === this.teamA.name ? this.teamA : this.teamB;
    }

    public get answer(): IQuestionAnswer {
        return this._answer;
    }

    public get answers(): IQuestionAnswer[] {
        return this._answers;
    }

    public get text(): string {
        let result = (this._question as IBetPropQuestion).description;

        if (!result) {
            result = (this._question as IOpenResponseQuestion).question;
        }

        return result;
    }

    public get subheader(): string {
        return (this._question as IOpenResponseQuestion).subHeader;
    }

    public get answerValue(): string {
        if (!this._answer) {
            return '';
        }

        if (this._answer.wager) {
            return this._answer.wager.toString();
        } else {
            return this._answer.answer;
        }
    }

    public get isPredictive(): boolean {
        return (this._question as IOpenResponseQuestion).subType === QuestionSubType.PREDICTIVE;
    }

    public get isCorrect(): boolean {
        return isCorrect(this._question, this._answer);
    }
}
