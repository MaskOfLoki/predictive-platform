import './bet-prop.component.scss';

import {BetMoneylineComponent} from '../bet-moneyline/bet-moneyline.component';
import {template} from './bet-prop.template';
import {IBetPropQuestion, IQuestionAnswer, oddsAmericanToDecimal} from '../../../../../../../../common';
import {api} from '../../../../../services/api';
import m from 'mithril';

export class BetPropComponent extends BetMoneylineComponent {
    public selectedAnswer: string;

    protected checkSubmittedAnswer(answer: IQuestionAnswer) {
        this.selectedAnswer = answer.answer;
        m.redraw();
    }

    public async buttonSubmitHandler(): Promise<void> {
        if (!this.validate()) {
            return;
        }

        await api.submitAnswer({
            questionId: this._question.id,
            wager: this.value,
            payout: this.payout,
            answer: this.selectedAnswer,
            type: this._question.type,
        });

        this._closePopup.dispatch();
    }

    public view() {
        return template(this);
    }

    public get propQuestion(): IBetPropQuestion {
        return this._question as IBetPropQuestion;
    }

    public get payout(): number {
        if (this.value != null && !isNaN(this.value) && this.selectedAnswer != null) {
            const odds = this.propQuestion.americanOdds ? oddsAmericanToDecimal(this.odds) : this.odds;
            return Math.floor(this.value * odds);
        } else {
            return 0;
        }
    }

    private get odds(): number {
        if (this.selectedAnswer) {
            return this.propQuestion.outcomes.find(outcome => outcome.text === this.selectedAnswer).odds;
        } else {
            return 0;
        }
    }
}
