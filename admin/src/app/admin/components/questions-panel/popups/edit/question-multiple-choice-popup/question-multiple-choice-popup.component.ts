import {template} from './question-multiple-choice-popup.template';
import './question-multiple-choice-popup.component.scss';
import {
    QuestionOpenResponsePopupComponent,
    IQuestionOpenResponseAttrs,
} from '../question-open-response-popup/question-open-response-popup.component';
import {IMultipleChoiceQuestion, isEmptyString, QuestionType} from '../../../../../../../../../common';
import {PopupManager} from '../../../../../utils/PopupManager';
import {api} from '../../../../../services/api';
import {progressService} from '../../../../../services/ProgressService';
import { Vnode } from 'mithril';

export class QuestionMultipleChoicePopupComponent extends QuestionOpenResponsePopupComponent {
    public answers: string[] = ['', ''];
    constructor() {
        super();
        this.question.type = QuestionType.QUESTION_MULTIPLE_CHOICE;
        this.question.title = 'QUESTION - MULTIPLE CHOICE';
    }

    public oninit(vnode: Vnode<IQuestionOpenResponseAttrs, this>) {
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

        if (this.answers.some(answer =>
            this.answers.filter(item => item === answer).length > 1)) {
            PopupManager.warning('Please, remove duplicated answers');
            return false;
        }

        if (isEmptyString(this._question.title)) {
            PopupManager.warning('Please, provide question title');
            return false;
        }

        return true;
    }

    protected async onSave(): Promise<void> {
        if (this.isStarted && this.question.answers) {
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
