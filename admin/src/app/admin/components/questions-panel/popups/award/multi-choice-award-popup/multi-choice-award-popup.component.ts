import {ClassComponent, Vnode} from 'mithril';
import {template} from './multi-choice-award-popup.template';
import './multi-choice-award-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {IMultipleChoiceQuestion} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {api} from '../../../../../services/api';
import {progressService} from '../../../../../services/ProgressService';

interface IBetPropAttrs {
    closePopup: MiniSignal;
    question: IMultipleChoiceQuestion;
}

export class MultiChoiceAwardPopupComponent implements ClassComponent<IBetPropAttrs> {
    protected _closePopup: MiniSignal;
    protected _question: IMultipleChoiceQuestion;

    public oninit(vnode: Vnode<IBetPropAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;
        this._question = vnode.attrs.question;
    }

    public async buttonAwardHandler(): Promise<void> {
        if (this._question.correctAnswer == null) {
            PopupManager.warning('Please, select the outcome');
            return;
        }

        if (this._question.awarded) {
            const result = await PopupManager.confirm(
                'The question is already awarded. Do you want to change the answer?',
            );

            if (!result) {
                return;
            }
        }

        const result = await PopupManager.confirm(
            'Please verify the answer is correct before continuing',
            'DONE');

        if (!result) {
            return;
        }

        if (this._question.awarded) {
            await api.revertQuestionAward(
                this._question,
                progressService.start('Reverting...', 'Reverting {current} of {total} users'),
            );
        }

        api.awardQuestion(this._question,
            progressService.start('Scoring...', 'Scoring {current} of {total} users'));
        this._closePopup.dispatch();
    }

    public async buttonPushHandler(): Promise<void> {
        const result = await PopupManager.confirm(
            'Please verify the answer is correct before continuing',
            'DONE');

        if (!result) {
            return;
        }

        api.pushQuestion(this._question);
        this._closePopup.dispatch();
    }

    public buttonCloseHandler(): void {
        this._closePopup.dispatch();
    }

    public view() {
        return template(this);
    }

    public get question(): IMultipleChoiceQuestion {
        return this._question;
    }
}
