import './bet-over-under-popup.component.scss';
import {BetMoneylinePopupComponent} from '../bet-moneyline-popup/bet-moneyline-popup.component';
import {template} from './bet-over-under-popup.template';
import {IBetOverUnderQuestion, QuestionType} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';

export class BetOverUnderPopupComponent extends BetMoneylinePopupComponent {
    private _selectedOutcomeIndex = 0;

    constructor() {
        super();
        this.question.type = QuestionType.BET_OVER_UNDER;

        this.question.teamA.outcomes = [{
            over: 0,
        }];

        this.question.teamB.outcomes = [{
            under: 0,
        }];

        this.question.title = 'BET - OVER-UNDER';

        this.teamAOdds = '110';
        this.teamBOdds = '-120';
    }

    protected validate(): boolean {
        if (!super.validate()) {
            return false;
        }

        if (this.question.teamA.outcomes.some(
            item => isNaN(item.over)) ||
            this.question.teamB.outcomes.some(
                item => isNaN(item.under))) {
            PopupManager.warning('Please, provide valid values for over and under.');
            return false;
        }

        return true;
    }

    public buttonAddOutcomeHandler(): void {
        this.question.teamA.outcomes.push({
            over: 0,
            under: 0,
        });

        this.question.teamB.outcomes.push({
            over: 0,
            under: 0,
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

    public get question(): IBetOverUnderQuestion {
        return this._question as IBetOverUnderQuestion;
    }

    public get selectedOutcomeIndex(): number {
        return this._selectedOutcomeIndex;
    }

    public get teamAOver(): number {
        return this.question.teamA.outcomes[this._selectedOutcomeIndex].over;
    }

    public set teamAOver(value: number) {
        this.question.teamA.outcomes[this._selectedOutcomeIndex].over = value;
    }

    public get teamBUnder(): number {
        return this.question.teamB.outcomes[this._selectedOutcomeIndex].under;
    }

    public set teamBUnder(value: number) {
        this.question.teamB.outcomes[this._selectedOutcomeIndex].under = value;
    }
}
