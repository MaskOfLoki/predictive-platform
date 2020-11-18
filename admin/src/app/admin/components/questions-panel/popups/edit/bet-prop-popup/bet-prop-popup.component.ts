import {ClassComponent, Vnode} from 'mithril';
import {template} from './bet-prop-popup.template';
import './bet-prop-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {IBetPropQuestion, isEmptyString, QuestionType} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {uuid} from '@gamechangerinteractive/gc-firebase/utils';

interface IBetPropAttrs {
    closePopup: MiniSignal;
    question?: IBetPropQuestion;
}

export class BetPropPopupComponent implements ClassComponent {
    protected _closePopup: MiniSignal;
    protected _question: IBetPropQuestion = {
        id: uuid(),
        title: 'BET - PROP BET',
        type: QuestionType.BET_PROP,
        min: 100,
        max: 10000,
        outcomes: [],
        description: '',
        americanOdds: true,
    };

    public oninit(vnode: Vnode<IBetPropAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;

        if (vnode.attrs.question) {
            this._question = vnode.attrs.question;
        }
    }

    public buttonCancelHandler() {
        this._closePopup.dispatch();
    }

    public buttonConfirmHandler() {
        if (!this.validate()) {
            return;
        }
        this._question.outcomes.map(outcome => outcome.odds = parseFloat(outcome.odds as any));
        this._closePopup.dispatch(this._question);
    }

    protected validate(): boolean {
        this._question.outcomes.forEach(outcome => outcome.odds = parseFloat(outcome.odds.toString()));

        if (isEmptyString(this._question.description)) {
            PopupManager.warning('Please, provide description');
            return false;
        }

        if (this._question.outcomes.length === 0) {
            PopupManager.warning('Please, add outcomes');
            return false;
        }

        if (this._question.outcomes.some(outcome => isEmptyString(outcome.text))) {
            PopupManager.warning('Please, fill all outcomes');
            return false;
        }

        if (this._question.outcomes.some(outcome => isNaN(outcome.odds))) {
            PopupManager.warning('All outcome odds must be valid numbers');
            return false;
        }

        if (this._question.americanOdds) {
            if (this._question.outcomes.some(outcome => {
                return outcome.odds < 99 && outcome.odds > -99;
            })) {
                PopupManager.warning('All outcome odds must be greater than 99 or less than -99');
                return false;
            }
        } else {
            if (this._question.outcomes.some(outcome => outcome.odds <= 0)) {
                PopupManager.warning('All outcome odds must be greater than 0');
                return false;
            }
        }

        if (this._question.outcomes.some(
            outcome => this._question.outcomes.filter(item => item.text === outcome.text).length > 1)) {
            PopupManager.warning('Please, remove duplicated outcomes');
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

    public get question(): IBetPropQuestion {
        return this._question;
    }
}
