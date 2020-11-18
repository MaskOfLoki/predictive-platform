import {QuestionsComponent} from './questions.component';
import m from 'mithril';
import {QuestionComponent} from './question/question.component';
import { QuestionType } from '../../../../../../../common';

export function template(ctrl: QuestionsComponent) {
    const length = ctrl.questions.filter((question) => question.type !== QuestionType.BANNER_IMAGE).length;
    let idx = 1;
    return (
        <div class='gc-questions'>
            {ctrl.questions.map((question, index) =>
                <QuestionComponent question={question}
                                   label={
                                       (question.type !== QuestionType.BANNER_IMAGE) ?
                                        `QUESTION ${idx++}/${length}` : ''
                                    }
                                   locked={ctrl.locked}/>)}
        </div>
    );
}
