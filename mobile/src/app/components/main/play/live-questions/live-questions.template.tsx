import {LiveQuestionsComponent} from './live-questions.component';
import m from 'mithril';
import {LiveQuestionComponent} from './live-question/live-question.component';

export function template(ctrl: LiveQuestionsComponent) {
    return (
        <div class='gc-live-questions'>
            {ctrl.questions.map(question =>
                <LiveQuestionComponent question={question}/>)}
        </div>
    );
}
