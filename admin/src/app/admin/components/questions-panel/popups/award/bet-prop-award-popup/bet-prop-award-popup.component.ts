import {ClassComponent, Vnode} from 'mithril';
import {template} from './bet-prop-award-popup.template';
import './bet-prop-award-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {IBetPropQuestion} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {api} from '../../../../../services/api';
import {progressService} from '../../../../../services/ProgressService';
import {delay} from '@gamechangerinteractive/gc-firebase/utils';

interface IBetPropAttrs {
    closePopup: MiniSignal;
    question?: IBetPropQuestion;
}

export class BetPropAwardPopupComponent implements ClassComponent<IBetPropAttrs> {
    protected _closePopup: MiniSignal;
    protected _question: IBetPropQuestion;

    public oninit(vnode: Vnode<IBetPropAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;

        if (vnode.attrs.question) {
            this._question = vnode.attrs.question;
        }
    }

    public async buttonAwardHandler(): Promise<void> {
        if (this._question.correctAnswer == null) {
            PopupManager.warning('Please, select the outcome');
            return;
        }

        const result = await PopupManager.confirm(
            'Please verify the answer is correct before continuing',
            'DONE');

        if (!result) {
            return;
        }

        const users = await api.awardQuestion(this._question,
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

    public get question(): IBetPropQuestion {
        return this._question;
    }
}
