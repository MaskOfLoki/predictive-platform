import {template} from './poll-multiple-choice-popup.template';
import './poll-multiple-choice-popup.component.scss';
import {IMultipleChoiceQuestion, isEmptyString, QuestionType} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {
    PollOpenResponsePopupComponent,
    IPollOpenResponseAttrs,
} from '../poll-open-response-popup/poll-open-response-popup.component';
import { api } from '../../../../../services/api';
import { progressService } from '../../../../../services/ProgressService';
import { Vnode } from 'mithril';

export class PollMultipleChoicePopupComponent extends PollOpenResponsePopupComponent {
    public answers: string[];
    constructor() {
        super();
        this.question.type = QuestionType.POLL_MULTIPLE_CHOICE;
        this.answers = ['', ''];
        this.question.title = 'POLL - MULTIPLE CHOICE';
    }

    public oninit(vnode: Vnode<IPollOpenResponseAttrs, this>) {
        super.oninit(vnode);
        this.answers = this.question.answers ? this.question.answers.slice(0) : this.answers;
    }

    public buttonAddAnswerHandler() {
        this.answers.push('');
    }

    public buttonRemoveAnswerHandler(answerIndex: number): void {
        this.answers.splice(answerIndex, 1);
    }

    protected validate(): boolean {
        if (!super.validate()) {
            return false;
        }

        if (this.answers.length === 0) {
            PopupManager.warning('Please, add at least 2 answers');
            return false;
        }

        if (this.answers.some(answer => isEmptyString(answer))) {
            PopupManager.warning('Please, fill all answers');
            return false;
        }

        return true;
    }

    protected async onSave(): Promise<void> {
        if (this.isStarted) {
            for (let i = 0; i < this.question.answers.length; ++i) {
                if (this.question.answers[i] !== this.answers[i]) {
                    await api.updateUserAnswers(
                        this.question,
                        i,
                        this.answers[i],
                        progressService.start('Scoring...', 'Updating {current} of {total} user answers'),
                    );
                }
            }

        }

        this.question.answers = this.answers;
    }

    public view() {
        return template(this);
    }

    public get question(): IMultipleChoiceQuestion {
        return this._question as IMultipleChoiceQuestion;
    }
}
