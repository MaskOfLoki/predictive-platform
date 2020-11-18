import {ClassComponent, Vnode} from 'mithril';
import {template} from './poll-multi-choice-award-popup.template';
import './poll-multi-choice-award-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {IMultipleChoiceQuestion, IQuestionAnswer} from '../../../../../../../../../common';
import {api} from '../../../../../services/api';
import m from 'mithril';
import {IStatistics} from '../../../../../../utils';
// import {mainboardService} from '../../../../../services/MainboardService';

interface IBetPropAttrs {
    closePopup: MiniSignal;
    question: IMultipleChoiceQuestion;
}

export class PollMultiChoiceAwardPopupComponent implements ClassComponent<IBetPropAttrs> {
    protected _closePopup: MiniSignal;
    protected _question: IMultipleChoiceQuestion;

    private _statistics: IStatistics = {
        total: 0,
        answers: [],
    };

    private _colors: string[] = [];

    public async oninit(vnode: Vnode<IBetPropAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;
        this._question = vnode.attrs.question;
        this._colors = this._question.answers.map(() => getRandomColor());

        this.calculateStatistics(await api.getQuestionAnswers(this._question.id));
    }

    private calculateStatistics(values: IQuestionAnswer[]): void {
        this._statistics.total = values.length;
        this._statistics.answers = this._question.answers.map((answer, index) => {
            return {
                answer,
                total: values.filter(item => item.answer === answer).length,
                color: this._colors[index],
            };
        });

        this._statistics.answers.sort((p1, p2) => p2.total - p1.total);
        m.redraw();
    }

    public buttonCloseHandler(): void {
        this._closePopup.dispatch();
    }

    public buttonShareHandler() {
        // mainboardService.showPoll({
        //     statistics: this._statistics,
        //     question: this._question,
        // });
    }

    public view() {
        return template(this);
    }

    public get question(): IMultipleChoiceQuestion {
        return this._question;
    }

    public get statistics(): IStatistics {
        return this._statistics;
    }
}

function getRandomColor(): string {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`;
}
