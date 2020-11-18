import m, {ClassComponent, Vnode} from 'mithril';
import {template} from './predictive-stats.template';
import './predictive-stats.component.scss';
import {
    getPayout,
    IMultipleChoiceQuestion,
    IOpenResponseQuestion,
    IQuestionAnswer,
    IUser,
    QuestionType,
} from '../../../../../../../../../common';
import {api} from '../../../../../../services/api';

interface IPredictiveStatsAttrs {
    question: IOpenResponseQuestion;
    answer: IQuestionAnswer;
    answers: IQuestionAnswer[];
}

export class PredictiveStatsComponent implements ClassComponent<IPredictiveStatsAttrs> {
    private _question: IOpenResponseQuestion;
    private _answer: IQuestionAnswer;
    private _answers: IQuestionAnswer[] = [];
    private _statistics: IStatistics = {
        total: 0,
        answers: [],
    };

    private _uid: string;

    constructor() {
        const subscription = api.user.add((user: IUser) => {
            if (user) {
                this._uid = user.uid;
                subscription.detach();
            }
        });
    }

    public oninit(vnode: Vnode<IPredictiveStatsAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IPredictiveStatsAttrs, this>) {
        if (this._question !== vnode.attrs.question ||
            this._question.awarded !== vnode.attrs.question.awarded) {
            this._question = vnode.attrs.question;
        }

        this._answer = vnode.attrs.answer;

        if (vnode.attrs.answers && this._answers !== vnode.attrs.answers) {
            this._answers = vnode.attrs.answers;
            this.refreshAnswers();
        }
    }

    private refreshAnswers(): void {
        if (!this._question || !this._uid) {
            return;
        }

        this._statistics.total = this._answers.length;

        if (this._question.type === QuestionType.POLL_MULTIPLE_CHOICE ||
            this._question.type === QuestionType.QUESTION_MULTIPLE_CHOICE) {
            this._statistics.answers = (this._question as IMultipleChoiceQuestion).answers.map(answer => {
                const result: IAnswerInfo = {
                    answer,
                    total: 0,
                    percentage: 0,
                    bucks: 0,
                };

                if (this._question.correctAnswer) {
                    result.isCorrect = answer === this._question.correctAnswer;
                }

                return result;
            });
        } else {
            this._statistics.answers = [];

            if (this._question.correctAnswer) {
                this._statistics.answers.push({
                    answer: this._question.correctAnswer,
                    total: 0,
                    percentage: 0,
                    bucks: 0,
                    isCorrect: true,
                });
            }
        }

        this._answers.forEach(answer => {
            let answerInfo: IAnswerInfo = this._statistics.answers.find(
                item => item.answer === answer.answer,
            );

            if (answerInfo) {
                answerInfo.total++;
            } else {
                answerInfo = {
                    answer: answer.answer,
                    total: 1,
                    percentage: 0,
                    bucks: 0,
                };

                if (this._question.correctAnswer) {
                    answerInfo.isCorrect = answer.answer === this._question.correctAnswer;
                }

                this._statistics.answers.push(answerInfo);
            }
        });

        this._statistics.answers.forEach(answer => {
            if (this._statistics.total > 0) {
                answer.percentage = Math.round(100 * answer.total / this._statistics.total);
            }

            answer.bucks = getPayout(this._question, answer.answer, this._answers);
        });

        this.updateAnswerInfo();
        m.redraw();
    }

    private updateAnswerInfo(): void {
        if (!this._answer) {
            return;
        }

        const answerInfo: IAnswerInfo = this._statistics.answers.find(item =>
            item.answer === this._answer.answer);

        if (!answerInfo) {
            return;
        }

        answerInfo.isCurrentUserAnswer = true;
    }

    public async clickHandler(answerInfo: IAnswerInfo) {
        if (this._question.locked ||
            this._question.awarded ||
            this._question.type !== QuestionType.QUESTION_MULTIPLE_CHOICE) {
            return;
        }

        await api.submitAnswer({
            questionId: this._question.id,
            type: this._question.type,
            answer: answerInfo.answer,
            payout: answerInfo.bucks,
        });
    }

    public view() {
        return template(this);
    }

    public get question(): IOpenResponseQuestion {
        return this._question;
    }

    public get answer(): IQuestionAnswer {
        return this._answer;
    }

    public get statistics(): IStatistics {
        return this._statistics;
    }
}

interface IStatistics {
    total: number;
    answers: IAnswerInfo[];
}

export interface IAnswerInfo {
    answer: string;
    total: number;
    percentage: number;
    bucks: number;
    isCurrentUserAnswer?: boolean;
    isCorrect?: boolean;
}
