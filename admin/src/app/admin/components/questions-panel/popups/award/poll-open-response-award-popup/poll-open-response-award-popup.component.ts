import {ClassComponent, Vnode} from 'mithril';
import {template} from './poll-open-response-award-popup.template';
import './poll-open-response-award-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {IMultipleChoiceQuestion, IQuestionAnswer} from '../../../../../../../../../common';
import {api} from '../../../../../services/api';
import m from 'mithril';
import {getRandomColor, IAnswerInfo, IStatistics} from '../../../../../../utils';
// import {mainboardService} from '../../../../../services/MainboardService';

interface IBetPropAttrs {
    closePopup: MiniSignal;
    question: IMultipleChoiceQuestion;
}

export class PollOpenResponseAwardPopupComponent implements ClassComponent<IBetPropAttrs> {
    protected _closePopup: MiniSignal;
    protected _question: IMultipleChoiceQuestion;

    private _statistics: IStatistics = {
        total: 0,
        answers: [],
    };

    public async oninit(vnode: Vnode<IBetPropAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;
        this._question = vnode.attrs.question;
        this.calculateStatistics(await api.getQuestionAnswers(this._question.id));
    }

    private calculateStatistics(values: IQuestionAnswer[]): void {
        this._statistics.total = values.length;
        this._statistics.answers = [];

        values.forEach(answer => {
            let answerInfo: IAnswerInfo = this._statistics.answers.find(
                item => item.answer === answer.answer.toString(),
            );

            if (answerInfo) {
                answerInfo.total++;
            } else {
                answerInfo = {
                    answer: answer.answer.toString(),
                    total: 1,
                    color: getRandomColor(),
                };
                this._statistics.answers.push(answerInfo);
            }
        });

        this._statistics.answers.sort((p1, p2) => p2.total - p1.total);
        m.redraw();
    }

    public buttonCloseHandler(): void {
        this._closePopup.dispatch();
    }

    public view() {
        return template(this);
    }

    public buttonShareHandler() {
        // mainboardService.showPoll({
        //     statistics: this._statistics,
        //     question: this._question,
        // });
    }

    public get question(): IMultipleChoiceQuestion {
        return this._question;
    }

    public get statistics(): IStatistics {
        return this._statistics;
    }
}
