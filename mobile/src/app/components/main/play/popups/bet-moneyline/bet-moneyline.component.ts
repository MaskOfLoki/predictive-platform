import {template} from './bet-moneyline.template';
import './bet-moneyline.component.scss';
import {ClassComponent, Vnode} from 'mithril';
import {
    IBetMoneylineQuestion, IQuestion,
    IQuestionAnswer,
    IQuestionTeam,
    IUser, oddsAmericanToDecimal,
} from '../../../../../../../../common';

import * as MiniSignal from 'mini-signals';
import {api} from '../../../../../services/api';
import m from 'mithril';
import {MiniSignalBinding} from 'mini-signals';
import {PopupManager} from '../../../../../utils/PopupManager';

interface IBetMoneylineAttrs {
    question: IBetMoneylineQuestion;
    closePopup: MiniSignal;
}

export class BetMoneylineComponent implements ClassComponent<IBetMoneylineAttrs> {
    protected _question: IQuestion;
    protected _closePopup: MiniSignal;

    private _selectedTeam: IQuestionTeam;
    private _bucks: number;
    private _subscription: MiniSignalBinding;
    private _isReadOnly: boolean;

    public value: number;

    public async oninit(vnode: Vnode<IBetMoneylineAttrs, this>) {
        this._subscription = api.user.add(this.userHandler.bind(this));
        this._question = vnode.attrs.question;
        this.value = this.question.min;
        this._closePopup = vnode.attrs.closePopup;
        const answer: IQuestionAnswer = await api.getSubmittedAnswer(this._question.id);

        if (!answer) {
            this._isReadOnly = false;
            return;
        }

        this._isReadOnly = true;
        this.value = answer.wager;
        this.checkSubmittedAnswer(answer);
    }

    protected checkSubmittedAnswer(answer: IQuestionAnswer) {
        this._selectedTeam = this.question.teamA.name === answer.team ? this.question.teamA : this.question.teamB;
        m.redraw();
    }

    private userHandler(value: IUser): void {
        this._bucks = value.bucks;
    }

    protected validate(): boolean {
        if (isNaN(this.value)) {
            PopupManager.warning('Please provide valid wager.');
            return false;
        } else if (this.value > this._bucks) {
            PopupManager.warning('You don\'t have enough points to place a bet.');
            return false;
        } else if (this.value < this.question.min || this.value > this.question.max) {
            PopupManager.warning(`Wager should be between ${this.question.min} and ${this.question.max}`);
            return false;
        }

        return true;
    }

    public buttonCloseHandler(): void {
        this._closePopup.dispatch();
    }

    public async buttonSubmitHandler(): Promise<void> {
        if (!this.validate()) {
            return;
        }

        await api.submitAnswer({
            questionId: this._question.id,
            wager: this.value,
            payout: this.payout,
            team: this._selectedTeam.name,
            type: this._question.type,
        });
        this._closePopup.dispatch();
    }

    public teamSelectionHandler(value: IQuestionTeam): void {
        this._selectedTeam = value;
    }

    public inputHandler(value: string): void {
        this.value = parseInt(value, 10);
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
    }

    public get question(): IBetMoneylineQuestion {
        return this._question as IBetMoneylineQuestion;
    }

    public get payout(): number {
        if (this._selectedTeam != null && this.value != null && !isNaN(this.value)) {
            const odds = this.question.americanOdds ?
                oddsAmericanToDecimal(this._selectedTeam.odds) :
                this._selectedTeam.odds;
            return Math.floor(this.value * odds);
        } else {
            return 0;
        }
    }

    public get isReadOnly(): boolean {
        return this._isReadOnly;
    }

    public get selectedTeam(): IQuestionTeam {
        return this._selectedTeam;
    }
}
