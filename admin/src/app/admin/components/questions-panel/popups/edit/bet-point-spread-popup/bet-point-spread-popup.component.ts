import './bet-point-spread-popup.component.scss';
import {BetMoneylinePopupComponent} from '../bet-moneyline-popup/bet-moneyline-popup.component';
import {template} from './bet-point-spread-popup.template';
import {IBetPointSpreadQuestion, QuestionType} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';

export class BetPointSpreadPopupComponent extends BetMoneylinePopupComponent {
    private _selectedOutcomeIndex = 0;

    constructor() {
        super();
        this.question.type = QuestionType.BET_POINT_SPREAD;
        this.question.teamA.outcomes = [{
            spread: 0,
        }];

        this.question.teamB.outcomes = [{
            spread: 0,
        }];
        this.question.title = 'BET - POINT SPREAD';

        this.teamAOdds = '-140';
        this.teamBOdds = '115';
    }

    protected validate(): boolean {
        if (!super.validate()) {
            return false;
        }

        this.question.teamA.outcomes.forEach(outcome => outcome.spread = parseFloat(outcome.spread.toString()));
        this.question.teamB.outcomes.forEach(outcome => outcome.spread = parseFloat(outcome.spread.toString()));

        if (this.question.teamA.outcomes.some(outcome => isNaN(outcome.spread)) ||
            this.question.teamB.outcomes.some(outcome => isNaN(outcome.spread))) {
            PopupManager.warning('Please, provide valid values for spread');
            return false;
        }

        return true;
    }

    public buttonAddOutcomeHandler(): void {
        this.question.teamA.outcomes.push({
            spread: 0,
        });

        this.question.teamB.outcomes.push({
            spread: 0,
        });

        this._selectedOutcomeIndex = this.question.teamA.outcomes.length - 1;
    }

    public buttonRemoveOutcomeHandler(): void {
        this.question.teamA.outcomes.splice(this._selectedOutcomeIndex);
        this.question.teamB.outcomes.splice(this._selectedOutcomeIndex);

        if (this._selectedOutcomeIndex >= this.question.teamA.outcomes.length) {
            this._selectedOutcomeIndex = this.question.teamA.outcomes.length - 1;
        }
    }

    public tabHandler(index: number): void {
        this._selectedOutcomeIndex = index;
    }

    public view() {
        return template(this);
    }

    public get question(): IBetPointSpreadQuestion {
        return this._question as IBetPointSpreadQuestion;
    }

    public get selectedOutcomeIndex(): number {
        return this._selectedOutcomeIndex;
    }

    public get teamASpread(): number {
        return this.question.teamA.outcomes[this._selectedOutcomeIndex].spread;
    }

    public set teamASpread(value: number) {
        this.question.teamA.outcomes[this._selectedOutcomeIndex].spread = value;
    }

    public get teamBSpread(): number {
        return this.question.teamB.outcomes[this._selectedOutcomeIndex].spread;
    }

    public set teamBSpread(value: number) {
        this.question.teamB.outcomes[this._selectedOutcomeIndex].spread = value;
    }
}
