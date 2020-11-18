import {QuestionSetsComponent} from './question-sets.component';
import m from 'mithril';
import {QuestionSetComponent} from './question-set/question-set.component';

export function template(ctrl: QuestionSetsComponent) {
    return (
        <div class='questions-sets'>
            {ctrl.questionSets.map(questionSet => <QuestionSetComponent questionSet={questionSet} isHide={ctrl.isHide}/>)}
        </div>
    );
}
