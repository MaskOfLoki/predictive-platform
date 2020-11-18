import {ClassComponent, Vnode} from 'mithril';
import {template} from './bet-moneyline-award-popup.template';
import './bet-moneyline-award-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {IBetMoneylineQuestion} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {api} from '../../../../../services/api';
import {progressService} from '../../../../../services/ProgressService';
import {delay} from '@gamechangerinteractive/gc-firebase/utils';

interface IBetMoneylineAttrs {
    closePopup: MiniSignal;
    question?: IBetMoneylineQuestion;
}

export class BetMoneylineAwardPopupComponent implements ClassComponent<IBetMoneylineAttrs> {
    protected _closePopup: MiniSignal;
    protected _question: IBetMoneylineQuestion;

    public oninit(vnode: Vnode<IBetMoneylineAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;

        if (vnode.attrs.question) {
            this._question = vnode.attrs.question;
        }
    }

    public async buttonAwardHandler(): Promise<void> {
        if (!this._question.winner) {
            PopupManager.warning('Please, select the winner');
            return;
        }

        const result = await PopupManager.confirm(
            'Please verify the answer is correct before continuing',
            'DONE');

        if (!result) {
            return;
        }

        const users = await api.awardQuestion(
            this._question,
            progressService.start('Scoring...', 'Scoring {current} of {total} users'));
        this._closePopup.dispatch();
        await delay(500);
        PopupManager.warning(`${users} users were awarded`);
    }

    public async buttonPushHandler(): Promise<void> {
        const result = await PopupManager.confirm(
            'Please verify the answer is correct before continuing',
            'DONE');

        if (!result) {
            return;
        }

        const users = await api.pushQuestion(this._question);
        this._closePopup.dispatch();
        await delay(500);
        PopupManager.warning(`${users} users were pushed`);
    }

    public buttonCloseHandler(): void {
        this._closePopup.dispatch();
    }

    public view() {
        return template(this);
    }

    public get question(): IBetMoneylineQuestion {
        return this._question;
    }
}
