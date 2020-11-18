import m from 'mithril';
import {QuestionHeaderComponent} from './question-header.component';
import {BadgeComponent} from '../../badge/badge.component';

export function template(ctrl: QuestionHeaderComponent) {
    return (
        <div class='gc-question-header'>
            <div class='left'>
                <BadgeComponent question={ctrl.question}/>
                <input
                    value={ctrl.question.title}
                    oninput={e => ctrl.question.title = e.target.value}
                    onkeypress={e => e.target.value.length < 50}/>
            </div>
            <div class='right'>
                {ctrl.showHelp &&
                <div class='button'
                     onclick={ctrl.buttonHelpHandler.bind(ctrl)}>?</div>}
                <div class='button' onclick={ctrl.buttonCloseHandler.bind(ctrl)}>X</div>
            </div>
        </div>
    );
}
