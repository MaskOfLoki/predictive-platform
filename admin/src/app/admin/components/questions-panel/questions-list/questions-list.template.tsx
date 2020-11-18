import m from 'mithril';
import {QuestionsListComponent} from './questions-list.component';
import {QuestionSetComponent} from './question-set/question-set.component';

export function template(ctrl: QuestionsListComponent) {
    return (
        <div class='gc-questions-list'>
            {ctrl.questionSets().map(questionSet =>
                <QuestionSetComponent
                    isLive={ctrl.isLive}
                    questionSet={questionSet}
                    onedit={ctrl.buttonEditHandler.bind(ctrl)}
                    ondelete={ctrl.buttonRemoveHandler.bind(ctrl)}
                    onmakelive={ctrl.onmakelive}
                    onmoveup={ctrl.onmoveup}
                    onmovedown={ctrl.onmovedown}
                    onsetmoveup={ctrl.onsetmoveup}
                    onsetmovedown={ctrl.onsetmovedown}
                    onsaveevent={ctrl.onsaveevent}/>)}
        </div>
    );
}
