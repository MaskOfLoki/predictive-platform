import {ClassComponent, Vnode} from 'mithril';
import {template} from './bet-moneyline-popup.template';
import './bet-moneyline-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {IBetMoneylineQuestion, isEmptyString, QuestionType} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {uuid} from '@gamechangerinteractive/gc-firebase/utils';

interface IBetMoneylineAttrs {
    closePopup: MiniSignal;
    question?: IBetMoneylineQuestion;
}

export class BetMoneylinePopupComponent implements ClassComponent<IBetMoneylineAttrs> {
    protected _closePopup: MiniSignal;
    protected _question: IBetMoneylineQuestion = {
        id: uuid(),
        title: 'BET - MONEYLINE',
        teamA: {
            name: 'TEAM A',
            odds: 3.60,
            logo: null,
        },
        teamB: {
            name: 'TEAM B',
            odds: 1.33,
            logo: null,
        },
        min: 100,
        max: 10000,
        americanOdds: true,
        type: QuestionType.BET_MONEYLINE,
    };

    public teamAOdds = '175';
    public teamBOdds = '-220';

    public oninit(vnode: Vnode<IBetMoneylineAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;

        if (vnode.attrs.question) {
            this._question = vnode.attrs.question;
            this.teamAOdds = this._question.teamA.odds.toString();
            this.teamBOdds = this._question.teamB.odds.toString();
        }
    }

    public buttonCancelHandler(): void {
        this._closePopup.dispatch();
    }

    public buttonConfirmHandler() {
        if (!this.validate()) {
            return;
        }

        this._question.teamA.odds = parseFloat(this.teamAOdds);
        this._question.teamB.odds = parseFloat(this.teamBOdds);
        this._closePopup.dispatch(this._question);
    }

    protected validate(): boolean {
        if (isEmptyString(this._question.teamA.name)) {
            PopupManager.warning('Please, provide Team A name');
            return false;
        }

        if (isEmptyString(this._question.teamB.name)) {
            PopupManager.warning('Please, provide Team B name');
            return false;
        }

        if (!this._question.teamA.logo) {
            PopupManager.warning('Please, provide Team A logo');
            return false;
        }

        if (!this._question.teamB.logo) {
            PopupManager.warning('Please, provide Team B logo');
            return false;
        }

        if (this._question.americanOdds) {
            const teamA = parseFloat(this.teamAOdds);
            if (isNaN(teamA)) {
                PopupManager.warning('Team A odds must be a valid number');
                return false;
            } else if (teamA > -100 && teamA < 100) {
                PopupManager.warning('Team A odds must be a value greater than 99 or less than -99');
                return false;
            }

            const teamB = parseFloat(this.teamBOdds);
            if (isNaN(teamB)) {
                PopupManager.warning('Team B odds must be a valid number');
                return false;
            } else if (teamB > -100 && teamB < 100) {
                PopupManager.warning('Team B odds must be a value greater than 99 or less than -99');
                return false;
            }
        } else {
            const teamA = parseFloat(this.teamAOdds);
            if (isNaN(teamA)) {
                PopupManager.warning('Team A odds must be a valid number greater than 0');
                return false;
            } else if (teamA <= 0) {
                PopupManager.warning('Team A odds must be a value greater than 0');
                return false;
            }

            const teamB = parseFloat(this.teamBOdds);
            if (isNaN(teamB)) {
                PopupManager.warning('Team B odds must be a valid number greater than 0');
                return false;
            } else if (teamB <= 0) {
                PopupManager.warning('Team B odds must be a value greater than 0');
                return false;
            }
        }

        if (this._question.min > this._question.max ||
            isNaN(this._question.min) ||
            isNaN(this._question.max)) {
            PopupManager.warning('Please, provide valid min and max values');
            return false;
        }

        if (isEmptyString(this._question.title)) {
            PopupManager.warning('Please, provide question title');
            return false;
        }

        return true;
    }

    public view() {
        return template(this);
    }

    public get question(): IBetMoneylineQuestion {
        return this._question;
    }
}
